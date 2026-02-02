"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./inscricoesAdmin.css";
import GerenciarInscricoes from "@/components/gerenciamentoInscricoes/cardGerenciaInscricoes";
import Link from "next/link";

export default function DashboardInscricoes() {
    return (
        <div className="container-fluid pagina-dashboardInscricoes">
            <div className="row g-0">

                <aside className="
                    d-none d-md-block
                    col-md-3 
                    col-lg-2 
                    bg-white 
                    border-end 
                    p-3 
                    sidebar
                ">
                    <ul className="list-unstyled menu w-100 d-flex flex-md-column flex-row justify-content-around">
                        <li className="ativo mb-md-3 d-flex align-items-center gap-2">
                            <i className="bi bi-house-door"></i>
                            <Link href="/dashboardAdmin"><span>Dashboard</span></Link>
                        </li>

                        <li className="mb-md-3 d-flex align-items-center gap-2">
                            <i className="bi bi-grid"></i>
                            <Link href="/gerenciar_Treinamento_admin">
                                <span>Gerenciar Treinamentos</span>
                            </Link>
                        </li>

                        <li className="d-flex align-items-center gap-2">
                            <i className="bi bi-person"></i>
                            <Link href="/colaboradorAdmin">
                                <span>Gerenciar Colaboradores</span>
                            </Link>
                        </li>
                    </ul>
                </aside>

                <main className="col-12 col-md-9 px-3 px-md-4 py-4">

                    <section className="introducao mb-4">
                        <div className="trocaPagina">
                            <ul className="nav nav-pills justify-content-center flex-wrap gap-2">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/dashboardAdmin">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" href="/inscricoesAdmin">Inscrições</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" href="/historicoAdmin">Histórico</Link>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <div className="container-fluid my-2">
                        <div className="row g-3">
                            <div className="col-12">
                                <GerenciarInscricoes />
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
