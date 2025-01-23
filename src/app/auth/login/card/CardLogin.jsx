"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Importar el hook de enrutamiento de next/navigation
import Link from "next/link";
import "./cardLogin.css"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Importar Firebase Auth
import {app} from "../../../../../firebase.config"
import Image from "next/image";

function cardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Hook para redirección

  const showNotification = (message, type = "error") => {
    const notification = document.createElement("div");
    notification.classList.add("notification", type, "show");
    notification.textContent = message;
    document.body.appendChild(notification);

    // Desaparecer la notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 1000); // Eliminar después de la animación
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!email || !password) {
      showNotification("Por favor, completa todos los campos.", "error");
      return;
    }

    const auth = getAuth(app);

    try {
      // Inicia sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario logueado:", user);

      // Mostrar mensaje de éxito
      showNotification(`Bienvenido de nuevo!.`, "success");

      // Redirigir 
      setTimeout(() => {
        router.push("/products"); 
      }, 3000);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Welcome</h2>
          <div className="image-container">
          <Image className="image" src="/profile.jpg" alt="Profile" width={100} height={100} />
          </div>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Input your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="btn-login-container">
            <button type="submit" className="btn-login">Login</button>
          </div>
          
          <div className="btn-login-container">
            <Link href="/auth/signup">
              <button type="button" className="btn-signup">Sign Up</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default cardLogin;
