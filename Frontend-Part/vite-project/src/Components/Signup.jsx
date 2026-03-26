
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const features = [
  "Free to get started",
  "Custom habit tracking",
  "Complete the task & mark it as a completed",
  "AI to help you i making habit list according to your choice"
];

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success === true) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert("Signup failed: " + result.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      {/* ── LEFT PANEL (desktop) / TOP BANNER (mobile) ── */}
      <div
        className="relative overflow-hidden
          flex flex-col justify-center gap-6
          px-8 py-10
          md:flex-1 md:px-10 md:py-16 md:gap-8"
        style={{ background: "linear-gradient(145deg, #3B5BF6 0%, #7B3FF5 60%, #9B3FF0 100%)" }}
      >
        {/* Decorative blobs — desktop only */}
        <div
          className="hidden md:block absolute w-72 h-72 rounded-full -top-16 -right-16 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="hidden md:block absolute w-48 h-48 rounded-full -bottom-12 -left-12 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <img
            src="/logo.png"
            alt="RoutineCraft"
            className="w-9 h-9 md:w-10 md:h-10 object-contain"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="text-lg md:text-xl font-bold tracking-tight">
            <span style={{ color: "#A5C8FF" }}>Routine</span>
            <span style={{ color: "#E0C4FF" }}>Craft</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug">
            Your journey to
            <br />
            <span style={{ color: "#C4AFFE" }}>better routines</span>
            <br />
            starts here.
          </h1>
          {/* Subtitle on mobile only */}
          <p className="mt-2 text-sm md:hidden" style={{ color: "rgba(255,255,255,0.75)" }}>
            Set your goals, craft your routine, and watch yourself grow.
          </p>
        </div>

        {/* Description — desktop only */}
        <p
          className="hidden md:block text-sm leading-relaxed z-10"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          Join thousands building consistent habits. Set your goals, craft your routine, and watch yourself grow.
        </p>

        {/* Features — desktop full list */}
        <ul className="hidden md:flex flex-col gap-3 z-10">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 text-sm"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.15)", color: "#C4AFFE" }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Mobile: feature pills */}
        <div className="flex flex-wrap gap-2 md:hidden z-10">
          {features.map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-5 py-10 md:px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-sm flex flex-col gap-4">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create account ✨</h2>
            <p className="text-sm text-gray-500 mt-1">Start building better habits today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", {
                  required: "Full Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" },
                })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-violet-400 transition-colors"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-violet-400 transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
                      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);
                      if (upperCaseCount < 2) return "Password must contain at least 2 uppercase letters";
                      if (!hasSpecialChar) return "Password must contain at least 1 special character";
                      if (value.length < 6) return "Password must be at least 6 characters";
                      return true;
                    },
                  })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "linear-gradient(135deg, #4F6CF7, #9B59F5)" }}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* Switch */}
          <p className="text-sm text-gray-500 text-center mt-1">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold" style={{ color: "#7B3FF5" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;