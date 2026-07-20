import type { Metadata } from "next";
import PaymentSuccessContainer from "./_components/payment-success-container";

export const metadata: Metadata = {
  title: "Payment Successful | Humidor411",
};

const PaymentSuccessPage = () => <PaymentSuccessContainer />;

export default PaymentSuccessPage;
