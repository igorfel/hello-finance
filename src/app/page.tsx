"use client";
import { useState, useEffect } from "react";

export default function FinanceDashboard() {
  // State initialization with localStorage
  const [salary, setSalary] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("salary") : null;
    return saved ? Number(saved) : 0;
  });

  const [spending, setSpending] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("spending") : null;
    return saved ? Number(saved) : 50;
  });

  const [saving, setSaving] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("saving") : null;
    return saved ? Number(saved) : 30;
  });

  const [investing, setInvesting] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("investing") : null;
    return saved ? Number(saved) : 20;
  });

  const [goals, setGoals] = useState<
    Array<{ name: string; target: number; acquired: number }>
  >(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("goals") : null;
    return saved ? JSON.parse(saved) : [];
  });

  const [newGoal, setNewGoal] = useState("");
  const [newTarget, setNewTarget] = useState("");

  // Save to localStorage effects
  useEffect(() => {
    localStorage.setItem("salary", salary.toString());
  }, [salary]);

  useEffect(() => {
    localStorage.setItem("spending", spending.toString());
  }, [spending]);

  useEffect(() => {
    localStorage.setItem("saving", saving.toString());
  }, [saving]);

  useEffect(() => {
    localStorage.setItem("investing", investing.toString());
  }, [investing]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpending(50);
    setSaving(30);
    setInvesting(20);
  };

  const totalAllocation = spending + saving + investing;
  const salaryAmounts = {
    spending: (salary * spending) / 100,
    saving: (salary * saving) / 100,
    investing: (salary * investing) / 100,
  };

  const addGoal = () => {
    if (newGoal && Number(newTarget) > 0) {
      setGoals([
        ...goals,
        {
          name: newGoal,
          target: Number(newTarget),
          acquired: 0,
        },
      ]);
      setNewGoal("");
      setNewTarget("");
    }
  };

  const updateProgress = (index: number, amount: number) => {
    const updatedGoals = [...goals];
    updatedGoals[index].acquired = Math.min(amount, updatedGoals[index].target);
    setGoals(updatedGoals);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
        {/* Salary Input Section */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            Configuração de Salário
          </h2>
          <form
            onSubmit={handleSalarySubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input
              type="number"
              value={salary || ""}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="border-2 border-gray-200 bg-white p-2 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Salário mensal"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto transition-colors"
            >
              Definir Salário
            </button>
          </form>
        </div>

        {/* Allocation Controls */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            Distribuição Orçamentária
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-3 mb-4">
            {[
              { label: "Gastos (%)", value: spending, setter: setSpending },
              { label: "Economias (%)", value: saving, setter: setSaving },
              {
                label: "Investimentos (%)",
                value: investing,
                setter: setInvesting,
              },
            ].map((item, index) => (
              <div key={index}>
                <label className="block mb-2 text-gray-700 text-sm md:text-base">
                  {item.label}
                </label>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e) => item.setter(Number(e.target.value))}
                  className="border-2 border-gray-200 bg-white p-2 rounded-lg w-full text-sm md:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            ))}
          </div>

          {totalAllocation !== 100 && (
            <p className="text-red-500 mb-4 text-sm md:text-base">
              A alocação total deve ser 100% (Atual: {totalAllocation}%)
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                label: "Gastos",
                value: salaryAmounts.spending,
                color: "bg-blue-50",
              },
              {
                label: "Economias",
                value: salaryAmounts.saving,
                color: "bg-green-50",
              },
              {
                label: "Investimentos",
                value: salaryAmounts.investing,
                color: "bg-purple-50",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.color} p-3 md:p-4 rounded-lg`}
              >
                <h3 className="font-semibold text-sm md:text-base">
                  {item.label}
                </h3>
                <p className="text-lg md:text-2xl font-medium">
                  R${item.value.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Management */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
            Metas Financeiras
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="border-2 border-gray-200 bg-white p-2 rounded-lg text-sm md:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Nome da meta"
            />
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="border-2 border-gray-200 bg-white p-2 rounded-lg text-sm md:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Valor alvo"
            />
            <button
              onClick={addGoal}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base w-full transition-colors"
            >
              Adicionar Meta
            </button>
          </div>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="border-2 border-gray-100 p-3 rounded-lg bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <h3 className="font-semibold text-sm md:text-base">
                    {goal.name}
                  </h3>
                  <span className="text-sm md:text-base">
                    R${goal.acquired} / R${goal.target}
                  </span>
                </div>
                <input
                  type="number"
                  value={goal.acquired || ""}
                  onChange={(e) =>
                    updateProgress(index, Number(e.target.value))
                  }
                  className="border-2 border-gray-200 bg-white p-2 rounded-lg w-full text-sm md:text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Progresso"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
