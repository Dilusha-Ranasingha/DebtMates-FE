"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MemberSelector from "../../components/Group/MemberSelector"
import useRotational from "../../hooks/useRotational"
import { getRotationalGroups } from "../../services/api"
import toast from "react-hot-toast"

const AddRotationalMembers = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { addMembers } = useRotational()
  const [selectedMembers, setSelectedMembers] = useState([])
  const [creator, setIsCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [groupName, setGroupName] = useState("")

  useEffect(() => {
    const checkCreator = async () => {
      setLoading(true)
      try {
        const response = await getRotationalGroups()
        const group = response.data.find((g) => g.groupId === Number.parseInt(groupId))
        if (group && group.creator) {
          setIsCreator(true)
          setGroupName(group.groupName || "Rotational Group")
        } else {
          toast.error("You are not authorized to add members to this group")
          navigate(`/rotational/${groupId}/payments`)
        }
      } catch (error) {
        toast.error("Failed to load group details")
        navigate("/rotational-page")
      } finally {
        setLoading(false)
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimate(true)
        }, 100)
      }
    }
    checkCreator()
  }, [groupId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member")
      return
    }

    setSubmitting(true)
    try {
      await addMembers(groupId, selectedMembers)
      toast.success("Members added successfully")
      navigate("/rotational-page")
    } catch (error) {
      toast.error("Failed to add members: " + (error.response?.data?.message || error.message))
      setSubmitting(false)
      console.error("Error adding members:", error)
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

  if (!creator) return null

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
          <h2 className="text-2xl font-bold text-white">Add Members</h2>
        </div>

        <div className="mb-6 p-4 bg-teal-900/20 border border-teal-800/30 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center mr-3 relative">
              <div className="absolute inset-0 rounded-full border-2 border-teal-500/50 border-dashed animate-spin-slow"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-teal-300">
                <span className="font-medium">Adding members to:</span>
              </p>
              <p className="font-medium text-white">{groupName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Select Members to Add</label>
            <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
              <MemberSelector onSelect={setSelectedMembers} selectedMembers={selectedMembers} />
            </div>

            {selectedMembers.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-300 mb-2">Selected Members ({selectedMembers.length})</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member.id || member.userId || member}
                      className="bg-teal-900/30 text-teal-200 px-3 py-1.5 rounded-full text-sm flex items-center"
                    >
                      <span>{typeof member === "object" ? member.name || member.username : member}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMembers(selectedMembers.filter((m) => m !== member))}
                        className="ml-2 text-teal-300 hover:text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              disabled={submitting || selectedMembers.length === 0}
              className={`w-1/2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center
                ${
                  selectedMembers.length === 0
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
                  Adding...
                </>
              ) : (
                <>Add Members</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRotationalMembers