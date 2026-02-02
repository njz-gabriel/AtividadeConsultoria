import Link from 'next/link'
import './foot.css'
import Image from 'next/image'

export default function Foot() {
    return (
        <>
            <div className="back">
                {" "}
                <footer className="py-3 mt-1">
                    {" "}
                    <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                        {" "}
                        <li className="nav-item">
                            <Link href="/Produtos" className="nav-link px-2 text-white">
                                Produtos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/faq" className="nav-link px-2 text-white">
                                FAQs
                            </Link>
                        </li>{" "}
                    </ul>{" "}
                    <div className="bizarro">
                        <Image src='/banner/logo.png'
                            width={100} 
                            height={100}
                            alt='bizarro'/>
                        <p className="text-center text-white">© 2025 Company, Inc</p>{" "}
                    </div>
                </footer>{" "}
            </div>


        </>
    )
}