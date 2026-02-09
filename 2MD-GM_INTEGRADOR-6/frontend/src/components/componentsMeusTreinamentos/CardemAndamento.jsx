import Link from "next/link";

// Recebemos a prop 'onConcluir'
export default function CardemAndamento({ t, onConcluir }) {

  console.log("Dados do card:", t);

  const formatarData = (dataISO) => {
    if (!dataISO) return 'Sem prazo';
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };

  const cursoId = t.curso_id;

  return (
    <div className="card card-em-andamento border-0 shadow-sm rounded-4 p-4 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-play-circle-fill text-primary fs-4"></i>
          <h5 className="fw-bold text-dark mb-0">{t.titulo}</h5>
        </div>
        <span className="badge bg-light text-primary">{t.categoria}</span>
      </div>

      <small className="text-secondary">
        {t.duracao_horas}h • Prazo: {formatarData(t.data_fim)}
      </small>

      <div className="mt-4 d-flex gap-2 flex-wrap">
        {/* Botão Existente */}
        <Link 
            href={`/catalogo/${cursoId}`} 
            className="btn btn-primary text-white flex-grow-1 fw-medium"
            style={{ backgroundColor: '#2563eb', borderColor: '#2563eb' }}
          >
            Continuar Estudando
          </Link>

        {/* === NOVO BOTÃO: CONCLUIR === */}
        <button
          className="btn btn-success text-white rounded-3 px-3 d-flex align-items-center gap-2"
          // O ERRO ESTAVA AQUI: use t.inscricao_id (exatamente como aparece no seu console)
          onClick={() => onConcluir(t.inscricao_id)}
        >
          <i className="bi bi-check-circle"></i> Concluir
        </button>
      </div>
    </div>
  );
}