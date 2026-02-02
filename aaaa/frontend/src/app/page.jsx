"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verificandoToken, setVerificandoToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setVerificandoToken(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setVerificandoToken(false);
        return;
      }

      setVerificandoToken(false);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      setVerificandoToken(false);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const json = await res.json();
      console.log("RESPOSTA DO BACKEND:", json);

      if (!json.sucesso) {
        alert(json.mensagem);
        return;
      }

      localStorage.setItem("token", json.dados.token);
      localStorage.setItem("usuario", JSON.stringify(json.dados.usuario));

      const nivel = json.dados.usuario.nivel_acesso?.toLowerCase();

      if (nivel === "admin") {
        window.location.href = "/dashboardAdmin";
      } else {
        window.location.href = "/paginaUsuario";
      }
    } catch (erro) {
      console.error("Erro no login:", erro);
      alert("Erro ao conectar ao servidor.");
    }
  }

  if (verificandoToken) {
    return (
      <main className="login-container d-flex justify-content-center align-items-center h-100">
        <p>Verificando sessão...</p>
      </main>
    );
  }

  return (
    <main className="login-container w-100 min-vh-100 d-flex flex-column">

      <div className="row g-0 flex-grow-1">
        
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center login-fundo-esquerdo p-5" style={{ minHeight: '40vh' }}>
          <div className="login-conteudo-esquerdo">
            <h1 className="login-titulo mb-3">Acelere seu Desenvolvimento Profissional</h1>
            <p className="login-descricao mb-5">
              Plataforma integrada de gestão de treinamentos e desenvolvimento.
            </p>

            <ul className="ignite-feature-list">
              <li className="feature-item">Trilhas de Aprendizado Personalizadas</li>
              <li className="feature-item">Catálogo de Treinamentos</li>
              <li className="feature-item">Análise de Competências</li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center login-form-side py-5">
          <div className="login-form-wrapper p-4 bg-white rounded-4 shadow-sm" style={{ width: '90%', maxWidth: '400px' }}>
            <h2 className="login-title mb-4 text-center">Bem-vindo de volta</h2>

            <form className="formLogin" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label login-label">E-mail Corporativo</label>
                <input
                  type="email"
                  className="form-control login-input"
                  placeholder="seu.nome@gm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label login-label d-flex justify-content-between">
                  Senha
                  <a href="#" className="login-forgot-link">Esqueceu a senha?</a>
                </label>
                <input
                  type="password"
                  className="form-control login-input"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn w-100 login-btn-primary mt-3">
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
