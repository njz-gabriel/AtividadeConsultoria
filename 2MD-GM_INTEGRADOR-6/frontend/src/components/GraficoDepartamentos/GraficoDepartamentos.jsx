"use client";

import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficoDepartamentos() {
    const [labels, setLabels] = useState([]);
    const [valores, setValores] = useState([]);

    useEffect(() => {
        async function carregar() {
            const resposta = await fetch("http://localhost:3001/api/dashboard/colaboradores-por-departamento");
            const dados = await resposta.json();

            setLabels(dados.map(d => d.departamento));
            setValores(dados.map(d => d.total));
        }
        carregar();
    }, []);

    return (
        <Bar
            data={{
                labels: labels,
                datasets: [{
                    label: "Colaboradores",
                    data: valores,
                    backgroundColor: "rgba(75, 192, 192, 0.6)"
                }]
            }}
            options={{ responsive: true }}
        />
    );
}
