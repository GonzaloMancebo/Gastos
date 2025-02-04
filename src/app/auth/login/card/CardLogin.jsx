"use client";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../../../firebase.config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./cardLogin.css";

function CardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Hook de Next.js para navegación

  // Función para mostrar notificaciones en pantalla
  const showNotification = (message, type = "error") => {
    const notification = document.createElement("div");
    notification.classList.add("notification", type, "show");
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 1000);
    }, 3000);
  };

  // Manejo del formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification("Por favor, completa todos los campos.", "error");
      return;
    }

    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado:", userCredential.user);
      showNotification("Bienvenido de nuevo!", "success");

      // Redirigir al Dashboard después de un pequeño delay
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
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
              placeholder="Input your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
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

export default CardLogin;
