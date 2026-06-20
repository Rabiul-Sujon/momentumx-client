"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "@/lib/axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// ── Card Element styles ──────────────────────────────────────────
const CARD_STYLE = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "DM Sans, sans-serif",
      fontSize: "16px",
      "::placeholder": { color: "rgba(255,255,255,0.3)" },
    },
    invalid: { color: "#ff4d4d" },
  },
};

// ── Inner checkout form ──────────────────────────────────────────
function CheckoutForm({ cls }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Create payment intent
      const { data } = await axios.post("/api/payments/create-payment-intent", {
        classId: cls._id,
        amount: cls.price,
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.name, email: user?.email },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setProcessing(false);
        return;
      }

      // 3. Confirm booking on backend
      await axios.post("/api/payments/confirm", {
        classId: cls._id,
        paymentIntentId: result.paymentIntent.id,
        amount: cls.price,
      });

      toast.success("Payment successful! Class booked.");
      router.push("/dashboard/user");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Card input */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,212,255,0.2)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-3 font-semibold"
          style={{ color: "#00D4FF" }}
        >
          Card Details
        </p>
        <CardElement options={CARD_STYLE} />
      </div>

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 rounded-xl font-bold text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #00D4FF, #7B2FFF)",
        }}
      >
        {processing ? "Processing..." : `Pay $${cls.price}`}
      </button>

      <p
        className="text-center text-xs"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        🔒 Secured by Stripe
      </p>
    </form>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────
function PaymentPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classId = searchParams.get("classId");
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { data: cls, isLoading } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => axios.get(`/api/classes/${classId}`).then((r) => r.data),
    enabled: !!classId,
  });

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!classId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0F1E" }}
      >
        <p className="text-white">No class selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0F1E" }}
      >
        <span
          className="loading loading-spinner loading-lg"
          style={{ color: "#00D4FF" }}
        ></span>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen py-16 px-4"
      style={{ background: "#0A0F1E", fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Complete your booking for{" "}
            <span style={{ color: "#00D4FF" }}>{cls?.name}</span>
          </p>
        </div>

        {/* Order summary */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4 font-semibold"
            style={{ color: "#7B2FFF" }}
          >
            Order Summary
          </p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Class", value: cls?.name },
              { label: "Trainer", value: cls?.trainerName },
              { label: "Category", value: cls?.category },
              { label: "Schedule", value: `${cls?.schedule?.days} — ${cls?.schedule?.time}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.label}
                </span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
            <div
              className="border-t pt-3 mt-1 flex justify-between text-sm font-bold"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Total</span>
              <span style={{ color: "#00D4FF", fontSize: "1.1rem" }}>
                ${cls?.price}
              </span>
            </div>
          </div>
        </div>

        {/* Stripe form */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(0,212,255,0.1)",
          }}
        >
          <Elements stripe={stripePromise}>
            <CheckoutForm cls={cls} />
          </Elements>
        </div>

        {/* Cancel */}
        <button
          onClick={() => router.back()}
          className="w-full mt-4 py-3 text-sm transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Cancel and go back
        </button>
      </div>
    </main>
  );
}

// Suspense boundary required for useSearchParams in Next.js 15
export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentPageInner />
    </Suspense>
  );
}