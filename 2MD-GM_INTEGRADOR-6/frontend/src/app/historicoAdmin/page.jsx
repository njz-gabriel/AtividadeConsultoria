"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./historicoAdmin.css";
import Link from "next/link";
import GerenciarHistorico from "@/components/gerenciamentoHistorico/cardGerenciaHistorico";

export default function DashboardHistorico() {
    return (
        <div className="container-fluid pagina-usuario">
            <div className="row g-0">

                {/* SIDEBAR */}
                <aside className="
                    d-none d-md-block
                    col-md-3 
                    col-lg-2 
                    bg-white 
                    border-end 
                    p-3 
                    sidebar
                ">
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
                <main className="col-12 col-md-9 col-lg-10 px-4 py-4 conteudo">

                    {/* NAV DE TROCA DE PÁGINA */}
                    <section className="introducao mb-4">
                        <div className="trocaPagina">
                            <ul className="nav nav-pills nav-fill">
                                <li className="nav-item">
                                    <Link className="nav-link" href={'dashboardAdmin'}>Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={'inscricoesAdmin'} className="nav-link">Inscrições</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={'historicoAdmin'} className="nav-link active">Histórico</Link>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* CONTEÚDO */}
                    <div className="container-fluid my-2">
                        <div className="row g-3">
                            <div className="col-12">
                                <GerenciarHistorico />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
