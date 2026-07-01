"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCustomerAccessToken, getCustomer } from "@/app/actions/shopify";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await createCustomerAccessToken({
        email: data.email,
        password: data.password,
      });

      if (res.customerUserErrors && res.customerUserErrors.length > 0) {
        const errMsg = res.customerUserErrors[0].message;
        if (errMsg.includes("credentials") || errMsg.includes("Shopify credentials")) {
          console.warn("Shopify API not configured. Falling back to local mock login.");
          const name = data.email.split("@")[0];
          const displayName = name.charAt(0).toUpperCase() + name.slice(1);
          localStorage.setItem("user", JSON.stringify({ email: data.email, name: displayName }));
          router.push("/account");
          setIsSubmitting(false);
          return;
        }
        setServerError(errMsg);
        setIsSubmitting(false);
        return;
      }

      const tokenInfo = res.customerAccessToken;
      if (tokenInfo?.accessToken) {
        let displayName = data.email.split("@")[0];
        try {
          const customer = await getCustomer(tokenInfo.accessToken);
          if (customer) {
            displayName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.email.split("@")[0];
          }
        } catch (e) {
          console.warn("Could not fetch customer details:", e);
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            name: displayName,
            accessToken: tokenInfo.accessToken,
          })
        );
        router.push("/account");
      } else {
        setServerError("Invalid email or password.");
      }
    } catch (err: any) {
      const errMsg = err?.message || err?.error?.message || "";
      if (errMsg.includes("credentials") || errMsg.includes("Shopify credentials")) {
        console.warn("Shopify API not configured. Falling back to local mock login.");
        const name = data.email.split("@")[0];
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        localStorage.setItem("user", JSON.stringify({ email: data.email, name: displayName }));
        router.push("/account");
      } else {
        setServerError(errMsg || "Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-light uppercase tracking-widest mb-2">Login</h1>
          <p className="text-sm text-gray-500 font-light">Enter your email and password to access your account.</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-sm font-light">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5 font-light">{errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">Password</label>
              <Link href="#" className="text-xs text-gray-500 hover:text-black hover:underline transition-colors">Forgot Password?</Link>
            </div>
            <input
              type="password"
              {...register("password")}
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5 font-light">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-semibold uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6 font-light">
          Don't have an account?{" "}
          <Link href="/account/register" className="text-black font-semibold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
