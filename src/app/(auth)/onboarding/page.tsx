import type { Metadata } from "next";
import OnboardingContainer from "./_components/onboarding-container";

export const metadata: Metadata = {
  title: "Onboarding | Humidor411",
  description: "Set up your Humidor411 retail experience.",
};

const OnboardingPage = () => <OnboardingContainer />;

export default OnboardingPage;
