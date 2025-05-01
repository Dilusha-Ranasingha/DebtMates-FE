"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useRotational from "../../hooks/useRotational"
import { getRotationalGroups, getRotationalGroupMembers } from "../../services/api"
import toast from "react-hot-toast"

const CreateRotationalPlan = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const { createPlan } = useRotational()
  const [members, setMembers] = useState([])
  const [planData, setPlanData] = useState([])
  const [creator, setIsCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [numMembers, setNumMembers] = useState(0)
  const [groupName, setGroupName] = useState("")
  const [animate, setAnimate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  // Add a new state variable to track form submission attempts
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group details
        const groupsResponse = await getRotationalGroups()
        const group = groupsResponse.data.find((g) => g.groupId === Number.parseInt(groupId))
        if (!group) {
          toast.error("Group not found")
          navigate("/rotational-page")
          return
        }
        if (!group.creator) {
          toast.error("You are not authorized to create a plan for this group")
          navigate(`/rotational/${groupId}/payments`)
          return
        }
        setIsCreator(true)
        setNumMembers(group.numMembers)
        setGroupName(group.groupName)

        // Fetch group members
        const membersResponse = await getRotationalGroupMembers(groupId)
        setMembers(membersResponse.data)

        // Initialize plan data based on numMembers
        const initialPlan = Array.from({ length: group.numMembers }, (_, index) => ({
          monthNumber: index + 1,
          recipientId: "",
          amount: "",
        }))
        setPlanData(initialPlan)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to fetch group details: " + (error.response?.data?.message || error.message))
        navigate("/rotational-page")
      } finally {
        setLoading(false)
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimate(true)
        }, 100)
      }
    }
    fetchData()
  }, [groupId, navigate])

  const handlePlanChange = (index, field, value) => {
    const updatedPlan = [...planData]
    updatedPlan[index] = { ...updatedPlan[index], [field]: value }
    setPlanData(updatedPlan)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Set this to true when form is submitted
    setFormSubmitted(true)
    // Validate the plan
    for (let i = 0; i < planData.length; i++) {
      const plan = planData[i]
      if (!plan.recipientId) {
        toast.error(`Please select a recipient for month ${i + 1}`)
        return
      }
      if (!plan.amount || Number.parseFloat(plan.amount) <= 0) {
        toast.error(`Please enter a valid amount for month ${i + 1}`)
        return
      }
    }

    setSubmitting(true)
    try {
      await createPlan(groupId, planData)
      toast.success("Plan created successfully")
      navigate(`/rotational/${groupId}/payments`)
    } catch (error) {
      toast.error("Error creating plan: " + (error.response?.data?.message || error.message))
      console.error("Error creating plan:", error)
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

  if (!creator) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div
        className={`max-w-2xl mx-auto transition-all duration-700 transform ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5">
            <div className="flex items-center mb-1">
              <button
                onClick={() => navigate("/rotational-page")}
                className="mr-4 p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 transition-colors duration-200"
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
              <h2 className="text-2xl font-bold text-white">Create Rotational Plan</h2>
            </div>
            <p className="text-teal-100 text-sm ml-10">
              Creating plan for: <span className="font-medium">{groupName}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-teal-300">
                    <span className="font-medium">Plan Details</span>
                  </p>
                  <p className="text-xs text-teal-200">
                    Define the payment schedule for {numMembers} {numMembers === 1 ? "month" : "months"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {planData.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-gray-700/30 rounded-lg p-5 border border-gray-600 transition-all duration-300 transform ${
                    animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${150 + index * 50}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-teal-900/50 flex items-center justify-center mr-3">
                      <span className="font-bold text-teal-400">{plan.monthNumber}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Month {plan.monthNumber}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Recipient</label>
                      <div className="relative">
                        <select
                          value={plan.recipientId}
                          onChange={(e) => handlePlanChange(index, "recipientId", e.target.value)}
                          className={`w-full px-4 py-3 bg-gray-700/50 border ${
                            formSubmitted && !plan.recipientId
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-600"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white appearance-none transition-colors duration-200`}
                        >
                          <option value="">Select Recipient</option>
                          {members.map((member) => (
                            <option key={member.id} value={member.id} className="bg-gray-700">
                              {member.username}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      {formSubmitted && !plan.recipientId && (
                        <p className="text-red-400 text-xs mt-1 font-medium">
                          Please select a recipient for this month.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input
                          type="number"
                          value={plan.amount}
                          onChange={(e) => handlePlanChange(index, "amount", e.target.value)}
                          className={`w-full pl-8 pr-4 py-3 bg-gray-700/50 border ${
                            formSubmitted && (!plan.amount || Number.parseFloat(plan.amount) <= 0)
                              ? "border-red-500 ring-1 ring-red-500"
                              : "border-gray-600"
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400 transition-colors duration-200`}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      {formSubmitted && (!plan.amount || Number.parseFloat(plan.amount) <= 0) && (
                        <p className="text-red-400 text-xs mt-1 font-medium">Please enter a valid positive amount.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
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
                    Creating Plan...
                  </>
                ) : (
                  "Create Plan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRotationalPlan
