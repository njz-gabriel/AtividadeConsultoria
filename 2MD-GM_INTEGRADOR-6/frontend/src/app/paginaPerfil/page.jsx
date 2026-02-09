"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./paginaPerfil.css";

export default function PaginaPerfil() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ concluidos: 0, horas: 0, progresso: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatsUsuario() {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/inscricoes/usuario/${user.id}?t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.sucesso) {
          const meusCursos = data.dados || [];

          const statusConcluidos = ['Concluído', 'Concluido', 'concluido'];
          const cursosConcluidos = meusCursos.filter(c => statusConcluidos.includes(c.status));

          const totalHoras = cursosConcluidos.reduce((acc, curr) => acc + (curr.duracao_horas || 0), 0);

          const totalCursos = meusCursos.length;
          const taxa = totalCursos > 0 ? Math.round((cursosConcluidos.length / totalCursos) * 100) : 0;

          setStats({
            concluidos: cursosConcluidos.length,
            horas: totalHoras,
            progresso: taxa
          });
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStatsUsuario();
  }, [user]);

  const getIniciais = (nome) => {
    if (!nome) return "U";
    return nome.substring(0, 2).toUpperCase();
  };

  if (loading) return <div className="p-5 text-center">Carregando...</div>;
  if (!user) return <div className="p-5 text-center">Faça login para visualizar.</div>;

  return (
    <div className="container-fluid pagina-usuario px-0">
      <div className="row g-0">

        {/* FIX: sidebar agora é sticky e não empurra o layout */}
        <aside className="d-none d-md-block col-md-3 col-lg-2 bg-white border-end p-3 sidebar position-sticky" style={{ top: 0, height: "100vh" }}>
          <ul className="list-unstyled menu">
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-house-door"></i>
              <Link href="/paginaUsuario"><span>Dashboard</span></Link>
            </li>
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-book"></i>
              <Link href="/catalogo"><span>Catálogo de Treinamentos</span></Link>
            </li>
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-award"></i>
              <Link href="/meuTreinamento"><span>Meus Treinamentos</span></Link>
            </li>
            <li className="ativo d-flex align-items-center gap-2">
              <i className="bi bi-person"></i>
              <Link href="/paginaPerfil"><span>Meu Perfil</span></Link>
            </li>
          </ul>
        </aside>

        {/* FIX: removido container dentro de container */}
        <main className="col-12 col-md-9 col-lg-10 px-3 py-4 bg-light">

          <div className="row g-3 mb-4">
            <div className="col-12">
              <h1 className="h3 fw-bold mb-1" style={{ color: "#0a2b6b" }}>
                Meu Perfil
              </h1>
              <p className="text-muted">
                Visualize suas informações pessoais e profissionais
              </p>
            </div>
          </div>

          {/* FIX: layout agora fluido e responsivo */}
          <div className="row g-4">

            {/* COLUNA PRINCIPAL */}
            <div className="col-lg-8">

              <div className="perfil-container bg-white p-4 rounded-4 shadow-sm border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h5 fw-bold mb-0">Informações Pessoais</h2>
                </div>

                <hr className="text-muted opacity-25" />

                <section className="info-perfil d-flex align-items-center gap-3 mb-4">
                  <div
                    className="foto-perfil rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-3"
                    style={{ width: 80, height: 80, backgroundColor: "#0a2b6b" }}
                  >
                    {getIniciais(user.nome)}
                  </div>
                  <div className="texto-perfil">
                    <span className="d-block fw-bold fs-5">{user.nome}</span>
                    <span className="d-block text-muted small mb-2">
                      {user.cargo || "Colaborador"}
                    </span>
                  </div>
                </section>

                <section className="info-detalhes row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-muted">Nome Completo</label>
                    <div className="form-control bg-light text-dark border-0">{user.nome}</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-muted">E-mail</label>
                    <div className="form-control bg-light text-dark border-0">{user.email}</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold text-muted">ID Colaborador</label>
                    <div className="form-control bg-light text-muted border-0">GM-{user.id}</div>
                  </div>
                </section>
              </div>

              {/* Informações profissionais */}
              {/* ==== INFORMAÇÕES PROFISSIONAIS (GRID ESTÁVEL) ==== */}
              <div className="infoProfissionais-container mt-4">
                <h2 className="h5 fw-bold mb-3">Informações Profissionais</h2>

                {/* Grid independente do bootstrap */}
                <div className="grid-prof">
                  <div className="card-info-prof-item">
                    <div className="icon bg-primary-subtle p-3 rounded-3">
                      <i className="bi bi-buildings fs-4" />
                    </div>
                    <div className="text-wrap">
                      <small className="text-muted">Departamento</small>
                      <span className="fw-semibold text-dark">{user.departamento || "Não informado"}</span>
                    </div>
                  </div>

                  <div className="card-info-prof-item">
                    <div className="icon bg-warning-subtle p-3 rounded-3">
                      <i className="bi bi-suitcase-lg fs-4" />
                    </div>
                    <div className="text-wrap">
                      <small className="text-muted">Cargo</small>
                      <span className="fw-semibold text-dark">{user.cargo || "Não informado"}</span>
                    </div>
                  </div>

                  <div className="card-info-prof-item">
                    <div className="icon bg-success-subtle p-3 rounded-3">
                      <i className="bi bi-geo-alt fs-4" />
                    </div>
                    <div className="text-wrap">
                      <small className="text-muted">Unidade</small>
                      <span className="fw-semibold text-dark">{user.unidade || "GM São Caetano"}</span>
                    </div>
                  </div>

                  <div className="card-info-prof-item">
                    <div className="icon bg-info-subtle p-3 rounded-3">
                      <i className="bi bi-calendar-check fs-4" />
                    </div>
                    <div className="text-wrap">
                      <small className="text-muted">Admissão</small>
                      <span className="fw-semibold text-dark">
                        {user.data_admissao ? new Date(user.data_admissao).toLocaleDateString("pt-BR") : "15/03/2020"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


            </div>

            {/* LATERAL DIREITA */}
            <div className="col-lg-4">

              <div className="conquista-container bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h2 className="h5 fw-bold mb-3">Conquistas Recentes</h2>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-3 align-items-center">
                    <div className="p-2 bg-light rounded text-primary">
                      <i className="bi bi-award fs-4"></i>
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Aluno Dedicado</h6>
                      <small className="text-muted">10 cursos • 10/2025</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-center">
                    <div className="p-2 bg-light rounded text-primary">
                      <i className="bi bi-reception-4 fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Meta Alcançada</h6>
                      <small className="text-muted">100h treino • 09/2025</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3 align-items-center">
                    <div className="p-2 bg-light rounded text-primary">
                      <i className="bi bi-graph-up-arrow fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Líder Inspirador</h6>
                      <small className="text-muted">5 estrelas • 08/2025</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="estatistica-container bg-white p-4 rounded-4 shadow-sm border mb-4">
                <h2 className="h5 fw-bold mb-3">Estatísticas</h2>
                <div className="text-center py-2 border-bottom">
                  <h3 className="fw-bold mb-0" style={{ color: "#0a2b6b" }}>{stats.concluidos}</h3>
                  <small className="text-muted">Cursos Concluídos</small>
                </div>
                <div className="text-center py-2 border-bottom">
                  <h3 className="fw-bold mb-0" style={{ color: "#0a2b6b" }}>{stats.horas}h</h3>
                  <small className="text-muted">Horas de Treinamento</small>
                </div>
                <div className="text-center py-2 pt-3">
                  <h3 className="fw-bold mb-0" style={{ color: "#0a2b6b" }}>{stats.progresso}%</h3>
                  <small className="text-muted">Taxa de Conclusão</small>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
