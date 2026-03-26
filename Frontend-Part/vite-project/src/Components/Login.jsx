import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";


const features = [
  "Track habits daily with streaks",
  "Personalised lifestyle routines",
  "Simple, distraction-free interface",
   "Get notification for unfinished habits on the email",
  "Auto uncheck for next day a habit list for everyday",
  "AI to get suggestions according to your schedule"
];

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("token", result.jwtToken);
        localStorage.setItem("name", result.user.name);
      result.isNewUser ? navigate("/lifestyleselection") : navigate("/myday");
      
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem("token", result.jwtToken);
        localStorage.setItem("name", result.user.name);
          result.isNewUser ? navigate("/lifestyleselection") : navigate("/myday");

      } else {
        alert("Google login failed");
      }
    } catch (error) {
      console.log("Google login error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      {/* ── LEFT PANEL */}
      <div
        className="relative overflow-hidden
          flex flex-col justify-center gap-6
          px-8 py-10
          md:flex-1 md:px-10 md:py-16 md:gap-8"
        style={{ background: "linear-gradient(145deg, #3B5BF6 0%, #7B3FF5 60%, #9B3FF0 100%)" }}
      >
        {/*  hidden on mobile to keep it clean */}
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

        {/* Tagline*/}
        <div className="z-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug">
            Build habits that
            <br />
            <span style={{ color: "#C4AFFE" }}>actually stick.</span>
          </h1>
          {/* Subtitle visible on mobile only */}
          <p className="mt-2 text-sm md:hidden" style={{ color: "rgba(255,255,255,0.75)" }}>
            Design, track, and maintain daily routines — one habit at a time.
          </p>
        </div>

        {/* Description — desktop only */}
        <p
          className="hidden md:block text-sm leading-relaxed z-10"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          RoutineCraft helps you design, track, and maintain daily routines — one habit at a time.
        </p>

        {/* Features — desktop only */}
        <ul className="hidden md:flex flex-col gap-3 z-10">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 text-sm"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.15)", color: "#C4AFFE" }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Mobile: small feature*/}
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
            <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
            <p className="text-sm text-gray-500 mt-1">Login to continue your streak</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

            {/* Email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
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
                  {...register("password", { required: "Password is required" })}
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
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          {/* Switch */}
          <p className="text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold" style={{ color: "#7B3FF5" }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;