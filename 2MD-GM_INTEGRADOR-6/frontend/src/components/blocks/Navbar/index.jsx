"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  console.log("USUÁRIO NO NAVBAR:", user);
  console.log("TIPO DO USUÁRIO NO NAVBAR:", user?.tipo);

  if (user === null) {
    return null;
  }

  const getIniciais = (nomeCompleto) => {
    if (!nomeCompleto) return "U";
    const nomes = nomeCompleto.trim().split(" ");
    if (nomes.length === 1) {
      return nomes[0].substring(0, 2).toUpperCase();
    }
    return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
  };

  const handleCloseMenu = () => {
    const btnClose = document.querySelector('#menuMobile .btn-close');
    if (btnClose) btnClose.click();
  };

  const isAdmin = ["admin", "Admin", "Administrador", "ADM"].includes(user?.nivel_acesso);

  const LinksAdmin = () => (
    <ul className="list-unstyled">
      <li className="mb-3">
        <Link
          href="/dashboardAdmin"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-house-door"></i> Dashboard
        </Link>
      </li>
      <li className="mb-3">
        <Link
          href="/gerenciar_Treinamento_admin"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-grid"></i> Gerenciar Treinamentos
        </Link>
      </li>
      <li className="mb-3">
        <Link
          href="/colaboradorAdmin"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-person"></i> Gerenciar Colaboradores
        </Link>
      </li>
    </ul>
  );

  const LinksUsuario = () => (
    <ul className="list-unstyled">
      <li className="mb-3">
        <Link
          href="/paginaUsuario"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-house-door"></i> Dashboard
        </Link>
      </li>
      <li className="mb-3">
        <Link
          href="/catalogo"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-book"></i> Catálogo
        </Link>
      </li>
      <li className="mb-3">
        <Link
          href="/meuTreinamento"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-award"></i> Meus Treinamentos
        </Link>
      </li>
      <li className="mb-3">
        <Link
          href="/paginaPerfil"
          className="text-decoration-none text-dark d-flex align-items-center gap-2"
          onClick={handleCloseMenu}
        >
          <i className="bi bi-person"></i> Meu Perfil
        </Link>
      </li>
    </ul>
  );

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="navbar bg-white border-bottom px-3 py-2 d-flex justify-content-between align-items-center sticky-top"
        style={{ zIndex: 1040 }}
      >
        <div className="d-flex align-items-center">
          {user && (
            <button
              className="btn d-md-none me-2 border-0 p-1"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menuMobile"
            >
              <i className="bi bi-list fs-1 text-dark"></i>
            </button>
          )}

          <img
            src="/General_Motors_(2021).svg.png"
            alt="Logo"
            style={{ height: 35, width: "auto" }}
          />
          <span className="ms-2 fw-semibold" style={{ color: "#0d3b66" }}>
            GM | Ignite
          </span>
        </div>

        <div className="d-flex align-items-center">
          {user ? (
            <>

              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center dropdown-toggle border-0"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center me-2 fw-bold shadow-sm"
                    style={{
                      width: 35,
                      height: 35,
                      backgroundColor: "#0d3b66",
                      color: "white",
                      fontSize: "0.9rem",
                    }}
                  >
                    {getIniciais(user.nome)}
                  </div>
                  <span className="fw-medium text-dark d-none d-sm-block">
                    {user.nome}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <h6 className="dropdown-header text-muted small">
                      {user.email}
                    </h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link className="dropdown-item" href="/paginaPerfil">
                      <i className="bi bi-person me-2"></i> Perfil
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={logout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sair
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              href="/"
              className="btn btn-primary btn-sm px-4 rounded-pill fw-semibold"
            >
              Fazer Login
            </Link>
          )}
        </div>
      </nav>

      {/* MENU MOBILE - OFFCANVAS */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="menuMobile"
        aria-labelledby="menuMobileLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h5
            className="offcanvas-title fw-bold"
            id="menuMobileLabel"
            style={{ color: "#0d3b66" }}
          >
            GM | Ignite
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body">
          {isAdmin ? <LinksAdmin /> : <LinksUsuario />}

          <hr className="my-4" />

          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-right"></i> Sair
          </button>
        </div>
      </div>
    </>
  );
}
