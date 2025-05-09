import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LoadingSpinner from "../../components/LoadingSpinner"
import { getGroupDebts } from "../../services/api"
import { jsPDF } from "jspdf"

const DebtSummary = () => {
  const { groupId } = useParams() // Get groupId from the URL
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        console.log("Fetching debts for group ID:", groupId) // Debug groupId
        const response = await getGroupDebts(groupId) // Fetch debts using the API
        console.log("API Response:", response.data) // Debug API response
        setDebts(response.data) // Set the debts data
      } catch (error) {
        console.error("Error fetching debts:", error) // Debug errors
      } finally {
        setLoading(false)
      }
    }

    fetchDebts()
  }, [groupId])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF()
    let yPosition = 20

    // Add styling - colors
    const primaryColor = [0, 83, 156] // Blue
    const secondaryColor = [100, 100, 100] // Dark gray
    const accentColor = [41, 128, 185] // Light blue
    const successColor = [46, 204, 113] // Green
    const warningColor = [230, 126, 34] // Orange

    // Title with styling
    doc.setFontSize(24)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFont("helvetica", "bold")
    doc.text("Debt Summary Report", 20, yPosition)
    yPosition += 15

    // Add a horizontal line
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10

    // Group ID and Total Expected
    doc.setFontSize(12)
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.setFont("helvetica", "normal")
    const totalDebt = debts.reduce((sum, debt) => sum + (debt.expected || 0), 0)
    doc.text(`Group ID: ${groupId}`, 20, yPosition)

    // Total with color based on amount
    doc.setFont("helvetica", "bold")
    if (totalDebt > 5000) {
      doc.setTextColor(255, 0, 0) // Red for high debt
    } else if (totalDebt > 1000) {
      doc.setTextColor(230, 126, 34) // Orange for medium debt
    } else {
      doc.setTextColor(46, 204, 113) // Green for low debt
    }
    doc.text(`Total Expected: ${formatCurrency(totalDebt)}`, 100, yPosition)
    yPosition += 15

    // Add a subtitle for the list
    doc.setFontSize(14)
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    doc.setFont("helvetica", "bold")
    doc.text("Member Details", 20, yPosition)
    yPosition += 10

    // Add a horizontal line
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.2)
    doc.line(20, yPosition, 190, yPosition)
    yPosition += 10

    // Debts List with styling
    debts.forEach((debt, index) => {
      // Add background rectangle for each member
      doc.setFillColor(245, 245, 245)
      doc.rect(15, yPosition - 5, 180, 40 + (debt.toWhoPay ? 30 : 0), "F")

      // Member name with styling
      doc.setFontSize(14)
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.setFont("helvetica", "bold")
      doc.text(`Member: ${debt.memberName}`, 20, yPosition)
      yPosition += 10

      // Contributed amount
      doc.setFontSize(12)
      doc.setTextColor(successColor[0], successColor[1], successColor[2])
      doc.setFont("helvetica", "normal")
      doc.text(`Contributed: ${formatCurrency(debt.contributed || 0)}`, 30, yPosition)

      // Expected amount (on the same line, but right-aligned)
      doc.setTextColor(warningColor[0], warningColor[1], warningColor[2])
      doc.text(`Expected: ${formatCurrency(debt.expected || 0)}`, 120, yPosition)
      yPosition += 15

      // Payment details with styling
      if (debt.toWhoPay || debt.amountToPay) {
        // Add a light blue background for payment details
        doc.setFillColor(235, 245, 251)
        doc.rect(25, yPosition - 5, 160, 25, "F")

        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2])
        doc.setFont("helvetica", "bold")
        doc.text("Payment Details:", 30, yPosition)
        yPosition += 7

        doc.setFont("helvetica", "normal")
        doc.setTextColor(80, 80, 80)
        doc.text(`Pay To: ${debt.toWhoPay || "N/A"}`, 40, yPosition)

        // Amount to pay (on the same line, but right-aligned)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
        doc.text(`Amount: ${formatCurrency(debt.amountToPay || 0)}`, 120, yPosition)
        yPosition += 15
      }

      // Add a separator line between members
      if (index < debts.length - 1) {
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.1)
        doc.line(20, yPosition, 190, yPosition)
      }

      yPosition += 10

      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20

        // Add header to new page
        doc.setFontSize(12)
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
        doc.setFont("helvetica", "italic")
        doc.text(`Debt Summary Report - Group ${groupId} (continued)`, 20, yPosition)
        yPosition += 10
      }
    })

    // Add footer with date
    const currentDate = new Date().toLocaleDateString()
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.setFont("helvetica", "italic")
    doc.text(`Generated on ${currentDate}`, 20, 280)

    // Save the PDF
    doc.save(`Debt_Summary_Group_${groupId}.pdf`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Calculate total debt
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.expected || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Add Download PDF Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download PDF Report
          </button>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden mb-6">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1">
              <div
                className={`h-full ${totalDebt > 5000 ? "bg-red-500" : totalDebt > 1000 ? "bg-orange-500" : totalDebt > 0 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min((totalDebt / 10000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="p-5">
              <h2 className="text-3xl font-bold text-white mb-2">Debt Summary</h2>
              <p className="text-gray-400 text-sm">
                Group ID: {groupId} • Total Expected: {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl text-gray-300 font-medium">No debts found for this group</p>
            <p className="text-gray-400 mt-2">When debts are recorded, they will appear here</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {debts.map((debt, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-700/50"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{debt.memberName}</h3>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-xs mb-1">Contributed</p>
                          <p className="text-lg font-semibold text-green-400">
                            {formatCurrency(debt.contributed || 0)}
                          </p>
                        </div>
                        <div className="bg-gray-700/30 p-3 rounded-lg">
                          <p className="text-gray-400 text-xs mb-1">Expected</p>
                          <p className="text-lg font-semibold text-red-400">{formatCurrency(debt.expected || 0)}</p>
                        </div>
                      </div>

                      {(debt.toWhoPay || debt.amountToPay) && (
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-400"
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
                            <h4 className="text-blue-300 font-medium">Payment Details</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Pay To</p>
                              <p className="text-white font-medium">{debt.toWhoPay || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Amount</p>
                              <p className="text-lg font-semibold text-purple-400">
                                {formatCurrency(debt.amountToPay || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Debt Progress Bar */}
                <div className="w-full bg-gray-700 h-1">
                  <div
                    className={`h-1 ${debt.contributed >= debt.expected ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${Math.min((debt.contributed / debt.expected) * 100 || 0, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DebtSummary