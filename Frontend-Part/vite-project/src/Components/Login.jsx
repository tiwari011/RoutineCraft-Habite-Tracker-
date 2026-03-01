import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
console.log(result);
      if (result.success) {
        localStorage.setItem("token", result.jwtToken); 
          localStorage.setItem("name", result.user.name);  
        alert("Login successful!");
        // Dashboard
        navigate("/lifestyleselection");
      } else {
        alert("Login failed: " + result.message);
      }

    } catch (error) {
      console.log("Login error:", error);
    }
  };
  // google login
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    console.log(credentialResponse);

    // Send credential to backend
    const response = await fetch("http://localhost:8080/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential: credentialResponse.credential,
      }),
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("token", result.jwtToken);
      localStorage.setItem("name", result.user.name);
      navigate("/lifestyleselection");
    } else {
      alert("Google login failed");
    }

  } catch (error) {
    console.log("Google login error:", error);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-350px p-10 rounded-2xl shadow-xl flex flex-col items-center"
      >
        <h2 className="mt-6 text-2xl font-semibold text-gray-800">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          className="w-full mt-5 px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}

        <div className="relative w-full mt-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-teal-500 font-medium">
            Sign Up
          </Link>
        </p>
        <h1>or</h1>
<div className="mt-4 w-full flex justify-center">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => console.log("Google Login Failed")}
  />
</div>

      </form>
    </div>
  );
}

export default Login;

