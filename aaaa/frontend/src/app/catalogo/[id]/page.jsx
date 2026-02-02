"use client";

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../catalogo.css";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

export default function DetalhesCurso() {
  const { id } = useParams();
  const { user } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState("visao-geral");

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estaInscrito, setEstaInscrito] = useState(false);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    if (!id) return;

    const carregarDados = async () => {
      try {
        setLoading(true);

        const resCurso = await fetch(`http://localhost:3001/api/treinamentos/${id}`);
        const dataCurso = await resCurso.json();
        if (dataCurso.sucesso) setCurso(dataCurso.dados);

        if (user) {
          const resInsc = await fetch(`http://localhost:3001/api/inscricoes/checar?usuario_id=${user.id}&treinamento_id=${id}`);
          const dataInsc = await resInsc.json();

          if (dataInsc.inscrito) {
            setEstaInscrito(true);
            setProgresso(dataInsc.progresso || 0);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [id, user]);

  const handleInscrever = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Faça login para se inscrever."
      });
      return;
    }

    if (estaInscrito) {
      Swal.fire({
        icon: "info",
        title: "Aviso",
        text: "Você já está participando deste curso."
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: user.id, treinamento_id: id })
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Inscrição realizada!",
          text: "Você foi inscrito com sucesso 🎉"
        });

        setEstaInscrito(true);
        setProgresso(0);
      } else {
        const erro = await res.json().catch(() => ({}));

        if (
          res.status === 409 ||
          res.status === 400 ||
          (erro.mensagem && erro.mensagem.includes('inscrito'))
        ) {
          Swal.fire({
            icon: "info",
            title: "Aviso",
            text: "Você já está inscrito neste curso!"
          });
          setEstaInscrito(true);
        } else {
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: erro.mensagem || "Não foi possível realizar a inscrição. Tente novamente."
          });
        }
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Erro de conexão",
        text: "Não foi possível conectar ao servidor."
      });
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Carregando curso...</div>;
  if (!curso) return <div className="p-5 text-center text-danger">Curso não encontrado.</div>;

  return (
    <div className="container-fluid pagina-usuario">
      <div className="row flex-nowrap">

        <aside className="d-none d-md-block col-md-3 col-lg-2 bg-white border-end p-3 sidebar" style={{ minHeight: "100vh" }}>
          <ul className="list-unstyled menu sticky-top pt-3">
            <li className=" mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-house-door"></i>
              <Link href={'../paginaUsuario'}><span>Dashboard</span></Link>
            </li>
            <li className=" ativo mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-book"></i>
              <Link href={'../catalogo'}><span>Catálogo de Treinamentos</span></Link>
            </li>
            <li className="mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-award"></i>
              <Link href={'../meuTreinamento'}><span>Meus Treinamentos</span></Link>
            </li>
            <li className=" d-flex align-items-center gap-2">
              <i className="bi bi-person"></i>
              <Link href={'../paginaPerfil'}><span>Meu Perfil</span></Link>
            </li>
          </ul>
        </aside>


        <main className="col-12 col-md-9 col-lg-10 bg-light p-0 d-flex flex-column min-vh-100">
          <div className="p-4 w-100 flex-grow-1">

            <div className="mb-4">
              <Link href="/catalogo" className="text-decoration-none text-dark fw-semibold d-flex align-items-center gap-2">
                <i className="bi bi-arrow-left"></i> Voltar ao Catálogo
              </Link>
            </div>

            {/* HERO SECTION */}
            <div className="rounded-4 p-4 p-lg-5 text-white mb-5 position-relative overflow-hidden shadow" style={{ backgroundColor: "#0a2b6b" }}>
              <div className="row align-items-center">
                <div className="col-lg-9">
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-warning text-dark rounded-pill">{curso.categoria}</span>
                    <span className="badge bg-light text-dark rounded-pill">{curso.nivel}</span>
                    <span className="badge border border-light rounded-pill">{curso.modalidade}</span>
                  </div>
                  <h1 className="fw-bold mb-3">{curso.titulo}</h1>
                  <p className="mb-4 text-light opacity-75">{curso.descricao}</p>
                  <div className="d-flex flex-wrap gap-4 text-light opacity-75 mb-4 text-sm">
                    <span><i className="bi bi-clock me-2"></i>{curso.duracao_horas}h</span>
                    <span><i className="bi bi-people me-2"></i>{curso.inscritos_atuais || 0} inscritos</span>
                    <span><i className="bi bi-calendar-event me-2"></i>Início: {new Date(curso.data_inicio).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {/* ÁREA DOS BOTÕES */}
                <div className="col-lg-3 d-flex flex-column align-items-lg-end justify-content-center gap-3">

                  {/* SÓ MOSTRA O BOTÃO DE INSCREVER SE A PESSOA NÃO ESTIVER INSCRITA */}
                  {!estaInscrito && (
                    <button
                      className="btn btn-primary fw-bold px-4 py-2 rounded-3 w-100"
                      style={{ backgroundColor: "#0d6efd" }}
                      onClick={handleInscrever}
                    >
                      <i className="bi bi-plus-circle fs-5 me-2"></i> Inscrever-se
                    </button>
                  )}

                  <button className="btn btn-outline-light px-4 py-2 rounded-3 w-100">
                    <i className="bi bi-download me-2"></i> Material
                  </button>
                </div>
              </div>

              {estaInscrito && (
                <div className="mt-4">
                  <div className="d-flex justify-content-between mb-1"><small>Seu Progresso</small><small>{progresso}%</small></div>
                  <div className="progress" style={{ height: "8px", backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <div className="progress-bar bg-white" style={{ width: `${progresso}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* MENU ABAS */}
            <div className="bg-light rounded-pill p-1 d-inline-flex mb-5 border">
              <div className="d-flex gap-1">
                <button className={`btn rounded-pill px-4 ${abaAtiva === 'visao-geral' ? 'bg-white text-dark fw-semibold shadow-sm' : 'text-muted fw-medium'}`} onClick={() => setAbaAtiva('visao-geral')}>Visão Geral</button>
                <button className={`btn rounded-pill px-4 ${abaAtiva === 'instrutor' ? 'bg-white text-dark fw-semibold shadow-sm' : 'text-muted fw-medium'}`} onClick={() => setAbaAtiva('instrutor')}>Instrutor</button>
              </div>
            </div>

            {/* GRID DINÂMICO */}
            <div className="row g-4 mb-4">
              <div className={abaAtiva === 'visao-geral' ? "col-lg-8" : "col-12"}>

                {abaAtiva === 'visao-geral' && (
                  <>
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                      <h5 className="fw-bold mb-3">Sobre o Curso</h5>
                      <p className="text-muted mb-0" style={{ lineHeight: "1.6" }}>
                        {curso.sobre || curso.descricao}
                      </p>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                      <h5 className="fw-bold mb-3">Objetivos</h5>
                      <p className="text-muted">{curso.objetivos || "Conteúdo detalhado indisponível."}</p>
                    </div>
                  </>
                )}

                {abaAtiva === 'instrutor' && (
                  <div className="card border-0 shadow-sm rounded-4 p-4 w-100">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center" style={{ width: 60, height: 60 }}>
                        {curso.instrutor_nome ? curso.instrutor_nome.substring(0, 2).toUpperCase() : "I"}
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">{curso.instrutor_nome}</h5>
                        <span className="text-muted">{curso.instrutor_email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {abaAtiva === 'visao-geral' && (
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold mb-3">Pré-requisitos</h5>
                    <p className="text-muted small">{curso.pre_requisitos || "Nenhum."}</p>
                  </div>
                  <div className="card border-0 shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Certificação</h5>
                    <p className="text-muted small">Certificado digital garantido.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}