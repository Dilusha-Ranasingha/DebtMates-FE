import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PiggyBank, Plane, Ambulance, GraduationCap, Home, Car } from "lucide-react"
import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"
import { useRef } from "react"
import { createSavingPlan } from "../../services/api"

const CreatePlan = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    planName: "",
    planType: "",
    goalAmount: "",
    startDate: null,
    endDate: null,
    initialDeposit: "",
    frequency: "",
  })
  const toast = useRef(null)

  const navigate = useNavigate()

  const planTypes = [
    { icon: <PiggyBank className="h-8 w-8 text-purple-500 dark:text-purple-400" />, name: "Emergency Fund" },
    { icon: <Plane className="h-8 w-8 text-blue-500 dark:text-blue-400" />, name: "Vacation" },
    { icon: <Ambulance className="h-8 w-8 text-red-500 dark:text-red-400" />, name: "Medical" },
    { icon: <GraduationCap className="h-8 w-8 text-green-500 dark:text-green-400" />, name: "Education" },
    { icon: <Home className="h-8 w-8 text-amber-500 dark:text-amber-400" />, name: "Housing" },
    { icon: <Car className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />, name: "Vehicle" },
  ]

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Bi-weekly", value: "biweekly" },
    { label: "Monthly", value: "monthly" },
  ]

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.planName.trim()) {
          newErrors.planName = "Plan name is required"
        }
        if (!formData.planType) {
          newErrors.planType = "Please select a plan type"
        }
        break
      case 2:
        if (!formData.startDate) {
          newErrors.startDate = "Start date is required"
        }
        if (!formData.endDate) {
          newErrors.endDate = "End date is required"
        }
        if (formData.endDate && formData.startDate && formData.endDate <= formData.startDate) {
          newErrors.endDate = "End date must be after start date"
        }
        if (!formData.initialDeposit) {
          newErrors.initialDeposit = "Initial deposit is required"
        } else if (Number.parseFloat(formData.initialDeposit) < 0) {
          newErrors.initialDeposit = "Initial deposit cannot be negative"
        } else if (Number.parseFloat(formData.initialDeposit) > formData.goalAmount) {
          newErrors.initialDeposit = "Initial deposit cannot exceed goal amount"
        }
        break
      case 3:
        if (!formData.frequency) {
          newErrors.frequency = "Please select a deposit frequency"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    } else {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fix the errors before continuing",
        life: 3000,
        style: {
          border: "2px solid #ef4444",
          background: "#fee2e2",
          color: "#991b1b",
        },
      })
    }
  }

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      const planTypeMapping = {
        "Emergency Fund": "emergency",
        Vacation: "vacation",
        Medical: "medical",
        Education: "education",
        Housing: "housing",
        Vehicle: "vehicle",
      }

      const payload = {
        planName: formData.planName,
        planType: planTypeMapping[formData.planType] || formData.planType.toLowerCase(),
        goalAmount: Number.parseFloat(formData.goalAmount),
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.endDate.toISOString().split("T")[0],
        initialDeposit: Number.parseFloat(formData.initialDeposit) || 0,
        depositFrequency: formData.frequency,
        userId: 1, // Replace with actual user ID from auth later
      }

      console.log("Submitting payload:", payload)

      try {
        const response = await createSavingPlan(payload)
        console.log("API Response:", response)
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: `Plan "${formData.planName}" created successfully!`,
          life: 3000,
          style: {
            border: "2px solid #22c55e",
            background: "#dcfce7",
            color: "#166534",
          },
        })
        setTimeout(() => {
          navigate("/personal-saving")
        }, 2000)
      } catch (error) {
        console.error("Error creating plan:", error.response?.data || error.message)
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response?.data?.message || "Failed to create plan",
          life: 3000,
          style: {
            border: "2px solid #ef4444",
            background: "#fee2e2",
            color: "#991b1b",
          },
        })
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Plan Name</label>
              <input
                type="text"
                placeholder="e.g., Dream Vacation Fund"
                className={`w-full p-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                  errors.planName
                    ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
                    : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                }`}
                value={formData.planName}
                onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
              />
              {errors.planName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {errors.planName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Plan Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {planTypes.map((type) => (
                  <button
                    key={type.name}
                    className={`p-5 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 hover:shadow-md ${
                      formData.planType === type.name
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 shadow-md transform scale-105"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setFormData({ ...formData, planType: type.name })}
                  >
                    <div className="mb-3 transform transition-transform duration-300 hover:scale-110">{type.icon}</div>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{type.name}</span>
                  </button>
                ))}
              </div>
              {errors.planType && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {errors.planType}
                </p>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Goal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-medium">Rs.</span>
                <input
                  type="number"
                  className={`w-full p-3 pl-12 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.goalAmount
                      ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                  }`}
                  value={formData.goalAmount}
                  onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                  min="1000"
                  placeholder="Enter your goal amount"
                />
              </div>
              {errors.goalAmount && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {errors.goalAmount}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Start Date</label>
                <input
                  type="date"
                  className={`w-full p-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200 mb-3 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.startDate
                      ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                  }`}
                  value={formData.startDate ? formData.startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                  min={new Date().toISOString().split("T")[0]}
                />
                <Calendar
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.value })}
                  minDate={new Date()}
                  className="w-full"
                />
                {errors.startDate && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">End Date</label>
                <input
                  type="date"
                  className={`w-full p-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200 mb-3 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.endDate
                      ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                  }`}
                  value={formData.endDate ? formData.endDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                  min={
                    formData.startDate
                      ? formData.startDate.toISOString().split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                />
                <Calendar
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.value })}
                  minDate={formData.startDate || new Date()}
                  className="w-full"
                />
                {errors.endDate && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Initial Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400 font-medium">Rs.</span>
                <input
                  type="number"
                  className={`w-full p-3 pl-12 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.initialDeposit
                      ? "border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
                      : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900"
                  }`}
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  min="100"
                  placeholder="Enter initial deposit amount"
                />
                {errors.initialDeposit && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {errors.initialDeposit}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                  Deposit Frequency
                </label>
                <Dropdown style={{ width: "100%" , color: "white"}}
                  placeholder="Select frequency"
                  options={frequencyOptions}
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.value })}
                  className={`w-full ${errors.frequency ? "p-invalid" : ""}`}
                  itemTemplate={(option) => (
                    <span style={{ color: "green" }}>{option.label}</span>
                  )}
                />
                {errors.frequency && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {errors.frequency}
                  </p>
                )}
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-lg shadow-sm border border-blue-100 dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Plan Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-blue-100 dark:border-gray-600 pb-2">
                    <span className="text-gray-600 dark:text-gray-300">Plan Name:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formData.planName || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-100 dark:border-gray-600 pb-2">
                    <span className="text-gray-600 dark:text-gray-300">Plan Type:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formData.planType || "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-100 dark:border-gray-600 pb-2">
                    <span className="text-gray-600 dark:text-gray-300">Goal Amount:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formData.goalAmount ? `Rs. ${formData.goalAmount}` : "Not set"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-blue-100 dark:border-gray-600 pb-2">
                    <span className="text-gray-600 dark:text-gray-300">Initial Deposit:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formData.initialDeposit ? `Rs. ${formData.initialDeposit}` : "Rs. 0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {formData.startDate && formData.endDate
                        ? `${Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24))} days`
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Savings Calculation */}
            {formData.goalAmount && formData.startDate && formData.endDate && formData.frequency && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-lg shadow-sm border border-green-100 dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-500 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Estimated Savings Projection
                </h3>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Progress to Goal:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formData.initialDeposit && formData.goalAmount
                      ? `${Math.round((Number.parseFloat(formData.initialDeposit) / Number.parseFloat(formData.goalAmount)) * 100)}%`
                      : "0%"}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width:
                        formData.initialDeposit && formData.goalAmount
                          ? `${Math.min(100, Math.round((Number.parseFloat(formData.initialDeposit) / Number.parseFloat(formData.goalAmount)) * 100))}%`
                          : "0%",
                    }}
                  ></div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 italic mt-2">
                  Based on your plan details, you'll need to save regularly to reach your goal by the end date.
                </div>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 my-8">
      <Toast ref={toast} />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Your Savings Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">Set up a personalized plan to achieve your financial goals</p>
      </div>

      {/* Progress Tracker */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step < currentStep
                    ? "bg-green-500 dark:bg-green-600 text-white"
                    : step === currentStep
                      ? "bg-blue-500 dark:bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-900"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {step < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-medium">{step}</span>
                )}
              </div>
              <span className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400">
                {step === 1 ? "Plan Details" : step === 2 ? "Goal Setting" : "Frequency"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-green-500 dark:from-blue-400 dark:to-green-400 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Cancel
        </button>
        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-md"
            >
              Continue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all duration-200 flex items-center shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Plan
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePlan
