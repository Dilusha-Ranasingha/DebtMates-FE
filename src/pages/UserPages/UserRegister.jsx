"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import { registerUser } from "../../services/api"
import evaluatePasswordStrength from "../../utils/passwordStrength"

const UserRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  })
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "",
    color: "",
    score: 0,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === "password") {
      const strength = evaluatePasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.password) newErrors.password = "Password is required"
    else {
      const strength = evaluatePasswordStrength(formData.password)
      if (strength.score < 3) {
        newErrors.password = "Password must be at least Medium strength"
      }
    }
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await registerUser(formData)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Registration successful! Please login.",
        showConfirmButton: false,
        timer: 1500,
      })
      navigate("/user-login")
    } catch (error) {
      toast.error(error.response?.data || "Registration failed")
      setLoading(false)
    }
  }

  // Function to get the appropriate color class for the password strength text
  const getStrengthTextColor = () => {
    if (passwordStrength.color.includes("red")) return "text-red-500"
    if (passwordStrength.color.includes("yellow")) return "text-yellow-500"
    if (passwordStrength.color.includes("green")) return "text-green-500"
    return "text-gray-400"
  }

  // Function to get the appropriate color class for the password strength bar
  const getStrengthBarColor = () => {
    if (passwordStrength.color.includes("red")) return "bg-red-500"
    if (passwordStrength.color.includes("yellow")) return "bg-yellow-500"
    if (passwordStrength.color.includes("green")) return "bg-green-500"
    return "bg-gray-600"
  }

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">DebtMates</h1>
          <p className="text-gray-400 mt-1">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden backdrop-blur-sm">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.username ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200`}
                    placeholder="Choose a username"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.email ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/30 border ${errors.password ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200`}
                    placeholder="Create a strong password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">Password Strength:</span>
                    <span className={`text-sm font-medium ${getStrengthTextColor()}`}>{passwordStrength.strength}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthBarColor()}`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    ></div>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div
                      className={`flex items-center ${formData.password.length >= 8 ? "text-green-400" : "text-gray-400"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${formData.password.length >= 8 ? "text-green-400" : "text-gray-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={formData.password.length >= 8 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                        />
                      </svg>
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center ${/[A-Z]/.test(formData.password) ? "text-green-400" : "text-gray-400"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${/[A-Z]/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={/[A-Z]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                        />
                      </svg>
                      Uppercase letter
                    </div>
                    <div
                      className={`flex items-center ${/[a-z]/.test(formData.password) ? "text-green-400" : "text-gray-400"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${/[a-z]/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={/[a-z]/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                        />
                      </svg>
                      Lowercase letter
                    </div>
                    <div
                      className={`flex items-center ${/\d/.test(formData.password) ? "text-green-400" : "text-gray-400"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 mr-1 ${/\d/.test(formData.password) ? "text-green-400" : "text-gray-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={/\d/.test(formData.password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                        />
                      </svg>
                      Number
                    </div>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-white transition duration-200 flex items-center justify-center
                  ${loading ? "bg-blue-700/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <a
                href="/user-login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">&copy; 2023 DebtMates. All rights reserved.</p>
      </div>
      <Toaster />
    </div>
  )
}

export default UserRegister

