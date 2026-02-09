"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./dashboardAdmin.css";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardAdmin() {
    const [taxaConclusao, setTaxaConclusao] = useState(0);

    const [ativos, setAtivos] = useState(0);

    useEffect(() => {
        async function carregarAtivos() {
            try {
                const response = await fetch("http://localhost:3001/api/treinamentos/ativos/count");
                const data = await response.json();
                setAtivos(data.totalAtivos);
            } catch (error) {
                console.log("Erro ao carregar ativos:", error);
            }
        }

        carregarAtivos();
    }, []);

    useEffect(() => {
        async function calcularTaxaGlobal() {
            try {
                const res = await fetch("http://localhost:3001/api/inscricoes");
                const data = await res.json();

                const listaInscricoes = Array.isArray(data) ? data : (data.dados || []);

                if (listaInscricoes.length > 0) {
                    const total = listaInscricoes.length;

                    const concluidos = listaInscricoes.filter(item => {
                        const statusTexto = item.status ? item.status.toLowerCase().trim() : '';
                        const statusOk = ['concluído', 'concluido', 'finalizado', 'completed'].includes(statusTexto);

                        const temData = item.data_conclusao !== null && item.data_conclusao !== undefined;

                        const progressoOk = item.progresso == 100;

                        return statusOk || temData || progressoOk;
                    }).length;

                    console.log(`[Dashboard] Total: ${total}, Concluídos: ${concluidos}`);

                    const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;
                    setTaxaConclusao(porcentagem);
                } else {
                    setTaxaConclusao(0);
                }
            } catch (error) {
                console.log("Erro ao calcular taxa de conclusão:", error);
            }
        }

        calcularTaxaGlobal();
    }, []);

    const [totalColaboradores, setTotalColaboradores] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("http://localhost:3001/api/colaboradores/count");
                const data = await res.json();
                setTotalColaboradores(data.total);
            } catch (error) {
                console.log("Erro ao buscar total de colaboradores:", error);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="container-fluid pagina-usuario">
            <div className="row g-0">

                <aside className="d-none d-md-block col-md-3 col-lg-2 bg-white border-end p-3 menu-lateral">
                    <ul className="list-unstyled menu">
                        <li className="ativo mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-house-door"></i>
                            <Link href="/dashboardAdmin"><span>Dashboard</span></Link>
                        </li>
                        <li className="mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-grid"></i>
                            <Link href="/gerenciar_Treinamento_admin"><span>Gerenciar Treinamentos</span></Link>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <i className="bi bi-person"></i>
                            <Link href="/colaboradorAdmin"><span>Gerenciar Colaboradores</span></Link>
                        </li>
                    </ul>
                </aside>

                {/* CONTEÚDO PRINCIPAL */}
                <main className="col-12 col-md-9 col-lg-10 px-4 py-4">

                    {/* BARRA SUPERIOR */}
                    <section className="introducao mb-4">
                        <div className="trocaPagina">
                            <ul className="nav nav-pills nav-fill">
                                <li className="nav-item">
                                    <Link className="nav-link active" href={'dashboardAdmin'}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={'inscricoesAdmin'} className="nav-link">Inscrições</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={'historicoAdmin'} className="nav-link ">Histórico</Link>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* CARDS INICIAIS */}
                    <div className="row g-3 row-cards mt-3">

                        <div className="col-12 col-md-6">
                            <div className="card-info azul">
                                <div>
                                    <p className="titulo">Treinamentos Ativos</p>
                                    <p className="valor">{ativos}</p>
                                </div>
                                <div className="icon"><i className="bi bi-bar-chart"></i></div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="card-info laranja">
                                <div>
                                    <p className="titulo">Colaboradores Inscritos</p>
                                    <p className="valor">{totalColaboradores}</p>

                                </div>
                                <div className="icon"><i className="bi bi-people"></i></div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="card-info roxo">
                                <div>
                                    <p className="titulo">Taxa de Conclusão</p>
                                    <p className="valor">{taxaConclusao}%</p>
                                </div>
                                <div className="icon"><i className="bi bi-graph-up-arrow"></i></div>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE CURSOS */}
                    <div className="card-treinamento mt-4">
                        <div className="Cards">
                            <p className="titulo-principal">Próximos Treinamentos</p>
                            <p className="subtitulo-trilha">Agendados para as próximas semanas</p>

                            <div className="row lista-cursos g-3">

                                <div className="curso-item col-12">
                                    <div className="curso-esquerda">
                                        <div className="icon-curso-quadro">
                                            <i className="bi bi-calendar-event"></i>
                                        </div>

                                        <div className="curso-info">
                                            <p className="nome-curso">Workshop: Cultura de Segurança</p>
                                            <div className="detalhes-curso">
                                                <span className="duracao">15/11/2025</span>
                                                <span className="nivel">• Instrutor: Carlos Mendes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="curso-item col-12">
                                    <div className="curso-esquerda">
                                        <div className="icon-curso-quadro">
                                            <i className="bi bi-calendar-event"></i>
                                        </div>

                                        <div className="curso-info">
                                            <p className="nome-curso">Lean Manufacturing</p>
                                            <div className="detalhes-curso">
                                                <span className="duracao">20/11/2025</span>
                                                <span className="nivel">• Instrutor: Ana Paula</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="curso-item col-12">
                                    <div className="curso-esquerda">
                                        <div className="icon-curso-quadro">
                                            <i className="bi bi-calendar-event"></i>
                                        </div>

                                        <div className="curso-info">
                                            <p className="nome-curso">Gestão de Qualidade Total</p>
                                            <div className="detalhes-curso">
                                                <span className="duracao">25/11/2025</span>
                                                <span className="nivel">• Instrutor: Roberto Silva</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="curso-item col-12">
                                    <div className="curso-esquerda">
                                        <div className="icon-curso-quadro">
                                            <i className="bi bi-calendar-event"></i>
                                        </div>

                                        <div className="curso-info">
                                            <p className="nome-curso">Liderança 4.0</p>
                                            <div className="detalhes-curso">
                                                <span className="duracao">01/12/2025</span>
                                                <span className="nivel">• Instrutor: Maria Santos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </div >
    );
}
