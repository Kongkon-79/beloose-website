


export async function getProfile(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
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
  formData.append("profilePicture", payload);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
    method: "PUT",
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
    body: JSON.stringify({ oldPassword: payload.oldPassword, newPassword: payload.newPassword }),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update password");
  return resData;
}

export async function updateProfile(token: string, payload:{ firstName: string; lastName: string; email: string; phoneNumber: string; address: string;}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
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
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  stateRegion?: string;
  nationality?: string;
  postcode?: string;
  gender?: "male" | "female";
  dateOfBirth?: string;
  profilePicture?: string;
};

type ApiResponse<T> = { success: boolean; message: string; data: T };

async function apiRequest<T>(path: string, token: string, init?: RequestInit) {
  const isFormData = init?.body instanceof FormData;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result;
}

export async function getProfileSettings(token: string) {
  const result = await apiRequest<UserProfile>("/user/profile", token);
  return result.data;
}

export async function updateProfileSettings(
  token: string,
  user: Partial<UserProfile>,
  profilePicture?: File,
) {
  const formData = new FormData();
  Object.entries(user).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, String(value));
  });
  if (profilePicture) formData.append("profilePicture", profilePicture);

  const result = await apiRequest<UserProfile>("/user/profile", token, {
    method: "PUT",
    body: formData,
  });
  return result.data;
}
