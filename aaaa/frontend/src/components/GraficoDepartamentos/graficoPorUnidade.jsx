"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function GraficoUnidades() {
    const [labels, setLabels] = useState([]);
    const [dados, setDados] = useState([]);

    useEffect(() => {
        async function carregar() {
            const r = await fetch("http://localhost:3001/api/dashboard/colaboradores-por-unidade");
            const json = await r.json();
            setLabels(json.map(e => e.unidade));
            setDados(json.map(e => e.total));
        }
        carregar();
    }, []);

    return (
        <Bar
            data={{
                labels,
                datasets: [{
                    label: "Colaboradores",
                    data: dados,
                    backgroundColor: "rgba(153, 102, 255, 0.6)"
                }]
            }}
        />
    );
}
