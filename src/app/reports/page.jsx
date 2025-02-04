"use client";
import { useState, useEffect } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import "../styles/reports/reports.css";


// Registrar los elementos necesarios para chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: 0, income: 0, date: "" });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Función para calcular las fechas de inicio y fin de la semana
  const getWeekDates = (currentDate) => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Ajuste si es domingo (0)
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Final de la semana

    return { start: start, end: end };
  };

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

    // Calcular las fechas de la semana actual
    const { start, end } = getWeekDates(new Date());
    setStartDate(start);
    setEndDate(end);
  }, []);

  // Filtrar los gastos según la semana seleccionada
  const filteredExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });

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

  const totalIncome = filteredExpenses.reduce((total, exp) => total + (exp.income || 0), 0);
  const totalExpenses = filteredExpenses.reduce((total, exp) => total + exp.amount, 0);

  const incomeVsExpenses = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [{ data: [totalIncome, totalExpenses], backgroundColor: ['#36a2eb', '#ff6384'] }]
  };

  const handlePrevWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7); // Retroceder una semana
    const { start, end } = getWeekDates(newStartDate);
    setStartDate(start);
    setEndDate(end);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7); // Avanzar una semana
    const { start, end } = getWeekDates(newStartDate);
    setStartDate(start);
    setEndDate(end);
  };

  // Función para dar formato de "día/mes/año"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <header>
        <h1>Dashboard de Gastos</h1>
        <div className="date-container">
          <div className="week-nav-buttons">
            <button onClick={handlePrevWeek}>{"<"}</button>
            <p>Semana: {startDate && formatDate(startDate)} - {endDate && formatDate(endDate)}</p>
            <button onClick={handleNextWeek}>{">"}</button>
          </div>
        </div>
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

export default Reports;
