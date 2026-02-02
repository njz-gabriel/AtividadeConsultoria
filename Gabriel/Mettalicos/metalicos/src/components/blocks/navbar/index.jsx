import './nav.css'
import Image from 'next/image'
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'

export default function Nav() {
  return (
    <>
      <div className="back">
        <header className="container d-flex align-items-center justify-content-between meu-header">
          <a
            href="/"
            className="d-flex align-items-center text-decoration-none"
          >
            <Image
              src="/Banner/logo.png"
              width={100}
              height={100}
              alt="bizarro"
              // ↓ deixa visualmente menor sem precisar trocar o arquivo
              style={{ height: 40, width: 'auto' }}
            />
          </a>

          <ul className="nav nav-pills gap-2">
            <li className="nav-item">
              <Link href="/Produtos" className="nav-link text-white py-1 px-2">
                Produtos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/faq" className="nav-link text-white py-1 px-2">
                FAQs
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link text-white py-1 px-2">
                Login
              </Link>
            </li>
          </ul>
        </header>
      </div>
    </>
  )
}
