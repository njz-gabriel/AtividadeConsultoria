import Link from "next/link"
import "./card.css"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function ProdCard({ produto }) {
  return (
    <>
      <Link
        href={`/Produto/${produto.id}`}
        className="text-decoration-none text-reset d-block h-100"   // ocupa toda a altura
      >
        <div className="card card-product border border-primary azul-clarinho h-100 w-100 d-flex">
          <div className="ratio ratio-4x3">
            <img src={produto.img} className="card-img-top img-cover" alt="" />
          </div>

          <div className="card-body d-flex flex-column">
            <h5 className="card-title card-title-fixed">{produto.nome}</h5>  {/* fixa 2 linhas */}
            <p className="card-text price-fixed">R${produto.preco},00</p>    {/* altura fixa */}
            <div className="mt-auto pt-3 border-top border-primary text-center">
              <a href="#" className="btn btn-primary w-100">Cotar</a>
            </div>
          </div>
        </div>
      </Link>

    </>
  )
}
