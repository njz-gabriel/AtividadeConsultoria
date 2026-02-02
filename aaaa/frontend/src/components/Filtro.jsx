import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Filtros({ filtros, setFiltros, limparFiltros }) {

  const handleCheckbox = (categoria, valor) => {
    setFiltros(prev => {
      const listaAtual = prev[categoria] || [];
      if (listaAtual.includes(valor)) {
        return { ...prev, [categoria]: listaAtual.filter(item => item !== valor) };
      } else {
        return { ...prev, [categoria]: [...listaAtual, valor] };
      }
    });
  };

  const handleSelect = (e) => {
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <aside className="border p-3 rounded-3 bg-white shadow-sm sticky-top" style={{ top: '20px', zIndex: 1 }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0"><i className="bi bi-filter me-2"></i>Filtros</h5>
        <button className="btn btn-link text-decoration-none p-0" onClick={limparFiltros}>
          Limpar
        </button>
      </div>

      {/* 1. Competência (Select) */}
      <div className="mb-3">
        <label className="form-label fw-bold small text-secondary">Categoria</label>
        <select 
          className="form-select form-select-sm bg-light border-0" 
          name="categoria" 
          value={filtros.categoria} 
          onChange={handleSelect}
        >
          <option value="">Todas</option>
          <option value="Gestão">Gestão</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Manufatura">Manufatura</option>
          <option value="Segurança e EHS">Segurança e EHS</option>
          <option value="Inovação">Inovação</option>
          <option value="Logística">Logística</option>
          <option value="Processos">Processos</option>
        </select>
      </div>

      {/* 2. Modalidade (Checkboxes) */}
      <div className="mb-3">
        <label className="form-label fw-bold small text-secondary">Modalidade</label>
        {['Online', 'Presencial', 'Híbrido'].map(opcao => (
          <div className="form-check" key={opcao}>
            <input 
              className="form-check-input" 
              type="checkbox" 
              id={`checkModal${opcao}`} 
              checked={filtros.modalidade.includes(opcao)}
              onChange={() => handleCheckbox('modalidade', opcao)}
            />
            <label className="form-check-label small" htmlFor={`checkModal${opcao}`}>{opcao}</label>
          </div>
        ))}
      </div>

      {/* 3. Nível (Checkboxes) */}
      <div className="mb-3">
        <label className="form-label fw-bold small text-secondary">Nível</label>
        {['Iniciante', 'Intermediário', 'Avançado'].map(opcao => (
          <div className="form-check" key={opcao}>
            <input 
              className="form-check-input" 
              type="checkbox" 
              id={`checkNivel${opcao}`}
              checked={filtros.nivel.includes(opcao)}
              onChange={() => handleCheckbox('nivel', opcao)}
            />
            <label className="form-check-label small" htmlFor={`checkNivel${opcao}`}>{opcao}</label>
          </div>
        ))}
      </div>

      <button className="btn btn-outline-secondary w-100 mt-2 btn-sm" onClick={limparFiltros}>
        Limpar Filtros
      </button>

    </aside>
  );
}