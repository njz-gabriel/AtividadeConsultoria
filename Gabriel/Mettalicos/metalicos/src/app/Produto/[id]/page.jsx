import 'bootstrap/dist/css/bootstrap.min.css'
import './prods.css'
import Image from 'next/image';

export default async function ProdutoDetail({ params }) {
    const { id } = params;
    const res = await fetch(`http://localhost:3001/${id}`);
    const metais = await res.json();

    return (<>
        {

            metais &&
            <div className="d-flex justify-content-center align-items-center m-5">
                <div className='m-5'>
                    <img src={metais.img}
                        width={400}
                        height={400} />
                </div>
                <div className='w-25'>
                    <h1>{metais.nome}</h1>
                    <h5>{metais.categoria}</h5>
                    <p>{metais.descricao}</p>
                    <div className="d-flex justify-content-center align-items-center border-bottom border-primary text-size-loucura gap-3 m-5">
                        <div>
                            <div>R${metais.preco},00</div>
                            <div className='text-size-loucura2'>Vendido por {metais.medida}</div>
                        </div>
                    </div>
                    <>
                        <script
                            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
                            crossOrigin="anonymous"
                        />
                        <div className='d-flex justify-content-center'>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                Orçamento
                            </button>
                        </div>
                        <div
                            className="modal fade"
                            id="exampleModal"
                            tabIndex={-1}
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5 text-primary" id="exampleModalLabel">
                                            Solicitar um Orçamento
                                        </h1>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        />
                                    </div>
                                    <div className="modal-body">Insira suas informações que entraremos em contato</div>
                                    <div className='d-flex justify-content-left ps-3'>
                                        <input type='email' placeholder='E-mail'></input>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>

                </div>

            </div>

        }

    </>)
}