import type { Metadata } from "next";
import PaymentCancelContainer from "./_components/payment-cancel-container";

export const metadata: Metadata = {
  title: "Payment Cancelled | Humidor411",
};

const PaymentCancelPage = () => <PaymentCancelContainer />;

export default PaymentCancelPage;
