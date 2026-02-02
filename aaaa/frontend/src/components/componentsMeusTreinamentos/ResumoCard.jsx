import React from 'react';
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ResumoCard({ title, value, icon, color, bg }) {
  return (
    <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3 h-100">
       <div className={`rounded-circle p-3 ${bg} ${color}`}>
          <i className={`bi ${icon} fs-4`}></i>
       </div>
       <div>
          <h3 className="mb-0 fw-bold">{value}</h3>
          <small className="text-muted">{title}</small>
       </div>
    </div>
  );
}