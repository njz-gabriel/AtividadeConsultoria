import React from 'react';


export default function CardConcluido({ t }) {
 
  // Função para formatar a data de conclusão
  const formatarData = (dataISO) => {
    if (!dataISO) return 'Data não informada';
    return new Date(dataISO).toLocaleDateString('pt-BR');
  };


  return (
    <div className="card border-0 shadow-sm rounded-4 mb-3 hover-effect" style={{ borderLeft: '5px solid #198754' }}>
      <div className="card-body p-4">
       
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 mb-2">
              {t.categoria}
            </span>
            <h5 className="fw-bold text-dark mb-1">{t.titulo}</h5>
          </div>
          <div className="text-end">
             <i className="bi bi-patch-check-fill text-success fs-3"></i>
          </div>
        </div>


        <div className="row mt-3 g-2">
            <div className="col-auto">
                <div className="d-flex align-items-center gap-2 text-muted small bg-light px-3 py-2 rounded-3">
                    <i className="bi bi-calendar-check"></i>
                    <span>Concluído em: <strong>{formatarData(t.data_conclusao || t.data_inscricao)}</strong></span>
                </div>
            </div>
            <div className="col-auto">
                <div className="d-flex align-items-center gap-2 text-muted small bg-light px-3 py-2 rounded-3">
                    <i className="bi bi-clock"></i>
                    <span>Duração: <strong>{t.duracao_horas}h</strong></span>
                </div>
            </div>
        </div>


        <div className="mt-4 d-flex gap-2">
          <a
            href="/certificado_padrao.png"
            download={`Certificado-${t.titulo}.jpg`}
            className="btn btn-success w-100 fw-medium rounded-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
          >
            <i className="bi bi-download"></i> Baixar Certificado
          </a>
        </div>


      </div>
    </div>
  );
}

