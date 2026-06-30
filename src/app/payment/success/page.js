import PaymentSuccessPage from "@/components/payment/PaymentSuccessPage";
import { Suspense } from "react";

export default function PaymentSuccessRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-body text-[var(--color-text-secondary)]">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <PaymentSuccessPage />
    </Suspense>
  );
}
