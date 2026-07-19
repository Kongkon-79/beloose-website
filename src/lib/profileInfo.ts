


export async function getProfile(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to get profile")
  }
  return resData
}


export async function updateAvatarInfo(token: string, payload: File) {
  const formData = new FormData();
  if (payload) formData.append("avatar", payload);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update profile image");
  return resData;
}


export async function changePassword(token: string, payload: { oldPassword: string; newPassword: string, confirmPassword: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update password");
  return resData;
}

export async function updateProfile(token: string, payload:{ firstName: string; lastName: string; email: string; phoneNumber: string; address: string;}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update profile");
  return resData;
}

export type UserProfile = {
  _id: string;
  fullName: string;
  businessName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  gender?: "male" | "female";
  dateOfBirth?: string;
  profilePicture?: string;
};

export type RetailerProfile = {
  _id: string;
  storeName: string;
  address: string;
  phoneNumber: string;
  city: string;
  description?: string;
  status?: string;
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

async function apiRequest<T>(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result;
}

export async function getRetailerSettings(token: string) {
  const [user, retailer] = await Promise.all([
    apiRequest<UserProfile>("/users/profile", token),
    apiRequest<RetailerProfile | null>("/retailer/profile/me", token),
  ]);
  return { user: user.data, retailer: retailer.data };
}

export async function updateRetailerSettings(
  token: string,
  user: Partial<UserProfile>,
  retailer: Partial<RetailerProfile>,
) {
  const [userResult, retailerResult] = await Promise.all([
    apiRequest<UserProfile>("/users/profile", token, {
      method: "PUT",
      body: JSON.stringify(user),
    }),
    apiRequest<RetailerProfile>("/retailer/profile/me", token, {
      method: "PUT",
      body: JSON.stringify(retailer),
    }),
  ]);
  return { user: userResult.data, retailer: retailerResult.data };
}
