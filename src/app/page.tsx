"use client";
import { useState, useEffect } from "react";

type Transaction = {
  category: "spending" | "saving" | "investing";
  amount: number;
  date: Date;
};

type Goal = {
  name: string;
  target: number;
  acquired: number;
};

export default function FinanceDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [salary, setSalary] = useState(0);
  const [spending, setSpending] = useState(50);
  const [saving, setSaving] = useState(30);
  const [investing, setInvesting] = useState(20);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    category: "spending",
    amount: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const salaryAmounts = {
    spending: (salary * spending) / 100,
    saving: (salary * saving) / 100,
    investing: (salary * investing) / 100,
  };

  // Load data from localStorage
  useEffect(() => {
    setIsClient(true);
    const loadData = () => {
      setSalary(Number(localStorage.getItem("salary") || 0));
      setSpending(Number(localStorage.getItem("spending") || 50));
      setSaving(Number(localStorage.getItem("saving") || 30));
      setInvesting(Number(localStorage.getItem("investing") || 20));
      setGoals(JSON.parse(localStorage.getItem("goals") || "[]"));
      setTransactions(JSON.parse(localStorage.getItem("transactions") || "[]"));
    };
    loadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("salary", salary.toString());
      localStorage.setItem("spending", spending.toString());
      localStorage.setItem("saving", saving.toString());
      localStorage.setItem("investing", investing.toString());
      localStorage.setItem("goals", JSON.stringify(goals));
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [salary, spending, saving, investing, goals, transactions, isClient]);

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpending(50);
    setSaving(30);
    setInvesting(20);
  };

  const getMonthlyTotal = (category: "spending" | "saving" | "investing") => {
    return transactions
      .filter(
        (t) =>
          t.category === category &&
          new Date(t.date).toISOString().slice(0, 7) === selectedMonth
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddTransaction = (
    category: "spending" | "saving" | "investing"
  ) => {
    if (newTransaction.amount > 0) {
      setTransactions([
        ...transactions,
        {
          category,
          amount: newTransaction.amount,
          date: new Date(),
        },
      ]);
      setNewTransaction({ category: "spending", amount: 0 });
    }
  };

  const ProgressBar = ({ spent, total }: { spent: number; total: number }) => (
    <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${Math.min((spent / total) * 100, 100)}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Salary Configuration */}
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3">Configuração de Salário</h2>
        <form
          onSubmit={handleSalarySubmit}
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            type="number"
            value={salary || ""}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="border-2 border-gray-300 p-2 rounded-lg w-full text-sm"
            placeholder="Salário mensal"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            Definir Salário
          </button>
        </form>
      </div>

      {/* Month Selector */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-center">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded-lg text-sm w-full max-w-[200px]"
        />
      </div>

      {/* Budget Cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {[
          {
            category: "spending" as const,
            label: "Gastos",
            color: "bg-blue-50",
          },
          {
            category: "saving" as const,
            label: "Economias",
            color: "bg-green-50",
          },
          {
            category: "investing" as const,
            label: "Investimentos",
            color: "bg-purple-50",
          },
        ].map((section) => {
          const spent = getMonthlyTotal(section.category);
          const total = salaryAmounts[section.category];
          const remaining = total - spent;

          return (
            <div
              key={section.category}
              className={`${section.color} p-4 rounded-lg shadow-sm`}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{section.label}</h3>
                  <p className="text-xl">R${total.toFixed(2)}</p>
                </div>
                <div className="w-full md:w-auto space-y-2">
                  <input
                    type="number"
                    value={
                      newTransaction.category === section.category
                        ? newTransaction.amount
                        : ""
                    }
                    onChange={(e) =>
                      setNewTransaction({
                        category: section.category,
                        amount: Number(e.target.value),
                      })
                    }
                    className="border-2 border-gray-300 p-2 rounded-lg w-full text-sm"
                    placeholder="Valor"
                  />
                  <button
                    onClick={() => handleAddTransaction(section.category)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full text-sm"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <ProgressBar spent={spent} total={total} />
              <div className="flex justify-between text-xs mt-2">
                <span>Gasto: R${spent.toFixed(2)}</span>
                <span>Restante: R${Math.max(remaining, 0).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goals Management */}
      <div className="max-w-4xl mx-auto mt-8 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Metas Financeiras</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Nome da meta"
            className="border-2 border-gray-300 p-2 rounded-lg text-sm"
          />
          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Valor alvo"
            className="border-2 border-gray-300 p-2 rounded-lg text-sm"
          />
          <button
            onClick={() => {
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
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
          >
            Adicionar Meta
          </button>
        </div>

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 p-3 rounded-lg"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                <h3 className="font-semibold text-sm">{goal.name}</h3>
                <span className="text-sm">
                  R${goal.acquired} / R${goal.target}
                </span>
              </div>
              <ProgressBar spent={goal.acquired} total={goal.target} />
              <input
                type="number"
                value={goal.acquired}
                onChange={(e) => {
                  const updatedGoals = [...goals];
                  updatedGoals[index].acquired = Math.min(
                    Number(e.target.value),
                    goal.target
                  );
                  setGoals(updatedGoals);
                }}
                className="border-2 border-gray-300 p-2 rounded-lg w-full text-sm mt-2"
                placeholder="Progresso"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
