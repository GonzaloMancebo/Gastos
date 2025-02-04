"use client";
import { useState, useEffect } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "../styles/dashboard/Dashboard.css";

// Registrar los elementos necesarios para chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: 0, income: 0, date: "" });

  // Cargar datos de Firebase
  useEffect(() => {
    const fetchData = async () => {
      const expensesCollection = collection(db, "expenses");
      const categoriesCollection = collection(db, "categories");

      const expenseSnapshot = await getDocs(expensesCollection);
      const categorySnapshot = await getDocs(categoriesCollection);

      setExpenses(expenseSnapshot.docs.map(doc => doc.data()));
      setCategories(categorySnapshot.docs.map(doc => doc.data()));
    };

    fetchData();
  }, []);

  const addExpense = async () => {
    try {
      const expenseRef = collection(db, "expenses");
      await addDoc(expenseRef, { ...newExpense, date: new Date(newExpense.date) });

      setExpenses([...expenses, newExpense]);
      setNewExpense({ category: "", amount: 0, income: 0, date: "" });
      alert("Gasto agregado correctamente.");
    } catch (error) {
      alert("Error al agregar gasto.");
    }
  };

  const totalIncome = expenses.reduce((total, exp) => total + (exp.income || 0), 0);
  const totalExpenses = expenses.reduce((total, exp) => total + exp.amount, 0);

  const incomeVsExpenses = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{ data: [totalIncome, totalExpenses], backgroundColor: ['#36a2eb', '#ff6384'] }]
  };

  return (
    <div>
      <header>
        <h1>Dashboard de Gastos</h1>
        <button onClick={() => alert('Cambiar rango de fechas')}>Cambiar Fechas</button>
      </header>

      <div>
        <h2>Gastos por Categoría</h2>
        <Pie data={incomeVsExpenses} />
      </div>

      <div>
        <h2>Agregar Gasto</h2>
        <form onSubmit={(e) => { e.preventDefault(); addExpense(); }}>
          <input type="text" placeholder="Categoría" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} required />
          <input type="number" placeholder="Monto" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })} required />
          <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} required />
          <button type="submit">Agregar Gasto</button>
        </form>
      </div>

      <nav>
        <ul>
          <li><Link href="/envelopes">Envelopes</Link></li>
          <li><Link href="/transactions">Transacciones</Link></li>
          <li><Link href="/accounts">Cuentas</Link></li>
          <li><Link href="/reports">Reportes</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
