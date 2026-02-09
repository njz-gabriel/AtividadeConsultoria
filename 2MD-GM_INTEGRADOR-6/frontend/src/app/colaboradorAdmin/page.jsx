"use client";

import { useState } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import TabelaColaboradores from "../../components/colaboradoresTabela/colaboradoresTabela";
import "./colaborador.css";
import Swal from "sweetalert2";

export default function PaginaColaboradores() {
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: "", email: "", senha: "", cargo: "", departamento: "", unidade: "", nivelAcesso: "Colaborador"
  });

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({ nome: "", email: "", senha: "", cargo: "", departamento: "", unidade: "", nivelAcesso: "Colaborador" });
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      cargo: usuario.cargo || "",
      departamento: usuario.departamento || "",
      unidade: usuario.unidade || "",
      nivelAcesso: usuario.nivel_acesso || "Colaborador"
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ============================
  // 🔥 SUBSTITUINDO CONFIRM + ALERT POR SWEETALERT
  // ============================
  const handleDelete = async (id) => {
    const resultado = await Swal.fire({
      title: "Tem certeza?",
      text: "Você está prestes a excluir este colaborador.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await Swal.fire({
          title: "Excluído!",
          text: "O colaborador foi removido com sucesso.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        window.location.reload();
      } else {
        Swal.fire({
          title: "Erro",
          text: "Erro ao excluir.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erro de conexão",
        text: "Não foi possível se conectar ao servidor.",
        icon: "error"
      });
    }
  };

  // ============================
  // 🔥 SUBSTITUINDO TODOS OS ALERTS DO SALVAR
  // ============================
  const handleSave = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:3001/api/usuarios/${editingId}`
      : "http://localhost:3001/api/usuarios";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: "Sucesso!",
          text: editingId ? "Dados atualizados!" : "Colaborador cadastrado!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        handleCloseModal();
        window.location.reload();
      } else {
        Swal.fire({
          title: "Erro",
          text: data.mensagem || "Erro ao salvar.",
          icon: "error"
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Erro de conexão",
        text: "Não foi possível se conectar ao servidor.",
        icon: "error"
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <style>{`
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1050; display: flex; align-items: center; justify-content: center; }
        .custom-modal { background: white; width: 95%; max-width: 1100px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 1051; display: flex; flex-direction: column; max-height: 90vh; animation: fadeIn 0.3s ease; }
        .modal-body-scroll { overflow-y: auto; padding: 20px; flex: 1; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="container-fluid pagina-usuario">
        <div className="row g-0">

          <aside className="col-12 col-md-3 col-lg-2 bg-white border-end p-3 sidebar" style={{ minHeight: '100vh' }}>
            <ul className="list-unstyled menu sticky-top">
              <li className="mb-3 d-flex align-items-center gap-2"><i className="bi bi-house-door"></i><Link href={'dashboardAdmin'}><span>Dashboard</span></Link></li>
              <li className="mb-3 d-flex align-items-center gap-2"><i className="bi bi-grid"></i><Link href={'gerenciar_Treinamento_admin'}><span>Gerenciar Treinamentos</span></Link></li>
              <li className="ativo d-flex align-items-center gap-2"><i className="bi bi-person"></i><span>Gerenciar Colaboradores</span></li>
            </ul>
          </aside>

          <main className="col-12 col-md-9 px-4 py-4 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h4 fw-bold mb-1" style={{ color: "#0a2b6b" }}>Gerenciar Colaboradores</h2>
                <p className="descricao text-muted mb-0">Administre os colaboradores e suas permissões</p>
              </div>
              <button className="btn text-white d-flex align-items-center gap-2 px-4 py-2 fw-semibold shadow-sm"
                style={{ backgroundColor: "#0a2b6b" }}
                onClick={handleOpenModal}>
                <i className="bi bi-person-plus fs-5"></i> Novo Colaborador
              </button>
            </div>

            <div className="row g-3 cards-wrapper mb-4">
            </div>

            <div className="table-responsive">
              <TabelaColaboradores
                onNovoColaborador={handleOpenModal}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>


          </main>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="modal-title fw-bold" style={{ color: "#0a2b6b" }}>
                {editingId ? "Editar Colaborador" : "Cadastrar Novo Colaborador"}
              </h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>

            <div className="modal-body-scroll">
              <form className="row g-3">

                <h6 className="fw-bold mt-2">🧍 Informações Pessoais</h6>
                <hr />

                <div className="col-md-12">
                  <label className="form-label fw-semibold">Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <h6 className="fw-bold mt-3">📧 Acesso</h6>
                <hr />

                <div className="col-md-6">
                  <label className="form-label fw-semibold">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    {editingId ? "Nova Senha (Opcional)" : "Senha Inicial *"}
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={editingId ? "Deixe em branco para manter" : ""}
                  />
                </div>

                <h6 className="fw-bold mt-3">🏢 Profissional</h6>
                <hr />

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Cargo</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Departamento</label>
                  <select
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Selecione...</option>
                    <option>Engenharia</option>
                    <option>RH</option>
                    <option>TI</option>
                    <option>Vendas</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Unidade</label>
                  <select
                    name="unidade"
                    value={formData.unidade}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Selecione...</option>
                    <option>São Caetano do Sul</option>
                    <option>São José dos Campos</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Perfil</label>
                  <select
                    name="nivelAcesso"
                    value={formData.nivelAcesso}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Colaborador">Colaborador</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>

              </form>
            </div>

            <div className="modal-footer bg-light p-3 rounded-bottom">
              <button className="btn btn-secondary px-4" onClick={handleCloseModal}>
                Cancelar
              </button>

              <button
                className="btn btn-primary px-4"
                onClick={handleSave}
                style={{ backgroundColor: "#0a2b6b", borderColor: "#0a2b6b" }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}