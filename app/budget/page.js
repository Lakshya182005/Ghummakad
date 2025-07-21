"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import useSharedBudgets from "./useSharedBudgets";

const auth = getAuth();

export default function BudgetCalculator() {
  const [userEmail, setUserEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [expense, setExpense] = useState({
    payer: "",
    amount: "",
    description: "",
    sharedWith: [],
  });

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || null);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch shared budgets
  const { budgets, loading } = useSharedBudgets(userEmail);
  if (!userEmail || loading) return <p>Loading budgets...</p>;

  // ✅ Save budget to Firestore
  const saveToFirestore = async () => {
    const settlements = calculateSettlements();

    const data = {
      participants: Array.from(new Set([...emails, userEmail])), // <-- used in rules
      expenses,
      settlements,
      createdAt: serverTimestamp(),
    };

    try {
      const docId = `budget_${Date.now()}`;
      await setDoc(doc(db, "budgets", docId), data); // <-- top-level collection
      alert("Budget saved successfully!");
    } catch (err) {
      console.error("Error saving to Firestore:", err);
      alert("Failed to save budget.");
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addEmail = () => {
    const trimmed = newEmail.trim();
    if (!emailRegex.test(trimmed)) {
      setError("Invalid email format.");
      return;
    }
    if (emails.includes(trimmed)) {
      setError("Email already added.");
      return;
    }
    setEmails((prev) => [...prev, trimmed]);
    setNewEmail("");
    setError("");
  };

  const toggleShare = (email) => {
    setExpense((prev) => {
      const sharedWith = prev.sharedWith.includes(email)
        ? prev.sharedWith.filter((e) => e !== email)
        : [...prev.sharedWith, email];
      return { ...prev, sharedWith };
    });
  };

  const addExpense = () => {
    if (
      expense.payer &&
      expense.amount &&
      expense.sharedWith.length > 0 &&
      !isNaN(expense.amount)
    ) {
      setExpenses([
        ...expenses,
        { ...expense, amount: parseFloat(expense.amount) },
      ]);
      setExpense({
        payer: "",
        amount: "",
        description: "",
        sharedWith: [],
      });
    } else {
      alert("Please fill all fields correctly.");
    }
  };

  const calculateSettlements = () => {
    const balances = {};
    emails.forEach((email) => (balances[email] = 0));

    expenses.forEach((exp) => {
      const share = exp.amount / exp.sharedWith.length;
      exp.sharedWith.forEach((person) => {
        if (person !== exp.payer) {
          balances[person] -= share;
          balances[exp.payer] += share;
        }
      });
    });

    Object.keys(balances).forEach(
      (k) => (balances[k] = Math.round(balances[k] * 100) / 100)
    );

    const debtors = [];
    const creditors = [];
    for (const [email, balance] of Object.entries(balances)) {
      if (balance < 0) debtors.push({ email, balance });
      if (balance > 0) creditors.push({ email, balance });
    }

    const settlements = [];
    while (debtors.length && creditors.length) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const minAmt = Math.min(-debtor.balance, creditor.balance);

      settlements.push({
        from: debtor.email,
        to: creditor.email,
        amount: minAmt,
      });

      debtor.balance += minAmt;
      creditor.balance -= minAmt;

      if (Math.abs(debtor.balance) < 0.01) debtors.shift();
      if (Math.abs(creditor.balance) < 0.01) creditors.shift();
    }

    return settlements;
  };

  return (
    <div className="min-h-screen bg-[#fff9f3] px-4 py-8 flex items-start justify-center">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md space-y-8">
        <h1 className="text-3xl font-bold text-center text-[#FF7A00]">🔢 Trip Budget Calculator</h1>

        {/* Shared Budgets */}
        {budgets.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Shared Budgets</h2>
            <div className="space-y-2">
              {budgets.map((b) => (
                <div
                  key={b.id}
                  className="border border-[#ffeecd] bg-[#fff7e6] p-3 rounded hover:bg-[#fff2d8] cursor-pointer transition"
                  onClick={() => {
                    setEmails(b.participants || []);
                    setExpenses(b.expenses || []);
                    alert("Budget loaded!");
                  }}
                >
                  <p className="font-bold">{b.title || "Shared Budget"}</p>
                  <p className="text-sm text-gray-600">
                    👥 {b.participants?.join(", ") || ""} | 💰 {b.expenses?.length || 0} expenses
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Participants */}
        <div>
          <h2 className="text-xl font-semibold mb-2">👥 Add Participants</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email..."
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addEmail}
              className="bg-[#3BA99C] text-white px-4 py-2 rounded hover:bg-[#329589] transition"
            >
              Add
            </button>
            <button
              onClick={saveToFirestore}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Budget
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Add Expense */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">➕ Add Expense</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="For what? (e.g., Dinner)"
              value={expense.description}
              onChange={(e) =>
                setExpense((prev) => ({ ...prev, description: e.target.value }))
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount in ₹"
              value={expense.amount}
              onChange={(e) =>
                setExpense((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="p-2 border rounded"
            />

            <select
              value={expense.payer}
              onChange={(e) =>
                setExpense((prev) => ({ ...prev, payer: e.target.value }))
              }
              className="col-span-1 md:col-span-2 p-2 border rounded"
            >
              <option value="">Select Payer</option>
              {emails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>

            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium mb-1">Split with:</p>
              <div className="flex flex-wrap gap-3">
                {emails.map((email) => (
                  <label key={email} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={expense.sharedWith.includes(email)}
                      onChange={() => toggleShare(email)}
                    />
                    <span className="text-sm">{email}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={addExpense}
            className="mt-4 bg-[#FFA45B] text-white px-4 py-2 rounded shadow hover:bg-[#ff8b2d] transition"
          >
            Add This Expense
          </button>
        </div>

        {/* Expense List */}
        {expenses.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">📋 Expense Summary</h2>
            <ul className="space-y-3">
              {expenses.map((e, index) => (
                <li key={index} className="bg-[#fff5e4] p-3 rounded shadow-sm text-sm">
                  <strong>{e.payer}</strong> paid ₹{e.amount.toFixed(2)}{" "}
                  <em>{e.description}</em>, split with {e.sharedWith.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Settlements */}
        {expenses.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">💳 Final Balances</h2>
            <ul className="text-sm space-y-2">
              {calculateSettlements().map((s, idx) => (
                <li key={idx}>
                  <strong>{s.from}</strong> owes <strong>{s.to}</strong> ₹
                  {s.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
