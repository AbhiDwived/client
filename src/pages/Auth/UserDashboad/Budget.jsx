import React, { useState } from 'react';


export default function Budget() {
  // Sample initial state
  const [budget, setBudget] = useState([
    { id: 1, category: "Venue", planned: 50000, actual: 45000 },
    { id: 2, category: "Catering", planned: 30000, actual: 28000 },
  ]);

  const [newBudgetItem, setNewBudgetItem] = useState({ category: "", planned: 0 });

  // Calculate totals
  const totalPlanned = budget.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = budget.reduce((sum, item) => sum + (item.actual || 0), 0);
  const budgetRemaining = totalPlanned - totalActual;

  // Update actual cost input handler
  const updateActualBudget = (id, actual) => {
    setBudget((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, actual } : item
      )
    );
  };

  // Add new budget item handler
  const handleAddBudgetItem = () => {
    if (!newBudgetItem.category || newBudgetItem.planned <= 0) return;

    const newItem = {
      id: Date.now(),
      category: newBudgetItem.category,
      planned: newBudgetItem.planned,
      actual: 0,
    };

    setBudget([...budget, newItem]);
    setNewBudgetItem({ category: "", planned: 0 });
  };
  return (
    <div className="flex min-h-screen">
      <div className=" min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Wedding Budget</h2>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Total Budget:</span>{" "}
                  <span className="font-bold">Rs{totalPlanned.toLocaleString()}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr style={{ borderBottom: '1px solid gray' }}>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Planned</th>
                      <th className="text-right py-3 px-4">Actual</th>
                      <th className="text-right py-3 px-4">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid gray' }}>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4 text-right">{item.planned.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            value={item.actual || ""}
                            onChange={(e) =>
                              updateActualBudget(item.id, Number(e.target.value))
                            }
                            className="w-24 text-right border rounded px-2 py-1"
                            min={0}
                          />
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-medium ${item.actual && item.actual > item.planned
                              ? "text-red-500"
                              : "text-green-500"
                            }`}
                        >
                          {item.actual
                            ? (item.planned - item.actual).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4 text-right">{totalPlanned.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{totalActual.toLocaleString()}</td>
                      <td
                        className={`py-3 px-4 text-right ${budgetRemaining < 0 ? "text-red-500" : "text-green-500"
                          }`}
                      >
                        {budgetRemaining.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add Budget Item</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block mb-1 font-medium">
                    Category
                  </label>
                  <input
                    id="category"
                    placeholder="e.g., Flowers"
                    value={newBudgetItem.category}
                    onChange={(e) =>
                      setNewBudgetItem({ ...newBudgetItem, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="planned" className="block mb-1 font-medium">
                    Planned Amount (₹)
                  </label>
                  <input
                    id="planned"
                    type="number"
                    placeholder="0"
                    value={newBudgetItem.planned || ""}
                    onChange={(e) =>
                      setNewBudgetItem({
                        ...newBudgetItem,
                        planned: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min={0}
                  />
                </div>

                <button
                  onClick={handleAddBudgetItem}
                  disabled={!newBudgetItem.category || newBudgetItem.planned <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  Add Budget Item
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Planned:</span>
                  <span className="font-bold">₹{totalPlanned.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-bold">₹{totalActual.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`font-bold ${budgetRemaining < 0 ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    ₹{budgetRemaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
