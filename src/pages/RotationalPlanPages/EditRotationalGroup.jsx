"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useRotational from "../../hooks/useRotational"
import validateForm from "../../utils/validateForm"
import { getRotationalGroups } from "../../services/api"
import toast from "react-hot-toast" // Added toast for better UX

const EditRotationalGroup = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { updateExistingGroup } = useRotational()
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    numMembers: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await getRotationalGroups()
        const group = response.data.find((g) => g.groupId === Number.parseInt(groupId))
        if (group && group.creator) {
          setFormData({
            groupName: group.groupName,
            groupDescription: group.groupDescription,
            numMembers: group.numMembers,
          })
        } else {
          toast.error("You are not authorized to edit this group")
          navigate("/rotational-page")
        }
      } catch (error) {
        toast.error("Failed to fetch group details")
        navigate("/rotational-page")
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

    setSubmitting(true)
    try {
      await updateExistingGroup(groupId, formData)
      toast.success("Group updated successfully")
      navigate("/rotational-page")
    } catch (error) {
      toast.error("Error updating group")
      console.error("Error updating group:", error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-teal-400">Loading group data...</p>
        </div>
      </div>
    )
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
          <h2 className="text-2xl font-bold text-white">Edit Rotational Group</h2>
        </div>

        <div className="mb-6 p-4 bg-teal-900/20 border border-teal-800/30 rounded-lg">
          <p className="text-sm text-teal-300">
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
              className={`w-full px-4 py-3 bg-gray-700/30 border ${
                errors.groupName ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200`}
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
              className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200"
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
              className={`w-full px-4 py-3 bg-gray-700/30 border ${
                errors.numMembers ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200`}
              placeholder="Enter number of members"
              min="1"
            />
            {errors.numMembers && <p className="text-red-500 text-xs mt-1">{errors.numMembers}</p>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/rotational-page")}
              className="w-1/2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`w-1/2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center
                ${submitting ? "bg-teal-700/50 text-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 text-white"}`}
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
                  Updating...
                </>
              ) : (
                "Update Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRotationalGroup
