"use client";


import { useEffect, useState } from "react";
import "../colaboradoresTabela/colaboradorTabela.css";




export default function ColaboradoresTabela({ onNovoColaborador, onEdit, onDelete }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  const getIniciais = (nome) => {
    if (!nome) return "U";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };


  const carregarDados = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/usuarios");
      const data = await response.json();
      if (response.ok) setColaboradores(data.usuarios || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    carregarDados();
  }, []);


  const colaboradoresFiltrados = colaboradores.filter((c) => {
    const termo = searchTerm.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(termo) ||
      c.email?.toLowerCase().includes(termo) ||
      c.cargo?.toLowerCase().includes(termo) ||
      c.departamento?.toLowerCase().includes(termo) ||
      c.unidade?.toLowerCase().includes(termo)
    );
  });


  return (
    <div className="tabela-container shadow-sm bg-white rounded-3 border mt-4">


      {/* HEADER RESPONSIVO */}
      <div className="header-lista p-4 border-bottom d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <div className="header-info">
          <h5 className="fw-semibold mb-1" style={{ color: "#0a2b6b" }}>
            <i className="bi bi-people me-2"></i> Lista de Colaboradores
          </h5>
          <p className="text-muted small mb-0">Gerencie cadastros, permissões e histórico</p>
        </div>


        <div className="input-busca">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {/* TABELA RESPONSIVA */}
      <div className="table-responsive">
        <table className="table tabela-colaboradores table-hover align-middle mb-0">
          <thead className="table-light d-none d-md-table-header-group">
            <tr>
              <th className="ps-4">Colaborador</th>
              <th className="ps-5">Departamento</th>
              <th>Cargo</th>
              <th>Unidade</th>
              <th>Acesso</th>
              <th className="text-end pe-4">Ações</th>
            </tr>
          </thead>


          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  Carregando...
                </td>
              </tr>
            ) : colaboradoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              colaboradoresFiltrados.map((c) => (
                <tr key={c.id} className="linha-responsiva">
                  {/* COLABORADOR */}
                  <td className="ps-4">
                    <div className="d-flex align-items-center">
                      <div
                        className="avatar-colaborador"
                      >
                        {getIniciais(c.nome)}
                      </div>


                      <div className="ms-3">
                        <strong className="text-dark d-block mb-0 nome-col">
                          {c.nome}
                        </strong>
                        <span className="text-muted small">{c.email}</span>
                      </div>
                    </div>
                  </td>


                  {/* Departamento */}
                  <td data-label="Departamento" className="ps-5">
                    <span className="badge bg-light text-dark border">
                      {c.departamento}
                    </span>
                  </td>


                  {/* Cargo */}
                  <td data-label="Cargo">{c.cargo}</td>


                  {/* Unidade */}
                  <td data-label="Unidade">{c.unidade}</td>


                  {/* Nível de Acesso */}
                  <td data-label="Acesso">
                    <span className="badge bg-light text-dark border">{c.nivel_acesso}</span>
                  </td>


                  {/* AÇÕES */}
                  <td className="text-end pe-4" data-label="Ações">
                    <button
                      className="btn btn-sm btn-light rounded-circle text-primary me-1"
                      onClick={() => onEdit(c)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>


                    <button
                      className="btn btn-sm btn-light rounded-circle text-danger"
                      onClick={() => onDelete(c.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>


        </table>
      </div>


    </div>
  );
}



