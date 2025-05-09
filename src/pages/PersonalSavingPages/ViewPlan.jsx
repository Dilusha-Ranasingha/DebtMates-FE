import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getSavingPlanById, deleteSavingPlan, recordSavingTransaction } from "../../services/api"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ViewPlan = () => {
  const [plan, setPlan] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await getSavingPlanById(id)
        setPlan(response.data)
      } catch (error) {
        toast.error("Error loading plan details")
        navigate("/personal-saving")
      }
    }
    fetchPlan()
  }, [id, navigate])

  const handleDeletePlan = async () => {
    try {
      await deleteSavingPlan(id)
      toast.success("Plan deleted successfully")
      navigate("/personal-saving")
    } catch (error) {
      toast.error("Error deleting plan")
    }
  }

  const handleSaveDeposit = async () => {
    try {
      await recordSavingTransaction(id, { amount: Number.parseFloat(depositAmount) })
      toast.success("Deposit recorded successfully", {
        autoClose: 3000, // Close after 3 seconds
      })
      setShowDepositModal(false)
      setDepositAmount("") // Clear input
      // Refresh plan data
      const response = await getSavingPlanById(id)
      setPlan(response.data)
    } catch (error) {
      toast.error("Error recording deposit")
    }
  }

  const handleUpdatePlan = () => {
    navigate(`/update-plan/${id}`)
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-indigo-500"></div>
          <p className="mt-4 text-lg font-medium text-white">Loading plan details...</p>
        </div>
      </div>
    )
  }

  const progress = plan.goalAmount > 0 ? plan.currentAmount / plan.goalAmount : 0
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-white">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {plan.planName}
            </h1>
            <p className="mt-1 text-gray-400">Saving Plan Details</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUpdatePlan}
              className="px-4 py-2 rounded-lg flex items-center transition-all duration-200 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update Plan
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg flex items-center transition-all duration-200 bg-red-600 hover:bg-red-700 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Plan
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gray-800 shadow-indigo-900/20 p-8 transition-all duration-300">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-10"></div>
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-500 opacity-10"></div>

          {/* Progress Circle */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-8">
            <div className="relative h-48 w-48 mb-6 md:mb-0">
              <svg className="transform -rotate-90 h-48 w-48">
                <circle cx="96" cy="96" r="88" stroke="#374151" strokeWidth="12" fill="none" />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#progressGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="552.9"
                  strokeDashoffset={552.9 * (1 - progress)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-4xl font-bold text-white">{Math.round(progress * 100)}%</span>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>

            <div className="md:ml-12 w-full md:w-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="p-4 rounded-xl bg-gray-700 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-indigo-900/50 text-indigo-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-300">Current Amount</p>
                  </div>
                  <p className="text-xl font-bold mt-1 text-indigo-300">{formatCurrency(plan.currentAmount)}</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-700 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-purple-900/50 text-purple-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-300">Goal Amount</p>
                  </div>
                  <p className="text-xl font-bold mt-1 text-purple-300">{formatCurrency(plan.goalAmount)}</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-700 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-blue-900/50 text-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-300">Next Deposit Due</p>
                  </div>
                  <p className="text-xl font-bold mt-1 text-blue-300">{plan.nextDepositDate}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="px-6 py-3 rounded-lg flex items-center transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Record Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gray-800 animate-fade-in">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-900/30 text-red-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-4 text-white">Confirm Delete</h2>
              <p className="mt-2 text-gray-400">
                Are you sure you want to delete this saving plan? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gray-800 animate-fade-in">
            <div className="absolute top-0 right-0 -mt-4 -mr-4">
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-indigo-900/30 text-indigo-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mt-4 text-white">Record Deposit</h2>
              <p className="mt-2 text-gray-400">Enter the amount you want to deposit to your savings plan.</p>
            </div>

            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">Rs.</div>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-4 pl-12 rounded-lg border-2 focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-800"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="100" // Assuming minimum deposit is 100 LKR
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDepositModal(false)}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeposit}
                className="w-1/2 py-3 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ViewPlan
