import 'bootstrap-icons/font/bootstrap-icons.css';
import Link from 'next/link';

export default function Card({ data }) {
  
  const resumoDescricao = (texto) => {
    if (!texto) return '';
    return texto.length > 80 ? texto.substring(0, 80) + '...' : texto;
  };

  return (
    <div className="card shadow-sm rounded-3 h-100 border-0">
      <div className="card-body d-flex flex-column p-4">

        <span className="badge bg-light text-secondary border mb-3 align-self-start rounded-pill fw-normal px-3">
          {data.categoria}
        </span>

        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title fw-bold text-dark" style={{ minHeight: '48px' }}>
            {data.titulo}
          </h5>
          <div className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded ms-2">
            <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.8rem' }}></i>
            <span className="fw-bold small">4.8</span>
          </div>
        </div>

        <p className="card-text text-muted mb-4" style={{ fontSize: "0.9rem", minHeight: '40px' }}>
          {resumoDescricao(data.descricao)}
        </p>

        <div className="d-flex gap-3 text-secondary mb-4" style={{ fontSize: "0.85rem" }}>
          <span title="Duração"><i className="bi bi-clock me-1"></i> {data.duracao_horas}h</span>
          <span title="Modalidade"><i className="bi bi-laptop me-1"></i> {data.modalidade}</span>
          <span title="Inscritos"><i className="bi bi-people me-1"></i> {data.inscritos_atuais}</span>
        </div>

        <hr className="text-muted opacity-25 my-0 mb-3" />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-secondary-subtle rounded-circle d-flex align-items-center justify-content-center text-secondary fw-bold" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>
                {data.instrutor_nome.charAt(0)}
            </div>
            <div className='d-flex flex-column'>
                <small className="text-muted" style={{fontSize: '0.7rem'}}>Instrutor</small>
                <span className="fw-semibold small text-dark">{data.instrutor_nome}</span>
            </div>
          </div>
          <span className="badge bg-light text-dark border fw-normal">
            {data.nivel}
          </span>
        </div>

        <Link 
          href={`/catalogo/${data.id}`} 
          className="btn text-white mt-auto w-100 rounded-3 fw-medium py-2 text-decoration-none text-center"
          style={{ backgroundColor: '#0a2b6b' }}
        >
          Ver Detalhes
        </Link>

      </div>
    </div>
  );
}