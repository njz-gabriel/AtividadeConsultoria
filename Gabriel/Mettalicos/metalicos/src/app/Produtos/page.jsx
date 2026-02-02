import ProdCard from "@/components/ProdCard"
import 'bootstrap/dist/css/bootstrap.min.css'

export default async function PagProd() {
    const produtos = await (await fetch("http://localhost:3001/")).json()
    console.log(produtos)
    return (<>
       <div className="container text-center mt-3 mb-3">
  <div className="row row-cols-4 g-3">
    {produtos.map((p, index) => (
      <div className="col" key={index}>
        <ProdCard produto={p} />
      </div>
    ))}
  </div>
</div>


    </>)
}