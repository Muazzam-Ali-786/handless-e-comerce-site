"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createCustomer, createCustomerAccessToken } from "@/app/actions/shopify";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await createCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        acceptsMarketing: true,
      });

      if (res.customerUserErrors && res.customerUserErrors.length > 0) {
        const errMsg = res.customerUserErrors[0].message;
        if (errMsg.includes("credentials") || errMsg.includes("Shopify credentials")) {
          console.warn("Shopify API not configured. Falling back to local mock signup.");
          const displayName = `${data.firstName} ${data.lastName}`.trim();
          localStorage.setItem("user", JSON.stringify({ email: data.email, name: displayName }));
          router.push("/account");
          setIsSubmitting(false);
          return;
        }
        setServerError(errMsg);
        setIsSubmitting(false);
        return;
      }

      if (res.customer?.id) {
        // Automatically log them in after registration
        let token = null;
        try {
          const loginRes = await createCustomerAccessToken({
            email: data.email,
            password: data.password,
          });
          token = loginRes.customerAccessToken?.accessToken || null;
        } catch (e) {
          console.warn("Could not auto-login after register:", e);
        }

        const displayName = `${data.firstName} ${data.lastName}`.trim();
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: data.email,
            name: displayName,
            accessToken: token,
          })
        );
        router.push("/account");
      } else {
        setServerError("Could not create account. Please check details.");
      }
    } catch (err: any) {
      const errMsg = err?.message || err?.error?.message || "";
      if (errMsg.includes("credentials") || errMsg.includes("Shopify credentials")) {
        console.warn("Shopify API not configured. Falling back to local mock signup.");
        const displayName = `${data.firstName} ${data.lastName}`.trim();
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
          <h1 className="text-3xl font-light uppercase tracking-widest mb-2">Create Account</h1>
          <p className="text-sm text-gray-500 font-light">Join MAISON to track orders and save your favorites.</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-sm font-light">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1.5 font-light">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 mt-1.5 font-light">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5 font-light">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full border px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5 font-light">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-semibold uppercase tracking-widest text-xs py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6 font-light">
          Already have an account?{" "}
          <Link href="/account/login" className="text-black font-semibold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
