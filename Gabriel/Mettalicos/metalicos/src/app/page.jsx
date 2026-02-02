import Image from "next/image";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProdCard from "@/components/ProdCard";
import "./page.css";

export default async function Home() {
  const produtos = await (await fetch("http://localhost:3001/", { cache: "no-store" })).json();
  
  // 🎯 ALTERAÇÃO FEITA AQUI: Limitando a 3 produtos (os 3 primeiros)
  const top3Produtos = Array.isArray(produtos) ? produtos.slice(0, 3) : [];

  return (
    <>
      {/* Carousel */}
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <Image src="/Banner/banner12.png"
              width={1920}
              height={550}
              className="d-block w-100" alt="Banner 1" />
          </div>
          <div className="carousel-item">
            <Image src="/Banner/banner21.png"
              width={1920}
              height={550}
              className="d-block w-100" alt="Banner 2" />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="d-flex justify-content-center text-primary mt-3 border-bottom border-primary">
        <h1>Em destaques!!</h1>
      </div>
      <div className="row row-cols-4 g-3 d-flex justify-content-center m-5">
        {top3Produtos.map((p, index) => (
          <div className="col m-3" key={index}>
            <ProdCard produto={p} />
          </div>
        ))}
      </div>
      <div className="text-success d-flex justify-content-center border-bottom border-success">
        <h1>Nossas missões</h1>
      </div>
      <div className="row row-cols-1 row-cols-md-3 mb-3 text-center mt-3">
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border border-success">
            <div className="card-header bg-success text-white py-3">
              <h4 className="my-0 fw-normal">Entrega sustentável</h4>
            </div>
            <div className="card-body">
              <Image src='/caminhao.png'
                width={100}
                height={100}
                alt="imagem" />
              <p>Priorizamos o uso de aço de alta qualidade com alto teor de material reciclado, contribuindo diretamente para a redução da demanda por minério de ferro virgem e a diminuição da emissão de CO2 associada à produção primária. Nossos processos buscam a otimização do corte e dobra, o que resulta em menos desperdício de material tanto na nossa fábrica quanto no canteiro de obras dos nossos clientes.</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border border-success">
            <div className="card-header bg-success text-white py-3">
              <h4 className="my-0 fw-normal">Sustentabilidade</h4>
            </div>
            <div className="card-body">
              <Image src='/planeta.png'
                width={100}
                height={100}
                alt="imagem" />
              <p>Priorizamos o uso de aço de alta qualidade com alto teor de material reciclado, contribuindo diretamente para a redução da demanda por minério de ferro virgem e a diminuição da emissão de CO2 associada à produção primária. Nossos processos buscam a otimização do corte e dobra, o que resulta em menos desperdício de material tanto na nossa fábrica quanto no canteiro de obras dos nossos clientes.</p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card mb-4 rounded-3 shadow-sm border border-success">
            <div className="card-header bg-success text-white py-3">
              <h4 className="my-0 fw-normal">Reciclagem</h4>
            </div>
            <div className="card-body">
              <Image src='/reciclagem.jpg'
                width={100}
                height={100}
                alt="imagem" />
              <p>
                Priorizamos o uso de aço de alta qualidade com alto teor de material reciclado, contribuindo diretamente para a redução da demanda por minério de ferro virgem e a diminuição da emissão de CO2 associada à produção primária. Nossos processos buscam a otimização do corte e dobra, o que resulta em menos desperdício de material tanto na nossa fábrica quanto no canteiro de obras dos nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Image src="/Banner/bannerAbout.png"
          width={1920}
          height={920}
          className="d-block w-100" alt="Sobre nós" />
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        crossOrigin="anonymous"
      />
    </>
  );
}