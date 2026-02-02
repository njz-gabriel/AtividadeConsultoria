"use client";
import { useState, useEffect } from 'react';

export default function ModalNovoTreinamento({ onClose, onSalvar, dadosEditar }) {

    // Estado inicial limpo
    const formInicial = {
        titulo: '',
        categoria: '',
        status: 'Ativo',
        descricao: '',
        nivel: '',
        duracao: '',
        capacidade: '',
        instrutorId: '',
        instrutorNome: '',
        instrutorEmail: '',
        modalidade: 'Online',
        local: '',
        dataInicio: '',
        dataFim: '',
        competenciasTexto: '',
        sobre: '',
        objetivos: '',
        preRequisitos: ''
    };

    const [form, setForm] = useState(formInicial);

    const [listaInstrutores, setListaInstrutores] = useState([]);

    // 1. Busca lista de instrutores ao abrir o modal
    useEffect(() => {
        async function fetchInstrutores() {
            try {
                const res = await fetch('http://localhost:3001/api/treinamentos/instrutores');
                const data = await res.json();
                if (data.sucesso) setListaInstrutores(data.dados);
            } catch (error) {
                console.error("Erro ao buscar instrutores", error);
            }
        }
        fetchInstrutores();
    }, []);

    // EFEITO: Preenche o formulário se vier dados para editar
    useEffect(() => {
        if (dadosEditar) {
            setForm({
                titulo: dadosEditar.titulo,
                categoria: dadosEditar.categoria,
                status: dadosEditar.status,
                descricao: dadosEditar.descricao,
                nivel: dadosEditar.nivel,

                // Mapeando nomes do Banco (snake_case) para o Form (camelCase)
                duracao: dadosEditar.duracao_horas,
                capacidade: dadosEditar.capacidade,
                instrutorId: dadosEditar.instrutor_id,
                modalidade: dadosEditar.modalidade,
                local: dadosEditar.local_plataforma,

                // Formatando datas (remove a parte da hora T00:00:00)
                dataInicio: dadosEditar.data_inicio ? dadosEditar.data_inicio.split('T')[0] : '',
                dataFim: dadosEditar.data_fim ? dadosEditar.data_fim.split('T')[0] : '',

                // Transformando Array de competencias em String para o input
                competenciasTexto: dadosEditar.competencias ? dadosEditar.competencias.join(', ') : '',
                sobre: dadosEditar.sobre || '',
                objetivos: dadosEditar.objetivos || '',
                preRequisitos: dadosEditar.pre_requisitos || ''
            });
        }
    }, [dadosEditar]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Se tem dadosEditar, usa a URL com ID e método PUT. Se não, POST normal.
    const url = dadosEditar
        ? `http://localhost:3001/api/treinamentos/${dadosEditar.id}`
        : 'http://localhost:3001/api/treinamentos';

    const method = dadosEditar ? 'PUT' : 'POST';

    // 1. Cria o objeto de dados (Payload) DENTRO da função
    const payload = {
        ...form,
        duracao: form.duracao === '' ? 0 : Number(form.duracao), // Garante 0 se vazio
        capacidade: form.capacidade === '' ? 0 : Number(form.capacidade), // Garante 0 se vazio
        instrutorId: form.instrutorId ? Number(form.instrutorId) : null // Garante null se vazio
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) // <--- O PULO DO GATO: Enviando o JSON aqui
        });

        if (response.ok) {
            onSalvar(); // Atualiza a tabela
            onClose();  // Fecha o modal
        } else {
            alert('Erro ao salvar');
        }
    } catch (error) {
        console.error(error);
    }
};

    const payload = {
        ...form,
        duracao: form.duracao === '' ? null : Number(form.duracao),
        capacidade: form.capacidade === '' ? null : Number(form.capacidade),
        instrutorId: Number(form.instrutorId)
    };

    body: JSON.stringify(payload)

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content rounded-4 border-0">
                    <div className="modal-header border-bottom-0 pb-0">
                        <div>
                            <h5 className="modal-title fw-bold" style={{ color: '#0a2b6b' }}>
                                {dadosEditar ? 'Editar Curso' : 'Adicionar Novo Curso'}
                            </h5>
                            <p className="text-muted small">Preencha os detalhes completos do curso</p>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>

                            {/* 1. Informações Básicas */}
                            <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-book me-2"></i>Informações Básicas</h6>
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small">Título do Curso *</label>
                                    <input type="text" name="titulo" className="form-control bg-light border-0" required value={form.titulo} onChange={handleChange} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small">Categoria</label>
                                    <select name="categoria" className="form-select bg-light border-0" value={form.categoria} onChange={handleChange}>
                                        <option value="">Selecione...</option>
                                        <option value="Gestão">Gestão</option>
                                        <option value="Tecnologia">Tecnologia</option>
                                        <option value="Processos">Processos</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small">Status</label>
                                    <select name="status" className="form-select border-0 fw-medium" style={{ backgroundColor: form.status === 'Ativo' ? '#d1e7dd' : '#e2e3e5', color: form.status === 'Ativo' ? '#0f5132' : '#41464b' }} value={form.status} onChange={handleChange}>
                                        <option value="Ativo">Ativo</option>
                                        <option value="Rascunho">Rascunho</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Resumo Curto (Card)</label>
                                    <input type="text" name="descricao" className="form-control bg-light border-0" placeholder="Uma frase curta para o card..." value={form.descricao} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold small">Nível</label>
                                    <select name="nivel" className="form-select bg-light border-0" value={form.nivel} onChange={handleChange}>
                                        <option>Iniciante</option>
                                        <option>Intermediário</option>
                                        <option>Avançado</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold small">Duração (h)</label>
                                    <input type="number" name="duracao" className="form-control bg-light border-0" value={form.duracao} onChange={handleChange} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold small">Capacidade</label>
                                    <input type="number" name="capacidade"  required min="0" className="form-control bg-light border-0" value={form.capacidade} onChange={handleChange} />
                                </div>
                            </div>

                            {/* 2. DETALHES DO CONTEÚDO (NOVA SEÇÃO) */}
                            <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-file-text me-2"></i>Detalhes do Conteúdo</h6>
                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Sobre o Curso (Descrição Longa)</label>
                                    <textarea name="sobre" className="form-control bg-light border-0" rows="4" placeholder="Descreva o curso detalhadamente..." value={form.sobre} onChange={handleChange}></textarea>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small">Objetivos de Aprendizagem</label>
                                    <textarea name="objetivos" className="form-control bg-light border-0" rows="4" placeholder="- Compreender princípios...&#10;- Aplicar Scrum..." value={form.objetivos} onChange={handleChange}></textarea>
                                    <div className="form-text small">Dica: Use Enter para separar os itens da lista</div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small">Pré-requisitos</label>
                                    <textarea name="preRequisitos" className="form-control bg-light border-0" rows="4" placeholder="- Conhecimento básico...&#10;- Experiência em..." value={form.preRequisitos} onChange={handleChange}></textarea>
                                </div>
                            </div>

                            {/* 3. Instrutor e Logística */}
                            <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-person-badge me-2"></i>Instrutor e Logística</h6>
                            <div className="row g-3 mb-4">
                                <div className="col-md-12">
                                    <label className="form-label fw-semibold small">Selecione o Instrutor *</label>
                                    <select
                                        name="instrutorId"
                                        className="form-select bg-light border-0"
                                        required
                                        value={form.instrutorId}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        {listaInstrutores.map(inst => (
                                            <option key={inst.id} value={inst.id}>
                                                {inst.nome} ({inst.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small">Modalidade</label>
                                    <select name="modalidade" className="form-select bg-light border-0" value={form.modalidade} onChange={handleChange}>
                                        <option>Online</option>
                                        <option>Presencial</option>
                                        <option>Híbrido</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small">Local/Plataforma</label>
                                    <input type="text" name="local" className="form-control bg-light border-0" value={form.local} onChange={handleChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold small">Início</label>
                                    <input type="date" name="dataInicio" required className="form-control bg-light border-0" value={form.dataInicio} onChange={handleChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold small">Término</label>
                                    <input type="date" name="dataFim" required className="form-control bg-light border-0" value={form.dataFim} onChange={handleChange} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Competências (Tags)</label>
                                    <input type="text" name="competenciasTexto" className="form-control bg-light border-0" placeholder="Ex: Agile, Scrum, Liderança" value={form.competenciasTexto} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="modal-footer border-top-0 px-0">
                                <button type="button" className="btn btn-light border" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn text-white" style={{ backgroundColor: '#0a2b6b' }}>
                                    {dadosEditar ? 'Salvar Alterações' : '+ Criar Curso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}