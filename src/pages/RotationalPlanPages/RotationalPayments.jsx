import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getRotationalPayments, uploadPaymentSlip } from "../../services/api"
import toast from "react-hot-toast"
import { jsPDF } from "jspdf" // Add this import for PDF generation

const RotationalPayments = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [slipUrls, setSlipUrls] = useState({}) // Store Cloudinary URLs
  const [uploadingSlip, setUploadingSlip] = useState({})
  const [groupName, setGroupName] = useState("")
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getRotationalPayments(groupId)
        setPayments(response.data)

        // Set group name if available in the response
        if (response.data.length > 0 && response.data[0].group) {
          setGroupName(response.data[0].group.groupName || `Group ${groupId}`)
        } else {
          setGroupName(`Group ${groupId}`)
        }

        // Fetch existing slip URLs
        const slipPromises = response.data
          .filter((payment) => payment.slipUrl) // Check if slipUrl exists
          .map(async (payment) => ({
            paymentId: payment.paymentId,
            url: payment.slipUrl, // Use slipUrl directly from payment data
          }))

        const slipResults = await Promise.all(slipPromises)
        const slipUrlMap = slipResults.reduce((acc, { paymentId, url }) => {
          if (url) acc[paymentId] = url
          return acc
        }, {})
        setSlipUrls(slipUrlMap)
      } catch (error) {
        console.error("Error fetching payments:", error)
        toast.error("Failed to fetch payments: " + (error.response?.data?.message || error.message))
      } finally {
        setLoading(false)
        // Trigger animation after data is loaded
        setTimeout(() => {
          setAnimate(true)
        }, 100)
      }
    }
    fetchPayments()
  }, [groupId])

  const handleFileChange = (paymentId) => async (e) => {
    const file = e.target.files[0]
    if (!file) {
      toast.error("Please select a file to upload")
      return
    }

    setUploadingSlip((prev) => ({ ...prev, [paymentId]: true }))
    try {
      const response = await uploadPaymentSlip(paymentId, file)
      toast.success("Slip uploaded successfully")

      // Update slipUrls with the new URL from the response
      const newUrl = response.data.slipUrl // Assuming the backend returns { slipUrl: "..." }
      setSlipUrls((prev) => ({ ...prev, [paymentId]: newUrl }))

      // Refresh payments to update status
      const updatedResponse = await getRotationalPayments(groupId)
      setPayments(updatedResponse.data)
    } catch (error) {
      console.error("Error uploading slip:", error)
      toast.error("Failed to upload slip: " + (error.response?.data?.message || error.message))
    } finally {
      setUploadingSlip((prev) => ({ ...prev, [paymentId]: false }))
    }
  }

  const groupedPayments = payments.reduce((acc, payment) => {
    const month = payment.plan.monthNumber
    if (!acc[month]) {
      acc[month] = { recipient: payment.recipient.username, payments: [] }
    }
    acc[month].payments.push(payment)
    return acc
  }, {})

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-teal-900/50 text-teal-300"
      case "pending":
        return "bg-yellow-900/50 text-yellow-300"
      case "overdue":
        return "bg-red-900/50 text-red-300"
      default:
        return "bg-gray-700/50 text-gray-300"
    }
  }

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    // Add styling - colors
    const primaryColor = [0, 128, 128] // Teal
    const secondaryColor = [100, 100, 100] // Dark gray
    const accentColor = [0, 150, 136] // Light teal
    const successColor = [46, 204, 113] // Green
    const warningColor = [230, 126, 34] // Orange
    const dangerColor = [231, 76, 60] // Red

    // Title with styling
    doc.setFontSize(24)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFont("helvetica", "bold")
    doc.text("Rotational Payments Report", 20, yPosition)
    yPosition += 15

    // Add a horizontal line
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10

    // Group info
    doc.setFontSize(14)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFont("helvetica", "normal")
    doc.text(`Group: ${groupName}`, 20, yPosition)
    doc.text(`Group ID: ${groupId}`, 120, yPosition)
    yPosition += 10

    // Summary section
    doc.setFontSize(14)
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFont("helvetica", "bold")
    doc.text("Summary", 20, yPosition)
    yPosition += 10

    // Summary data
    doc.setFontSize(12)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFont("helvetica", "normal")

    // Create summary box
    doc.setFillColor(245, 245, 245)
    doc.roundedRect(20, yPosition - 5, 170, 35, 3, 3, "F")

    doc.text(`Total Months: ${Object.keys(groupedPayments).length}`, 30, yPosition)
    doc.text(`Total Payments: ${payments.length}`, 100, yPosition)
    yPosition += 10

    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    doc.setFont("helvetica", "bold")
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 30, yPosition)
    yPosition += 20

    // Iterate through each month
    Object.keys(groupedPayments)
      .sort((a, b) => a - b)
      .forEach((month, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20

          // Add header to new page
          doc.setFontSize(12)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.setFont("helvetica", "italic")
          doc.text(`Rotational Payments Report - ${groupName} (continued)`, 20, yPosition)
          yPosition += 10
        }

        // Month header
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2], 0.1)
        doc.roundedRect(20, yPosition - 5, 170, 20, 3, 3, "F")

        doc.setFontSize(14)
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.setFont("helvetica", "bold")
        doc.text(`Month ${month}`, 25, yPosition + 5)
        doc.setFontSize(12)
        doc.text(`Recipient: ${groupedPayments[month].recipient}`, 80, yPosition + 5)
        yPosition += 20

        // Table header
        doc.setFillColor(220, 220, 220)
        doc.rect(20, yPosition - 5, 170, 12, "F")

        doc.setFontSize(10)
        doc.setTextColor(80, 80, 80)
        doc.setFont("helvetica", "bold")
        doc.text("Payer", 25, yPosition)
        doc.text("Amount", 75, yPosition)
        doc.text("Status", 125, yPosition)
        yPosition += 10

        // Table rows
        groupedPayments[month].payments.forEach((payment, paymentIndex) => {
          // Alternate row background
          if (paymentIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245)
            doc.rect(20, yPosition - 5, 170, 12, "F")
          }

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(80, 80, 80)
          doc.text(payment.payer.username, 25, yPosition)
          doc.text(formatCurrency(payment.amount), 75, yPosition)

          // Status with color
          switch (payment.status?.toLowerCase()) {
            case "paid":
              doc.setTextColor(successColor[0], successColor[1], successColor[2])
              break
            case "pending":
              doc.setTextColor(warningColor[0], warningColor[1], warningColor[2])
              break
            case "overdue":
              doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2])
              break
            default:
              doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          }

          doc.setFont("helvetica", "bold")
          doc.text(payment.status || "Unknown", 125, yPosition)
          yPosition += 12

          // Check if we need a new page
          if (yPosition > 270) {
            doc.addPage()
            yPosition = 20

            // Add header to new page
            doc.setFontSize(12)
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
            doc.setFont("helvetica", "italic")
            doc.text(`Rotational Payments Report - ${groupName} (continued)`, 20, yPosition)
            yPosition += 15
          }
        })

        // Add space between months
        yPosition += 10
      })

    // Add footer with date
    const currentDate = new Date().toLocaleDateString()
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.setFont("helvetica", "italic")
    doc.text(`Generated on ${currentDate}`, 20, 280)
    doc.text("Page 1", 180, 280)

    // Save the PDF
    doc.save(`Rotational_Payments_${groupId}.pdf`)

    // Show success message
    toast.success("PDF report generated successfully")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-teal-400">Loading payment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 transform ${animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
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
              <div>
                <h1 className="text-3xl font-bold text-white">Rotational Payments</h1>
                <p className="text-gray-400">{groupName}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {/* Add PDF Report Button */}
              <button
                onClick={generatePDF}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                disabled={payments.length === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF Report
              </button>
              
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Months Card */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Months</p>
                  <h3 className="text-2xl font-bold mt-1">{Object.keys(groupedPayments).length}</h3>
                </div>
                <div className="p-2 bg-teal-500/20 rounded-lg">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Payments Card */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Payments</p>
                  <h3 className="text-2xl font-bold mt-1">{payments.length}</h3>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Amount Card */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Amount</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatCurrency(payments.reduce((sum, payment) => sum + payment.amount, 0))}
                  </h3>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Content */}
        {Object.keys(groupedPayments).length === 0 ? (
          <div
            className={`bg-gray-800/50 rounded-xl p-10 text-center border border-gray-700/50 shadow-lg transition-all duration-700 delay-300 transform ${
              animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No payments recorded yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start by creating a payment plan for this rotational savings group.
            </p>
            <button
              onClick={() => navigate(`/rotational/${groupId}/add-plan`)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center shadow-md"
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
              Create Payment Plan
            </button>
          </div>
        ) : (
          Object.keys(groupedPayments)
            .sort((a, b) => a - b)
            .map((month, monthIndex) => (
              <div
                key={month}
                className={`mb-10 transition-all duration-700 transform ${
                  animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + monthIndex * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center mr-3">
                    <span className="font-bold text-teal-400">{month}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Month {month}</h3>
                    <p className="text-gray-400 text-sm">
                      Recipient: <span className="text-teal-300">{groupedPayments[month].recipient}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-700/70">
                          <th className="p-4 text-left font-medium text-gray-300">Month</th>
                          <th className="p-4 text-left font-medium text-gray-300">Payer</th>
                          <th className="p-4 text-left font-medium text-gray-300">Recipient</th>
                          <th className="p-4 text-left font-medium text-gray-300">Amount</th>
                          <th className="p-4 text-left font-medium text-gray-300">Status</th>
                          <th className="p-4 text-left font-medium text-gray-300">Payment Slip</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedPayments[month].payments.map((payment, index) => (
                          <tr
                            key={payment.paymentId}
                            className={`border-b border-gray-700/50 ${
                              index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-800/60"
                            }`}
                          >
                            <td className="p-4 text-gray-300">{payment.plan.monthNumber}</td>
                            <td className="p-4 text-gray-300">{payment.payer.username}</td>
                            <td className="p-4 text-gray-300">{groupedPayments[month].recipient}</td>
                            <td className="p-4 text-gray-300">{formatCurrency(payment.amount)}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  payment.status,
                                )}`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {slipUrls[payment.paymentId] ? (
                                <div className="relative group">
                                  <img
                                    src={slipUrls[payment.paymentId] || "/placeholder.svg"}
                                    alt="Payment Slip"
                                    className="max-w-xs h-auto rounded-lg border border-gray-600 hover:border-teal-500 transition-colors duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                                    <a
                                      href={slipUrls[payment.paymentId]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full"
                                    >
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
                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input
                                    type="file"
                                    onChange={handleFileChange(payment.paymentId)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    disabled={uploadingSlip[payment.paymentId]}
                                  />
                                  <div
                                    className={`flex items-center justify-center px-4 py-2 border ${
                                      uploadingSlip[payment.paymentId]
                                        ? "border-teal-500 bg-teal-900/20"
                                        : "border-gray-600 bg-gray-700/30 hover:bg-gray-700/50 hover:border-teal-500"
                                    } rounded-lg transition-colors duration-200`}
                                  >
                                    {uploadingSlip[payment.paymentId] ? (
                                      <>
                                        <svg
                                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-400"
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
                                        <span className="text-sm text-teal-300">Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5 mr-2 text-teal-400"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                          />
                                        </svg>
                                        <span className="text-sm text-gray-300">Upload Payment Slip</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default RotationalPayments
