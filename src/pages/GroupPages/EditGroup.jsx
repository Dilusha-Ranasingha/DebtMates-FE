"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useGroup from "../../hooks/useGroup"
import validateForm from "../../utils/validateForm"
import { getUserGroups } from "../../services/api"

const EditGroup = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { updateExistingGroup } = useGroup()
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    numMembers: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getUserGroups()
        const group = response.data.find((g) => g.groupId === Number.parseInt(groupId))
        if (group && group.isCreator) {
          setFormData({
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            numMembers: group.numMembers,
          })
        } else {
          navigate("/dashboard")
        }
      } catch (error) {
        navigate("/dashboard")
      } finally {
        setLoading(false)
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimate(true)
        }, 100)
      }
    }
    fetchGroup()
  }, [groupId, navigate])

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
      await updateExistingGroup(groupId, formData)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error updating group:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400">Loading group data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100 p-4 flex items-center justify-center">
      <div
        className={`bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg w-full max-w-md transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
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
          <h2 className="text-2xl font-bold text-white">Edit Group</h2>
        </div>

        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <span className="font-medium">Group ID:</span> {groupId}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              className={`w-full px-4 py-3 bg-gray-700/30 border ${errors.groupName ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200`}
              placeholder="Enter group name"
            />
            {errors.groupName && <p className="text-red-500 text-xs mt-1">{errors.groupName}</p>}
          </div>

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
              className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200"
              placeholder="Enter group description"
            ></textarea>
          </div>

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
              className={`w-full px-4 py-3 bg-gray-700/30 border ${errors.numMembers ? "border-red-500" : "border-gray-600"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors duration-200`}
              placeholder="Enter number of members"
              min="1"
            />
            {errors.numMembers && <p className="text-red-500 text-xs mt-1">{errors.numMembers}</p>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-1/2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Update Group
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGroup

