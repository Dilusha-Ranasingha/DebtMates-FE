// src/components/Group/DebtTable.jsx
const DebtTable = ({ debts }) => {
    if (!debts || debts.length === 0) {
      return <p className="text-gray-600">No debts recorded yet.</p>;
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-left">Contributed</th>
              <th className="p-3 text-left">Expected</th>
              <th className="p-3 text-left">Owes To</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {debts.map((debt, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{debt.memberName}</td>
                <td className="p-3">${debt.contributed}</td>
                <td className="p-3">${debt.expected}</td>
                <td className="p-3">{debt.toWhoPay || 'N/A'}</td>
                <td className="p-3">${debt.amountToPay || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DebtTable;