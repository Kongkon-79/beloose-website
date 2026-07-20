import type { Metadata } from "next";
import SubscriptionContainer from "./_components/subscription-container";

export const metadata: Metadata = {
  title: "Subscription | Beloose",
  description: "Choose the Beloose subscription plan for your cigar retail business.",
};

const SubscriptionPage = () => <SubscriptionContainer />;

export default SubscriptionPage;
