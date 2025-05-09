import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllSavingPlans, getSavingStats } from "../../services/api"
import { toast } from "react-toastify"

const PersonalSavaing = () => {
  const [plans, setPlans] = useState([])
  const [stats, setStats] = useState({ totalSaved: 0, totalGoal: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch plans first, then stats if plans succeed
        const plansResponse = await getAllSavingPlans()
        setPlans(plansResponse.data)

        try {
          const statsResponse = await getSavingStats()
          setStats(statsResponse.data)
        } catch (statsError) {
          console.error("Stats error:", statsError)
          // Calculate stats from plans as fallback
          const totalSaved = plansResponse.data.reduce((sum, plan) => sum + plan.currentAmount, 0)
          const totalGoal = plansResponse.data.reduce((sum, plan) => sum + plan.goalAmount, 0)
          setStats({ totalSaved, totalGoal })
        }
      } catch (error) {
        toast.error("Error loading savings data")
        console.error("Error:", error)
        setPlans([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalGoal = stats.totalGoal
  const totalSaved = stats.totalSaved
  const totalProgress = totalGoal > 0 ? Math.round((totalSaved / totalGoal) * 100) : 0

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("LKR", "Rs.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 md:p-8 lg:p-10 text-gray-900 dark:text-gray-100">
      {/* Header Section with Animated Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-8 mb-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px]"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-400 dark:bg-blue-500 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Personal Savings Dashboard</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Track and manage your savings goals with real-time progress updates
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Overall Progress Section */}
          <div className="mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 border-b border-blue-100 dark:border-gray-600">
                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Overall Savings Progress
                </h2>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      className="stroke-blue-100 dark:stroke-gray-600"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                      className="stroke-blue-600 dark:stroke-blue-400 transition-all duration-1000 ease-out"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (totalProgress / 100) * 251.2}
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">{totalProgress}%</p>
                    <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">PROGRESS</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-blue-200 dark:border-gray-500">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Saved</p>
                          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {formatCurrency(totalSaved)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-indigo-200 dark:border-gray-500">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">Total Goal</p>
                          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                            {formatCurrency(totalGoal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-blue-700 dark:text-blue-300">Current Progress</span>
                      <span className="text-blue-700 dark:text-blue-300">{totalProgress}% Complete</span>
                    </div>
                    <div className="h-3 w-full bg-blue-100 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${totalProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Saving Plans */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Active Savings Plans
              </h2>
              <button
                onClick={() => navigate("/create-plan")}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Plan
              </button>
            </div>

            {/* Plan List */}
            {plans.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">No active savings plans</h3>
                <p className="text-blue-600 dark:text-blue-300 mb-8 max-w-md mx-auto">
                  Start your savings journey by creating a new plan to track your financial goals
                </p>
                <button
                  onClick={() => navigate("/create-plan")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const progress = plan.goalAmount > 0 ? Math.round((plan.currentAmount / plan.goalAmount) * 100) : 0
                  return (
                    <div
                      key={plan.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-blue-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      onClick={() => navigate(`/view-plan/${plan.id}`)}
                    >
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">{plan.planName}</h3>
                          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full">
                            {progress}%
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-500 dark:text-gray-400">Current</span>
                            <span className="text-gray-500 dark:text-gray-400">Goal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-blue-700 dark:text-blue-300">
                              {formatCurrency(plan.currentAmount)}
                            </span>
                            <span className="font-bold text-indigo-700 dark:text-indigo-300">
                              {formatCurrency(plan.goalAmount)}
                            </span>
                          </div>

                          <div className="w-full bg-blue-50 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <svg
                              className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Next deposit: {plan.nextDepositDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PersonalSavaing
