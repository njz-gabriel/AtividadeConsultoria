"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="text-white" style={{ backgroundColor: "#072a54" }}>
        <div className="container py-5">
          <div className="row gy-4">
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src="GM-logo-2021.png"
                  alt="Logo"
                  style={{ height: 35, width: 35 }}
                />
                <span className="ms-2 fw-semibold fs-5">GM | Ignite</span>
              </div>
              <p className="mb-0" style={{ color: "#d9e4f1" }}>
                Plataforma de gestão de treinamentos e desenvolvimento de
                colaboradores da General Motors.
              </p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="fw-semibold mb-3">Links Rápidos</h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    Catálogo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    Meus Treinamentos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none d-block">
                    Meu Perfil
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <h6 className="fw-semibold mb-3">Suporte</h6>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white text-decoration-none d-block mb-1"
                  >
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white text-decoration-none d-block">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-3">
              <h6 className="fw-semibold mb-3">Contato</h6>
              <p className="mb-1">
                <img
                  src="e-mail.png"
                  alt="email"
                  style={{ height: 20, width: 20 }}
                /> suporte@gmignite.com
              </p>
              <p className="mb-1">
                <img
                  src="phone-call.png"
                  alt="telefone"
                  style={{ height: 20, width: 20 }}
                /> (11) 3456-7890
              </p>
              <p className="mb-0">
                <img
                  src="alfinete.png"
                  alt="pin"
                  style={{ height: 20, width: 20 }}
                /> São Paulo, SP
              </p>
            </div>
          </div>
          <hr className="border-light opacity-25 my-4" />
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <small>© 2025 General Motors. Todos os direitos reservados.</small>
            <div className="d-flex gap-3 fs-5">
              <a href="#" className="text-white text-decoration-none">
                <img
                  src="facebook.png"
                  alt="face"
                  style={{ height: 20, width: 20 }}
                />
              </a>
              <a href="#" className="text-white text-decoration-none">
                <img
                  src="linkedin.png"
                  alt="link"
                  style={{ height: 20, width: 20 }}
                />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </>
  );
}
