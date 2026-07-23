export type OnboardingStatus = {
  isSubscription?: boolean;
  isRelailer?: boolean;
  isHumidor?: boolean;
  isInventory?: boolean;
  isQrCode?: boolean;
};

export const getOnboardingStep = (user: OnboardingStatus) => {
  if (!user.isRelailer) return 0;
  if (!user.isHumidor) return 1;
  if (!user.isInventory) return 2;
  if (!user.isQrCode) return 3;
  return 4;
};

export const getAuthenticatedRoute = (user: OnboardingStatus) => {
  if (!user.isSubscription) return "/subscription";
  return getOnboardingStep(user) === 4 ? "/retailer-dashboard" : "/onboarding";
};
