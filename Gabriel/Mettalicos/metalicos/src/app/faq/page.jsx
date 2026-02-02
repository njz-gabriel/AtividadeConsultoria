// app/faqs/page.jsx
"use client";

import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function FAQsPage() {
  // carrega o JS do Bootstrap (collapse/accordion)
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const faqs = [
    {
      q: "Como solicito um orçamento de estribos para minha obra?",
      a: "Envie medidas (lado, bitola, cobrimento), quantidade e endereço da obra por WhatsApp, e-mail ou formulário. Retornamos com preço, prazo e condições."
    },
    {
      q: "Quais dados técnicos preciso para orçar estribo?",
      a: "Seção de pilar/viga, bitola (ex.: CA-60 4,2 mm), dimensões internas, número de dobras/gancho, passo (espaçamento) e quantidade aproximada."
    },
    {
      q: "Vocês fazem corte e dobra de vergalhão sob medida?",
      a: "Sim. Trabalhamos conforme projeto estrutural (CA-50/CA-60). Envie lista de barras (bitola, comprimento, ângulo) ou o detalhamento do engenheiro."
    },
    {
      q: "Qual o prazo de entrega?",
      a: "Lotes até ~300 kg geralmente em 24–48h úteis. Volumes maiores ou peças especiais podem exigir prazo adicional."
    },
    {
      q: "Há quantidade mínima?",
      a: "Para estribos sob medida, mínimo por bitola (~30 kg). Para barras inteiras, vendemos por barra ou kg."
    },
    {
      q: "Entregam na obra? Como calculam o frete?",
      a: "Sim. Consideramos distância, peso/volume e condições de acesso/descarga. Informamos o valor ao fechar o pedido."
    },
    {
      q: "Posso enviar o projeto para cotação completa?",
      a: "Claro. Aceitamos PDF/DWG; extraímos a lista (BOM) e enviamos orçamento consolidado com prazos e logística."
    },
    {
      q: "Como garantem qualidade?",
      a: "Aço certificado (CA-50/CA-60), inspeção dimensional e conferência de bitola. Emitimos nota e certificados quando aplicável."
    },
    {
      q: "Quais formas de pagamento?",
      a: "Pix, boleto (cadastro), cartão e faturamento para CNPJ aprovado. Itens sob medida podem exigir sinal."
    },
    {
      q: "Posso alterar um pedido aprovado?",
      a: "Se a produção não começou, ajustamos sem custo. Após início, reavaliamos diferenças de preço/prazo."
    }
  ];

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <h1 className="mb-2 text-center">Perguntas Frequentes (FAQs)</h1>
          <p className="text-muted text-center mb-4">
            Dúvidas sobre orçamento e fornecimento de estribos, vergalhões, corte e dobra e entregas.
          </p>

          {/* Accordion Bootstrap */}
          <div className="accordion" id="faqAccordion">
            {faqs.map((item, i) => (
              <div className="accordion-item" key={i}>
                <h2 className="accordion-header" id={`heading-${i}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${i}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${i}`}
                  >
                    {item.q}
                  </button>
                </h2>
                <div
                  id={`collapse-${i}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${i}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body text-start">
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA opcional */}
          <div className="mt-4 p-3 border rounded text-center">
            <h5 className="mb-2">Ainda com dúvidas?</h5>
            <p className="mb-3">
              Envie seu projeto estrutural ou lista de materiais e retornamos com um orçamento detalhado.
            </p>
            <Link href="/Produtos" className="btn btn-primary">Pedir orçamento</Link>
            
          </div>
        </div>
      </div>
    </main>
  );
}
