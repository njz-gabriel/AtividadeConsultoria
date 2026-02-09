"use client";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./gerenciar.css";
import Swal from "sweetalert2";
import Link from "next/link";
import { useState, useEffect } from "react";
import ModalNovoTreinamento from "@/components/modalNovoTreinamento/modalNovoTreinamento";


export default function GerenciadorTreinamento() {

    const [treinamentos, setTreinamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroModalidade, setFiltroModalidade] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [menuAberto, setMenuAberto] = useState(null);
    const [cursoParaEditar, setCursoParaEditar] = useState(null);

    const [estatisticas, setEstatisticas] = useState({
        total: 0,
        ativos: 0,
        inscritos: 0,
        taxaOcupacao: 0,
        porcentagemAtivos: 0
    });

    const treinamentosFiltrados = treinamentos.filter((item) => {
        // Filtro de Texto
        const termo = busca.toLowerCase();
        const tituloMatch = item.titulo?.toLowerCase().includes(termo);
        const instrutorMatch = item.instrutor_nome?.toLowerCase().includes(termo);
        const competenciaMatch = item.competencias?.some(comp => comp.toLowerCase().includes(termo));
        const matchTexto = tituloMatch || instrutorMatch || competenciaMatch;

        // Filtro de Status
        const matchStatus = filtroStatus ? item.status === filtroStatus : true;

        // Filtro de Modalidade
        const matchModalidade = filtroModalidade ? item.modalidade === filtroModalidade : true;

        return matchTexto && matchStatus && matchModalidade;
    });

    const handleNovoTreinamento = () => {
        setCursoParaEditar(null);
        setShowModal(true);
    };

    const handleEditar = (curso) => {
        setCursoParaEditar(curso);
        setShowModal(true);
        setMenuAberto(null);
    };

    const toggleMenu = (id) => {
        if (menuAberto === id) {
            setMenuAberto(null);
        } else {
            setMenuAberto(id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-acao')) {
                setMenuAberto(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    async function fetchTreinamentos() {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/treinamentos');
            const data = await res.json();

            if (data.sucesso) {
                const listaTreinos = data.dados;
                setTreinamentos(listaTreinos);

                const total = listaTreinos.length;
                const ativos = listaTreinos.filter(t => t.status === 'Ativo').length;
                const totalInscritos = listaTreinos.reduce((acc, curr) => acc + (curr.inscritos_atuais || 0), 0);
                const capacidadeTotal = listaTreinos.reduce((acc, curr) => acc + (curr.capacidade || 0), 0);
                const taxa = capacidadeTotal > 0 ? Math.round((totalInscritos / capacidadeTotal) * 100) : 0;
                const porcAtivos = total > 0 ? Math.round((ativos / total) * 100) : 0;

                setEstatisticas({
                    total: total,
                    ativos: ativos,
                    inscritos: totalInscritos,
                    taxaOcupacao: taxa,
                    porcentagemAtivos: porcAtivos
                });
            }
        } catch (error) {
            console.error("Erro ao buscar treinamentos:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleExcluir = async (id) => {
        const confirmacao = await Swal.fire({
            title: "Confirmar Exclusão",
            text: "Tem certeza que deseja excluir este treinamento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6"
        });

        if (!confirmacao.isConfirmed) return;

        try {
            const response = await fetch(`http://localhost:3001/api/treinamentos/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.sucesso) {
                Swal.fire({
                    icon: "success",
                    title: "Excluído!",
                    text: "Treinamento removido com sucesso."
                });

                fetchTreinamentos();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao excluir",
                    text: data.erro
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro de conexão",
                text: "Não foi possível conectar ao servidor."
            });
        }
    };


    useEffect(() => {
        fetchTreinamentos();
    }, []);

    const formatarData = (dataISO) => {
        if (!dataISO) return '-';
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const getStatusBadge = (status) => {
        if (status === 'Ativo') return 'bg-success-subtle text-success border-success-subtle';
        if (status === 'Rascunho') return 'bg-secondary-subtle text-secondary border-secondary-subtle';
        return 'bg-light text-dark border';
    };

    return (
        <div className="container-fluid pagina-usuario">

            {showModal && (
                <ModalNovoTreinamento
                    onClose={() => setShowModal(false)}
                    onSalvar={fetchTreinamentos}
                    dadosEditar={cursoParaEditar}
                />
            )}

            <div className="row flex-nowrap">
                <aside className="d-none d-md-flex col-md-3 col-lg-2 bg-white border-end p-3 sidebar" style={{ minHeight: '100vh' }}>
                    <ul className="list-unstyled menu">
                        <li className=" mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-house-door"></i>
                            <Link href={'dashboardAdmin'}><span>Dashboard</span></Link>
                        </li>
                        <li className=" ativo mb-3 d-flex align-items-center gap-2">
                            <i className="bi bi-grid"></i>
                            <Link href={'gerenciar_Treinamento_admin'}><span>Gerenciar Treinamentos</span></Link>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                            <i className="bi bi-person"></i>
                            <Link href={'colaboradorAdmin'}><span>Gerenciar Colaboradores</span></Link>
                        </li>
                    </ul>
                </aside>

                <main className="col-12 col-md-9 col-lg-10 p-4 bg-light">

                    {/* Bloco de Título e Botão Responsivo */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                        <div>
                            <h2 className="h4 fw-bold mb-1" style={{ color: "#0a2b6b" }}>Gerenciar Treinamentos</h2>
                            <p className="descricao text-muted mb-0">
                                Administre todos os treinamentos da plataforma
                            </p>
                        </div>

                        <button
                            className="btn btn-primary btn-novo-treinamento"
                            onClick={() => {
                                setCursoParaEditar(null);
                                setShowModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg"></i> Novo Treinamento
                        </button>
                    </div>

                    <div className="row g-3">
                        <div className="col-12">
                            <div className="row justify-content-start g-3">

                                {/* Card Total */}
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="card h-100 border rounded-4 bg-white shadow-sm">
                                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                                            <span className="text-muted mb-2">Total de Treinamentos</span>
                                            <h2 className="fw-bold mb-2" style={{ color: "#0a2b6b" }}>
                                                {estatisticas.total}
                                            </h2>
                                            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                Cursos cadastrados
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Ativos */}
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="card h-100 border rounded-4 bg-white shadow-sm">
                                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                                            <span className="text-muted mb-2">Treinamentos Ativos</span>
                                            <h2 className="fw-bold mb-2" style={{ color: "#0a2b6b" }}>
                                                {estatisticas.ativos}
                                            </h2>
                                            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                {estatisticas.porcentagemAtivos}% do total
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Taxa de Ocupação */}
                                <div className="col-12 col-md-6 col-lg-4">
                                    <div className="card h-100 border rounded-4 bg-white shadow-sm">
                                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                                            <span className="text-muted mb-2">Taxa de Ocupação</span>
                                            <h2 className="fw-bold mb-2" style={{ color: "#0a2b6b" }}>
                                                {estatisticas.taxaOcupacao}%
                                            </h2>
                                            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                Média geral
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-4 mt-4">
                        <div className="col-12">

                            <div className="card1 border rounded-4 bg-white shadow-sm p-4">

                                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 w-100">

                                    {/* Barra de Busca */}
                                    <div
                                        className="d-flex align-items-center px-3 py-2 rounded-3 flex-grow-1"
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    >
                                        <i className="bi bi-search text-muted me-2"></i>
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-transparent shadow-none p-0 text-dark"
                                            placeholder="Buscar por título, instrutor ou competência..."
                                            style={{ fontSize: "0.95rem" }}
                                            value={busca}
                                            onChange={(e) => setBusca(e.target.value)}
                                        />
                                    </div>

                                    {/* Botão Filtros */}
                                    <button
                                        className={`btn d-flex align-items-center gap-2 rounded-3 px-3 fw-medium text-nowrap ${mostrarFiltros ? 'btn-primary' : 'btn-light border'}`}
                                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                        style={mostrarFiltros ? { backgroundColor: "#0a2b6b", borderColor: "#0a2b6b" } : {}}
                                    >
                                        <i className={`bi ${mostrarFiltros ? 'bi-funnel-fill' : 'bi-funnel'}`}></i>
                                        Filtros
                                    </button>
                                </div>

                                {/* LINHA INFERIOR: ÁREA DOS FILTROS */}
                                {mostrarFiltros && (
                                    <div className="mt-4 pt-3 border-top animate__animated animate__fadeIn">
                                        <div className="row g-3">

                                            <div className="col-12 col-md-4">
                                                <label className="form-label small fw-bold text-muted mb-1 ms-1">Status</label>
                                                <select
                                                    className="form-select"
                                                    value={filtroStatus}
                                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                                >
                                                    <option value="">Todos os Status</option>
                                                    <option value="Ativo">Ativo</option>
                                                    <option value="Rascunho">Rascunho</option>
                                                </select>
                                            </div>

                                            <div className="col-12 col-md-4">
                                                <label className="form-label small fw-bold text-muted mb-1 ms-1">Modalidade</label>
                                                <select
                                                    className="form-select"
                                                    value={filtroModalidade}
                                                    onChange={(e) => setFiltroModalidade(e.target.value)}
                                                >
                                                    <option value="">Todas as Modalidades</option>
                                                    <option value="Online">Online</option>
                                                    <option value="Presencial">Presencial</option>
                                                    <option value="Híbrido">Híbrido</option>
                                                </select>
                                            </div>

                                            <div className="col-12 col-md-4 d-flex align-items-end">
                                                <button
                                                    className="btn btn-outline-danger w-100"
                                                    onClick={() => {
                                                        setFiltroStatus('');
                                                        setFiltroModalidade('');
                                                        setBusca('');
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle me-2"></i>
                                                    Limpar Filtros
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mt-3">
                        <div className="col-12">
                            <div className="card1 border rounded-4 bg-white shadow-sm">
                                <div className="card-body p-4">

                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-1">Todos os Treinamentos</h5>
                                        <p className="text-muted small mb-0">
                                            {treinamentosFiltrados.length} treinamentos cadastrados
                                        </p>
                                    </div>

                                    <div className="table-responsive d-none d-md-block">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="border-0 text-muted small fw-semibold ps-3">Título</th>
                                                    <th className="border-0 text-muted small fw-semibold">Modalidade</th>
                                                    <th className="border-0 text-muted small fw-semibold">Status</th>
                                                    <th className="border-0 text-muted small fw-semibold">Instrutor</th>
                                                    <th className="border-0 text-muted small fw-semibold">Competências</th>
                                                    <th className="border-0 text-muted small fw-semibold">Início</th>
                                                    <th className="border-0 text-muted small fw-semibold text-end pe-3">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>


                                                {loading ? (
                                                    <tr><td colSpan="8" className="text-center py-4">Carregando...</td></tr>
                                                ) : (
                                                    treinamentosFiltrados.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="ps-3 py-3">
                                                                <span className="fw-medium" style={{ color: '#0a2b6b' }}>{item.titulo}</span>
                                                            </td>
                                                            <td className="text-muted">{item.modalidade}</td>
                                                            <td>
                                                                <span className={`badge rounded-pill border px-3 ${getStatusBadge(item.status)}`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="text-muted">{item.instrutor_nome}</td>
                                                            <td>
                                                                <div className="d-flex gap-1 flex-wrap">
                                                                    {item.competencias.map((comp, idx) => (
                                                                        <span key={idx} className="badge bg-light text-dark border fw-normal">{comp}</span>
                                                                    ))}
                                                                </div>
                                                            </td>

                                                            <td className="text-muted">{formatarData(item.data_inicio)}</td>


                                                            <td className="text-end pe-3 position-relative dropdown-acao">
                                                                <i
                                                                    className="bi bi-three-dots-vertical text-muted p-2"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleMenu(item.id);
                                                                    }}
                                                                ></i>


                                                                {menuAberto === item.id && (
                                                                    <div className="dropdown-menu show shadow border-0"
                                                                        style={{
                                                                            position: 'absolute',
                                                                            right: '100%',
                                                                            top: '10px',
                                                                            zIndex: 1050,
                                                                            minWidth: '180px'
                                                                        }}>
                                                                        <div className="px-3 py-2 border-bottom">
                                                                            <span className="small text-muted fw-bold">Ações</span>
                                                                        </div>
                                                                        <button
                                                                            className="dropdown-item py-2 d-flex align-items-center gap-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditar(item);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-pencil"></i> Editar
                                                                        </button>
                                                                        <div className="dropdown-divider my-1"></div>
                                                                        <button
                                                                            className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleExcluir(item.id);
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-trash"></i> Excluir
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-md-none d-flex flex-column gap-3">
                        {loading ? (
                            <div className="text-center py-4">Carregando...</div>
                        ) : (
                            treinamentosFiltrados.map((item) => (
                                <div key={item.id} className="card border rounded-4 shadow-sm p-3">

                                    {/* Cabeçalho do Card */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h6 className="fw-bold mb-1" style={{ color: '#0a2b6b' }}>{item.titulo}</h6>
                                            <span className={`badge rounded-pill border px-3 ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        {/* Menu de Ações Mobile */}
                                        <div className="position-relative dropdown-acao">
                                            <i
                                                className="bi bi-three-dots-vertical text-muted fs-5 p-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMenu(item.id);
                                                }}
                                            ></i>
                                            {menuAberto === item.id && (
                                                <div className="dropdown-menu show shadow border-0 end-0"
                                                    style={{ position: 'absolute', top: '30px', zIndex: 1050 }}>
                                                    <button className="dropdown-item gap-2 d-flex align-items-center" onClick={() => handleEditar(item)}>
                                                        <i className="bi bi-pencil"></i> Editar
                                                    </button>
                                                    <button className="dropdown-item gap-2 d-flex align-items-center text-danger" onClick={() => handleExcluir(item.id)}>
                                                        <i className="bi bi-trash"></i> Excluir
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detalhes do Card */}
                                    <div className="d-flex flex-column gap-2 mb-3">
                                        <div className="d-flex align-items-center text-muted small">
                                            <i className="bi bi-person-video3 me-2" style={{ width: '20px' }}></i>
                                            <span className="fw-semibold me-1">Instrutor:</span> {item.instrutor_nome}
                                        </div>
                                        <div className="d-flex align-items-center text-muted small">
                                            <i className="bi bi-laptop me-2" style={{ width: '20px' }}></i>
                                            <span className="fw-semibold me-1">Modalidade:</span> {item.modalidade}
                                        </div>
                                        <div className="d-flex align-items-center text-muted small">
                                            <i className="bi bi-calendar-event me-2" style={{ width: '20px' }}></i>
                                            <span className="fw-semibold me-1">Início:</span> {formatarData(item.data_inicio)}
                                        </div>
                                        <div className="d-flex align-items-center text-muted small">
                                            <i className="bi bi-people me-2" style={{ width: '20px' }}></i>
                                            <span className="fw-semibold me-1">Vagas:</span> {item.inscritos_atuais}/{item.capacidade}
                                        </div>
                                    </div>

                                    {/* Competências (Tags) */}
                                    {item.competencias && item.competencias.length > 0 && (
                                        <div className="d-flex flex-wrap gap-1 mt-auto pt-2 border-top">
                                            {item.competencias.map((comp, idx) => (
                                                <span key={idx} className="badge bg-light text-dark border fw-normal" style={{ fontSize: '0.75rem' }}>
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
