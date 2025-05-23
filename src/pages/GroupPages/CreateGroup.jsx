"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useGroup from "../../hooks/useGroup"
import validateForm from "../../utils/validateForm"

const CreateGroup = () => {
  const navigate = useNavigate()
  const { createNewGroup } = useGroup()
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    numMembers: "",
  })
  const [errors, setErrors] = useState({})

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

    try {
      console.log("Form Data are coming:", formData)
      const newGroup = await createNewGroup(formData)
      console.log("New Group Response:", newGroup)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error creating group:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg w-full max-w-md overflow-hidden">
        {/* Header with gradient accent */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-bold text-white mb-1 text-center">Create Debt Group</h2>
            <p className="text-gray-400 text-sm text-center mb-4">Set up a new group to track and manage expenses</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-300">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                id="groupName"
                value={formData.groupName}
                onChange={handleChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter group name"
              />
              {errors.groupName && <p className="text-red-400 text-xs mt-1">{errors.groupName}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="groupDescription"
                id="groupDescription"
                value={formData.groupDescription}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="What's this group for?"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label htmlFor="numMembers" className="block text-sm font-medium text-gray-300">
                Number of Members
              </label>
              <input
                type="number"
                name="numMembers"
                id="numMembers"
                value={formData.numMembers}
                onChange={handleChange}
                min="1"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="How many people will be in this group?"
              />
              {errors.numMembers && <p className="text-red-400 text-xs mt-1">{errors.numMembers}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Create Group
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel and return to dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateGroup

