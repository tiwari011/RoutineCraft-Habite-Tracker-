import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    // Send to backend here
       try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
// response statuse check
      const result = await response.json();
     if(result.success==true){
       alert("Signup successful!");
        // Redirect to login page
      navigate("/login");
     } else {
       alert("Signup failed: " + result.message);
     }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
       {/*  FULL SCREEN LOADER */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-87.5 p-10 rounded-2xl shadow-xl flex flex-col items-center"
      >
        
        <h2 className="mt-6 text-2xl font-semibold text-gray-800">
          Sign Up
        </h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          {...register("name", {
            required: "Full Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters"
            }
          })}
          className="w-full mt-5 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address"
            }
          })}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
         <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"} 
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            validate: (value) => {
              const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
              const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

              if (upperCaseCount < 2) {
                return "Password must contain at least 2 uppercase letters";
              }

              if (!hasSpecialChar) {
                return "Password must contain at least 1 special character";
              }

              if (value.length < 6) {
                return "Password must be at least 6 characters";
              }

              return true;
            }
          })}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        )}
          <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-7 text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg 
                     hover:bg-gray-800 transition duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
        > 
      Sign up
        </button>

        {/* Login Link */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}

export default SignUp;
