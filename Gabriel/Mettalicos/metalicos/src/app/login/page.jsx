"use client";
import './login.css'
import { useState } from "react";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css'
import Image from 'next/image'


export default function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/adm/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/adm");
    } else {
      alert(data.message);
    }
  };

  return (


    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="w-100" style={{ maxWidth: 360 }}>
        <div className="text-center mb-3">
          <Image
            src="/Banner/logo.png"
            width={100}
            height={100}
            alt="bizarro"
          />
        </div>

        <form onSubmit={handleLogin} className="d-flex flex-column gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>

  );
}
