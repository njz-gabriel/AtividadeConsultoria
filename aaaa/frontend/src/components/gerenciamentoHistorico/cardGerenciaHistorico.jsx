"use client";

import React, { useEffect, useState } from "react";
import "./cardGerenciaHistorico.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const HistoricoItem = ({ item }) => (
    <div className="atividade-item">
        <div className="atividade-content">
            <div className="atividade-icon">
                <i className="bi bi-file-earmark-text"></i>
            </div>
            <div className="atividade-info">
                <h3>{item.acao}</h3>
                <p>{item.descricao}</p>
                <p className="small-text texto-menor">
                    Usuário: {item.usuario || "Sistema"}
                </p>
            </div>
        </div>
        <span className="atividade-detalhe">
            {new Date(item.datahora).toLocaleString("pt-BR")}
        </span>
    </div>
);

export default function GerenciarHistorico() {

    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        async function carregarHistorico() {
            try {
                const res = await fetch("http://localhost:3001/historico");
                const dados = await res.json();

                console.log("RESPOSTA DA API:", dados);

                if (dados.sucesso && Array.isArray(dados.dados)) {
                    setHistorico(dados.dados);
                } else {
                    console.warn("Formato inesperado da API:", dados);
                }

            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            }
        }

        carregarHistorico();
    }, []);

    return (
        <div className="historico-card-container">
            <header className="historico-header">
                <div>
                    <h2>Histórico de Atividades</h2>
                    <p>Visualize o histórico completo de ações no sistema</p>
                </div>
            </header>

            <div className="historico-lista">
                {historico.length > 0 ? (
                    historico.map((item) => (
                        <HistoricoItem key={item.id} item={item} />
                    ))
                ) : (
                    <p className="text-center mt-3">Nenhum registro encontrado...</p>
                )}
            </div>
        </div>
    );
}
