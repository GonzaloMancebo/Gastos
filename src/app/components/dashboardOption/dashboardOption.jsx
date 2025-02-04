"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../../../../firebase.config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../styles/dashboardOption/dashboardOption.css";

const categoriasDisponibles = [
  "Rent", "Groceries", "Utilities", "Entertainment", "Cell Phone", "Car Payment"
];

const DashboardOption = () => {
  const [user, setUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().categories) {
          router.push("/dashboard"); 
        }
      } else {
        router.push("/login");
      }
    });
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
        <>
          <button onClick={saveCategories} className="save-button visible">
            Guardar ({selectedCategories.length})
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardOption;
