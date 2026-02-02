"use client";

import React, { useState, useEffect } from "react";
import "./cardGerenciarInscricoes.css";
import Swal from 'sweetalert2';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function GerenciarInscricoes() {
    const [inscricoes, setInscricoes] = useState([]);
    const [termoBusca, setTermoBusca] = useState("");

    async function carregarInscricoes() {
        const response = await fetch("http://localhost:3001/api/inscricoes");
        const data = await response.json();
        console.log("INSCRIÇÕES:", data);

        if (Array.isArray(data)) {
            setInscricoes(data);
        } else {
            setInscricoes(data.dados || []);
        }
    }

    async function remover(id) {
        const resultado = await Swal.fire({
            title: "Tem certeza?",
            text: "Você está prestes a excluir esta inscrição.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar"
        });

        if (!resultado.isConfirmed) return;

        await fetch(`http://localhost:3001/api/inscricoes/${id}`, {
            method: "DELETE",
        });

        Swal.fire({
            title: "Removido!",
            text: "A inscrição foi excluída com sucesso.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        carregarInscricoes();
    }

    useEffect(() => {
        carregarInscricoes();
    }, []);

    const inscricoesFiltradas = inscricoes.filter((item) => {
        const texto = termoBusca.toLowerCase();
        return (
            (item.usuario && item.usuario.toLowerCase().includes(texto)) ||
            (item.treinamento && item.treinamento.toLowerCase().includes(texto))
        );
    });

    return (
        <div className="inscricoes-card-container">
            <header className="inscricoes-header">
                <div>
                    <h2>Gerenciar Inscrições</h2>
                    <p>Visualize e gerencie as inscrições dos colaboradores</p>
                </div>
            </header>

            <div className="search-bar-inscricoes">
                <i className="bi bi-search"></i>
                <input 
                    type="text" 
                    placeholder="Buscar inscrições..." 
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
            </div>

            <div className="inscricoes-table">
                <div className="table-header">
                    <span>Colaborador</span>
                    <span>Curso</span>
                    <span>Data de Inscrição</span>
                    <span>Ações</span>
                </div>

                {inscricoesFiltradas.length > 0 ? (
                    inscricoesFiltradas.map((item) => (
                        <div className="table-row" key={item.id}>
                            <span className="colaborador-nome">{item.usuario}</span>
                            <span>{item.treinamento}</span>
                            <span>
                                {new Date(item.data_inscricao).toLocaleDateString("pt-BR")}
                            </span>
                            
                            {/* Coluna STATUS removida aqui */}

                            <span className="acoes-cell">
                                <button
                                    className="btn-acao-remover"
                                    onClick={() => remover(item.id)}
                                >
                                    <i className="bi bi-x-circle-fill"></i>
                                </button>
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-muted">
                        Nenhuma inscrição encontrada para "{termoBusca}"
                    </div>
                )}
            </div>
        </div>
    );
}
