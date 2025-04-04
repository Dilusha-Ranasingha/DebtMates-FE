"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import { getProfile, updateProfile, changePassword } from "../../services/api"
import evaluatePasswordStrength from "../../utils/passwordStrength"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({ email: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "",
    color: "",
    score: 0,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await getProfile()
        setUser(response.data)
        setFormData({ email: response.data.email })
      } catch (error) {
        toast.error("Failed to load profile")
        navigate("/user-login")
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/user-login")
      return
    }
    fetchProfile()
  }, [navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({ ...passwordData, [name]: value })

    if (name === "newPassword") {
      const strength = evaluatePasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    return newErrors
  }

  const validatePassword = () => {
    const newErrors = {}
    if (!passwordData.currentPassword) newErrors.currentPassword = "Current password is required"
    if (!passwordData.newPassword) newErrors.newPassword = "New password is required"
    else {
      if (passwordData.newPassword.length < 8) newErrors.newPassword = "New password must be at least 8 characters"
      const strength = evaluatePasswordStrength(passwordData.newPassword)
      if (strength.score < 3) {
        newErrors.newPassword = newErrors.newPassword
          ? `${newErrors.newPassword} and must be at least Medium strength`
          : "New password must be at least Medium strength"
      }
    }
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
      await updateProfile(formData)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      })
      setErrors({})
    } catch (error) {
      toast.error(error.response?.data || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validatePassword()
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await changePassword(passwordData)
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Password changed successfully",
        showConfirmButton: false,
        timer: 1500,
      })
      setPasswordErrors({})
      setPasswordData({ currentPassword: "", newPassword: "" })
      setPasswordStrength({ strength: "", color: "", score: 0 })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.response?.data || "Failed to change password")
      setPasswordErrors({ general: error.response?.data || "Failed to change password" })
    } finally {
      setLoading(false)
    }
  }

  // Custom styled input field to replace the InputField component
  const StyledInput = ({ label, type, name, value, onChange, error, disabled }) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`w-full bg-gray-700/50 border ${
          error ? "border-red-500" : "border-gray-600"
        } rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
          {/* Header with gradient accent */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border-2 border-gray-600">
                    <span className="text-3xl font-bold text-blue-400">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-green-500 border-2 border-gray-800"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1 text-center">Your Profile</h2>
              <p className="text-gray-400 text-sm text-center mb-4">Manage your account information</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <StyledInput label="Username" type="text" name="username" value={user.username} disabled={true} />
              <StyledInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <StyledInput label="Role" type="text" name="role" value={user.role} disabled={true} />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
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
                    Updating...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {showPasswordForm ? "Cancel" : "Change Password"}
            </button>

            {showPasswordForm && (
              <div className="mt-6 border-t border-gray-700 pt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <StyledInput
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.currentPassword}
                  />
                  <StyledInput
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                  />

                  {passwordData.newPassword && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Password Strength:</span>
                        <span
                          className={`font-medium ${
                            passwordStrength.strength === "Strong"
                              ? "text-green-400"
                              : passwordStrength.strength === "Medium"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {passwordStrength.strength || "Weak"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === "Strong"
                              ? "bg-green-500"
                              : passwordStrength.strength === "Medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {passwordErrors.general && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm">{passwordErrors.general}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
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
                        Updating...
                      </span>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
          },
        }}
      />
    </div>
  )
}

export default Profile

