import React from 'react';

export default function TabsTreinamento({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-pill p-1 d-inline-flex shadow-sm border">
       <button 
          className={`btn rounded-pill px-4 ${activeTab === 'Em Andamento' ? 'bg-primary text-white' : 'text-muted'}`}
          onClick={() => setActiveTab('Em Andamento')}
       >
          Em Andamento
       </button>
       <button 
          className={`btn rounded-pill px-4 ${activeTab === 'Concluídos' ? 'bg-success text-white' : 'text-muted'}`}
          onClick={() => setActiveTab('Concluídos')}
       >
          Concluídos
       </button>
    </div>
  );
}