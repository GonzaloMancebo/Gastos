"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../../firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/dashboardOption/dashboardOption.css";

const categoriasDisponibles = [
  "Rent", "Groceries", "Utilities", "Entertainment", "Cell Phone", "Car Payment"
];

const DashboardOption = () => {
  const [user, setUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 Estado para evitar que se muestre antes de tiempo
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().categories) {
        router.push("/dashboard"); // 🔥 Si ya tiene categorías, lo mandamos directo
      } else {
        setLoading(false); // 🔥 Solo mostramos la pantalla si NO tiene categorías
      }
    });

    return () => unsubscribe();
  }, [router]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const saveCategories = async () => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), { categories: selectedCategories });
      router.push("/dashboard");
    }
  };

  if (loading) {
    return <p>Cargando...</p>; // 🔥 Evita mostrar la pantalla hasta que la consulta termine
  }

  return (
    <div className="container">
      <h1>Selecciona tus categorías</h1>
      <div className="selection-container">
        {categoriasDisponibles.map((categoria) => (
          <div 
            key={categoria} 
            className={`category-item ${selectedCategories.includes(categoria) ? "selected" : ""}`}
            onClick={() => toggleCategory(categoria)}
          >
            <p>{categoria}</p>
            <span>{selectedCategories.includes(categoria) ? "✅" : "➕"}</span>
          </div>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <button onClick={saveCategories} className="save-button visible">
          Guardar ({selectedCategories.length})
        </button>
      )}
    </div>
  );
};

export default DashboardOption;
