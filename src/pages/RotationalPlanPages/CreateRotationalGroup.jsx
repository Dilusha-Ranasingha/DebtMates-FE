"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useRotational from "../../hooks/useRotational"
import validateForm from "../../utils/validateForm"

const CreateRotationalGroup = () => {
  const navigate = useNavigate()
  const { createNewGroup } = useRotational()
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    numMembers: "",
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [animate, setAnimate] = useState(false)

  // Trigger animation after component mounts
  useState(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 100)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm(formData, ["groupName", "numMembers"])
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      await createNewGroup(formData)
      navigate("/rotational-page")
    } catch (error) {
      console.error("Error creating group:", error)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4 flex items-center justify-center">
      <div
        className={`bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg w-full max-w-md transition-all duration-700 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/rotational-page")}
            className="mr-4 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-white">Create Rotational Group</h2>
        </div>

        {/* Decorative Element */}
        <div className="relative mb-8 p-5 bg-teal-900/20 rounded-lg border border-teal-800/30 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-teal-600/10 animate-spin-slow"></div>
          <div className="relative z-10 flex items-center">
            <div className="w-12 h-12 rounded-full bg-teal-900/50 flex items-center justify-center mr-4 relative">
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 border-dashed animate-spin-slow"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-teal-300 font-medium">Start a new savings cycle</p>
              <p className="text-gray-400 text-sm">Create a group and invite members to join</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Group Name Field */}
          <div className="space-y-1">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-300">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700/30 border ${
                errors.groupName ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200`}
              placeholder="Enter group name"
            />
            {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName}</p>}
          </div>

          {/* Group Description Field */}
          <div className="space-y-1">
            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="groupDescription"
              name="groupDescription"
              value={formData.groupDescription}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200"
              placeholder="Enter group description"
            ></textarea>
          </div>

          {/* Number of Members Field */}
          <div className="space-y-1">
            <label htmlFor="numMembers" className="block text-sm font-medium text-gray-300">
              Number of Members
            </label>
            <input
              type="number"
              id="numMembers"
              name="numMembers"
              value={formData.numMembers}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700/30 border ${
                errors.numMembers ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200`}
              placeholder="Enter number of members"
              min="1"
            />
            {errors.numMembers && <p className="text-red-500 text-xs mt-1">{errors.numMembers}</p>}
          </div>

          {/* Information Box */}
          <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-blue-300">
                The number of members determines the cycle length. Each member will receive funds once during the cycle.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center
                ${
                  submitting
                    ? "bg-teal-700/50 text-teal-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 text-white"
                }`}
            >
              {submitting ? (
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
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRotationalGroup