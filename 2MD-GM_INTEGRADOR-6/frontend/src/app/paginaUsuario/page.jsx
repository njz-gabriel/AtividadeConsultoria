"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./paginaUsuario.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PaginaUsuario() {

  const { user } = useAuth();

  const [cursosRecomendados, setCursosRecomendados] = useState([]);
  const [stats, setStats] = useState({ concluidos: 0, horas: 0, progresso: 0 });
  const [loading, setLoading] = useState(true);

  // 1. useEffect para carregar Cursos Recomendados
  useEffect(() => {
    async function fetchCursos() {
      try {
        const res = await fetch("http://localhost:3001/api/treinamentos");
        const data = await res.json();

        if (data.sucesso) {
          const ativos = data.dados.filter(c => c.status === 'Ativo');
          const tresUltimos = ativos.slice(0, 3);
          setCursosRecomendados(tresUltimos);
        }
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCursos();
  }, []);

  // 2. useEffect para carregar Estatísticas
  useEffect(() => {
    async function fetchStatsUsuario() {
      if (!user || !user.id) return;

      try {
        const res = await fetch(`http://localhost:3001/api/inscricoes/usuario/${user.id}?t=${new Date().getTime()}`);
        const data = await res.json();

        if (data.sucesso) {
          const meusCursos = data.dados || [];

          const statusConcluidos = ["Concluído", "Concluido", "concluido"];
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
      }
    }

    fetchStatsUsuario();
  }, [user]);

  const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return "Colaborador";
    return nomeCompleto.split(" ")[0];
  };

  return (
    <div className="container-fluid pagina-usuario">
      <div className="row g-0">

        {/* Sidebar */}
        <aside className="d-none d-md-block col-md-3 col-lg-2 bg-white border-end p-3 sidebar">
          <ul className="list-unstyled menu">
            <li className="ativo mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-house-door"></i>
              <span>Dashboard</span>
            </li>
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-book"></i>
              <Link href={"catalogo"}><span>Catálogo de Treinamentos</span></Link>
            </li>
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-award"></i>
              <Link href={"meuTreinamento"}><span>Meus Treinamentos</span></Link>
            </li>
            <li className="d-flex align-items-center gap-2">
              <i className="bi bi-person"></i>
              <Link href={"paginaPerfil"}><span>Meu Perfil</span></Link>
            </li>
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <main className="col-12 col-md-9 px-4 py-4">

          <section className="bemVindo mb-4">
            <p className="fs-5 fw-semibold">
              Bem-vindo, <strong>{user ? getPrimeiroNome(user.nome) : "..."}</strong>
              <br />
              <span className="text-muted">Continue seu desenvolvimento profissional.</span>
            </p>
          </section>

          {/* Cards estatísticos */}
          <div className="container-fluid my-2">
            <div className="row g-3">
              <div className="col-12">
                <div className="row justify-content-center g-3">

                  <div className="col-12 col-sm-6 col-md-4 px-2">
                    <div className="card card-info azul">
                      <div className="card-body d-flex align-items-center">
                        <div className="progresso">
                          <p className="titulo mb-1">Cursos Concluídos</p>
                          <p className="valor mb-0">{stats.concluidos}</p>
                        </div>
                        <div className="posicaoIcon">
                          <div className="icon me-0"><i className="bi bi-book"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-md-4 px-2">
                    <div className="card card-info laranja">
                      <div className="card-body d-flex align-items-center">
                        <div className="progresso">
                          <p className="titulo mb-1">Horas de Treinamento</p>
                          <p className="valor mb-0">{stats.horas}h</p>
                        </div>
                        <div className="posicaoIcon">
                          <div className="icon me-0"><i className="bi bi-clock"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-md-4 px-2">
                    <div className="card card-info roxo">
                      <div className="card-body d-flex align-items-center">
                        <div className="progresso">
                          <p className="titulo mb-1">Progresso Geral</p>
                          <p className="valor mb-0">{stats.progresso}%</p>
                        </div>
                        <div className="posicaoIcon">
                          <div className="icon mb-0"><i className="bi bi-graph-up"></i></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>


          {/* DIVISÃO EM 2 COLUNAS */}
          <div className="row g-4 mt-2">

            {/* Coluna esquerda */}
            <div className="col-12 col-md-12 col-lg-6">
              <div className="Cards h-100">

                <div className="Cards-estrutura">
                  <div>
                    <p className="titulo-principal">Cursos Recomendados</p>
                    <p className="subtitulo-trilha">Com base no seu perfil e objetivos</p>
                  </div>
                </div>

                <div className="lista-cursos">
                  {loading ? (
                    <div className="text-center py-3 text-muted">Carregando recomendações...</div>
                  ) : (
                    cursosRecomendados.map((curso) => (
                      <div className="curso-item" key={curso.id}>
                        <div className="curso-info">
                          <p className="nome-curso">{curso.titulo}</p>
                          <div className="detalhes-curso">
                            <span><i className="bi bi-clock"></i> {curso.duracao_horas}h</span>
                            <span className="categoria">{curso.categoria}</span>
                            <span className="nivel">{curso.nivel}</span>
                          </div>
                        </div>
                        <Link href={`/catalogo/${curso.id}`}>
                          <button className="btn-verDetalhes">Ver Detalhes</button>
                        </Link>
                      </div>
                    ))
                  )}
                </div>

                <Link href={"catalogo"}>
                  <button className="btn-todos-cursos mt-3">Ver Todos os Cursos</button>
                </Link>

              </div>
            </div>

            {/* Coluna direita */}
            <aside className="col-12 col-md-12 col-lg-6">
              <div className="Cards h-100">

                <p className="titulo-principal mb-3">
                  <i className="bi bi-calendar-event me-2"></i> Próximos Treinamentos
                </p>

                <div className="treinamento mb-3">
                  <p className="titulo-treinamento">Workshop: Cultura de Segurança</p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-calendar"></i> 15/12/2025 às 14:00
                  </p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-geo-alt"></i> Presencial - Sala 301
                  </p>
                  <span className="status confirmado">Confirmado</span>
                </div>

                <div className="treinamento mb-3">
                  <p className="titulo-treinamento">Webinar: Tendências Automotivas 2026</p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-calendar"></i> 20/12/2025 às 10:00
                  </p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-laptop"></i> Online - Teams
                  </p>
                  <span className="status aguardando">Aguardando Confirmação</span>
                </div>

                <div className="treinamento">
                  <p className="titulo-treinamento">Palestra: Futuro da Mobilidade Elétrica</p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-calendar"></i> 10/01/2026 às 09:00
                  </p>
                  <p className="detalhe-treinamento">
                    <i className="bi bi-geo-alt"></i> Auditório Principal
                  </p>
                  <span className="status confirmado">Confirmado</span>
                </div>

              </div>
            </aside>

          </div>

        </main>
      </div>
    </div>
  );
}
