"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getGroupMembers, getUserGroups, recordDebt } from "../../services/api"
import toast from "react-hot-toast"

const RecordDebt = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [formData, setFormData] = useState({ totalBill: "" })
  const [contributions, setContributions] = useState({})
  const [errors, setErrors] = useState({})
  const [isCreator, setIsCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [animate, setAnimate] = useState(false)
  const [groupName, setGroupName] = useState("")

  // Calculate total contributions
  const totalContributions = Object.values(contributions).reduce(
    (sum, amount) => sum + (Number.parseFloat(amount) || 0),
    0,
  )

  // Calculate remaining amount
  const totalBill = Number.parseFloat(formData.totalBill) || 0
  const remainingAmount = totalBill - totalContributions

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        setFetchError(null)

        // Fetch group members
        const membersResponse = await getGroupMembers(groupId)
        setMembers(membersResponse.data)
        const initialContributions = membersResponse.data.reduce(
          (acc, member) => ({
            ...acc,
            [member.id]: "",
          }),
          {},
        )
        setContributions(initialContributions)

        // Check if the user is the creator
        const groupsResponse = await getUserGroups()
        const group = groupsResponse.data.find((g) => g.groupId === Number.parseInt(groupId))
        if (!group) {
          throw new Error("Group not found in user's groups")
        }
        setIsCreator(group.isCreator)
        setGroupName(group.groupName || "Group")
      } catch (error) {
        setFetchError(error.response?.data?.message || "Failed to load group members")
      } finally {
        setLoading(false)
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimate(true)
        }, 100)
      }
    }
    fetchMembers()
  }, [groupId, navigate])

  useEffect(() => {
    const newErrors = {}

    // Validate total bill the user enter
    if (
      formData.totalBill &&
      (isNaN(Number.parseFloat(formData.totalBill)) || Number.parseFloat(formData.totalBill) <= 0)
    ) {
      newErrors.totalBill = "Total bill must be a positive number"
    }

    // Check if contributions match total bill when both are valid
    if (totalBill > 0 && totalContributions > 0 && Math.abs(totalContributions - totalBill) > 0.01) {
      newErrors.contributions = `Total contributions (${totalContributions.toFixed(
        2,
      )}) must equal the total bill (${totalBill.toFixed(2)})`
    }

    setErrors(newErrors)
  }, [formData.totalBill, contributions, totalBill, totalContributions])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContributionChange = (memberId, value) => {
    // Validate input is a number or empty
    if (value === "" || (!isNaN(Number.parseFloat(value)) && Number.parseFloat(value) >= 0)) {
      setContributions({ ...contributions, [memberId]: value })
    }
  }

  const splitEvenly = () => {
    if (
      !formData.totalBill ||
      isNaN(Number.parseFloat(formData.totalBill)) ||
      Number.parseFloat(formData.totalBill) <= 0
    ) {
      setErrors({ totalBill: "Please enter a valid total bill amount first" })
      return
    }

    const amount = Number.parseFloat(formData.totalBill) / members.length
    const roundedAmount = Math.round(amount * 100) / 100 // Round to 2 decimal places

    const newContributions = {}
    members.forEach((member) => {
      newContributions[member.id] = roundedAmount.toString()
    })

    // Adjust for rounding errors
    const firstMemberId = members[0]?.id
    if (firstMemberId) {
      const totalAfterRounding = roundedAmount * members.length
      const difference = Number.parseFloat(formData.totalBill) - totalAfterRounding
      if (Math.abs(difference) > 0.01) {
        newContributions[firstMemberId] = (roundedAmount + difference).toFixed(2)
      }
    }

    setContributions(newContributions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Final validation
    const validationErrors = {}
    if (
      !formData.totalBill ||
      isNaN(Number.parseFloat(formData.totalBill)) ||
      Number.parseFloat(formData.totalBill) <= 0
    ) {
      validationErrors.totalBill = "Total bill must be a positive number"
    }

    if (Math.abs(totalContributions - totalBill) > 0.01) {
      validationErrors.contributions = `Total contributions (${totalContributions.toFixed(
        2,
      )}) must equal the total bill (${totalBill.toFixed(2)})`
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const debtData = {
      totalBill: totalBill,
      contributions: Object.entries(contributions).map(([memberId, amount]) => ({
        memberId: Number.parseInt(memberId),
        amount: Number.parseFloat(amount) || 0,
      })),
    }

    try {
      setSubmitting(true)
      await recordDebt(groupId, debtData)
      toast.success("Debt recorded successfully")
      navigate("/dashboard")
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to record debt"
      toast.error(errorMessage)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f111a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-400">Loading group data...</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-gray-100 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center mb-6 text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">Error</h2>
          <p className="text-gray-300 text-center mb-6">{fetchError}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-[#0f111a] text-gray-100 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 shadow-lg w-full max-w-md">
          <div className="flex items-center justify-center mb-6 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
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
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Not Authorized</h2>
          <p className="text-gray-300 text-center mb-6">Only the group creator can record debts.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-100 py-8 px-4">
      <div
        className={`max-w-lg mx-auto transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
            <div className="flex items-center mb-1">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200"
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
              <h2 className="text-2xl font-bold text-white">Record Debt</h2>
            </div>
            <p className="text-green-100 text-sm ml-10">
              Recording debt for: <span className="font-medium">{groupName}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Total Bill Field */}
              <div className="space-y-1">
                <label htmlFor="totalBill" className="block text-sm font-medium text-gray-300">
                  Total Bill Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                  <input
                    type="number"
                    id="totalBill"
                    name="totalBill"
                    value={formData.totalBill}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-3 bg-gray-700/30 border rounded-lg focus:ring-2 focus:outline-none ${
                      errors.totalBill
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:ring-green-500 focus:border-green-500"
                    } text-white placeholder-gray-500`}
                  />
                </div>
                {errors.totalBill && <p className="text-red-400 text-sm">{errors.totalBill}</p>}
              </div>

              {/* Split Evenly Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={splitEvenly}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition duration-200"
                >
                  Split Evenly
                </button>
              </div>

              {/* Contributions Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Member Contributions</h3>
                  <div className={`text-sm font-medium ${remainingAmount === 0 ? "text-green-400" : "text-red-400"}`}>
                    {remainingAmount === 0 ? "Balanced ✓" : `Remaining: $${Math.abs(remainingAmount).toFixed(2)}`}
                  </div>
                </div>

                {errors.contributions && (
                  <div className="p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.contributions}</p>
                  </div>
                )}

                <div className="bg-gray-700/30 rounded-lg p-4 space-y-3 border border-gray-600">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-green-700/50">
                        <span className="text-green-400 font-bold text-sm">
                          {member.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <label htmlFor={`member-${member.id}`} className="block text-sm font-medium text-gray-300">
                          {member.username}
                        </label>
                      </div>
                      <div className="relative w-32">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
                        <input
                          type="number"
                          id={`member-${member.id}`}
                          value={contributions[member.id]}
                          onChange={(e) => handleContributionChange(member.id, e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full pl-8 pr-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none text-right text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-800/30">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-300">Total Bill:</span>
                  <span className="font-bold text-white">${totalBill.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="font-medium text-gray-300">Total Contributions:</span>
                  <span className={`font-bold ${totalContributions !== totalBill ? "text-red-400" : "text-green-400"}`}>
                    ${totalContributions.toFixed(2)}
                  </span>
                </div>
                {totalContributions !== totalBill && totalBill > 0 && (
                  <div className="mt-2 pt-2 border-t border-green-800/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-red-400">Difference:</span>
                      <span className="font-bold text-red-400">
                        ${Math.abs(totalContributions - totalBill).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-1/2 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting || Object.keys(errors).length > 0 || totalBill <= 0 || totalContributions !== totalBill
                  }
                  className={`w-1/2 py-3 rounded-lg font-medium text-white transition duration-200 flex items-center justify-center
                    ${
                      submitting || Object.keys(errors).length > 0 || totalBill <= 0 || totalContributions !== totalBill
                        ? "bg-green-700/50 text-green-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
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
                      Recording...
                    </>
                  ) : (
                    "Record Debt"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RecordDebt

