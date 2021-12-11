// @ts-nocheck
import { cargaRoles } from "../js/seguridad.js";
import { getAuth } from "../lib/fabrica.js";
import { muestraError } from "../lib/util.js";

class MiNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /* html */
            `<header>
          <div class="menu">
            <a href="index.html">
              <img src="img/logo.png" alt="">
            </a>
            <nav>
                <ul>
                  <li><a href="index.html">Inicio</a></li>
                  <li><a href="sesion.html">Sesión</a></li>
                  <li><a href="menu.html">Menú</a></li>
                  <li><a href="#">Sucursales</a></li>
                </ul>
            </nav>
          </div>
        </header>`;
        this.ul = this.querySelector("ul");
        getAuth().onAuthStateChanged(usuario =>
            this.cambiaUsuario(usuario), muestraError);
    }

    /** @param {import("../lib/tiposFire.js").User} usu */
    async cambiaUsuario(usu) {
        if (usu && usu.email) {
            let html = "";
            const roles = await cargaRoles(usu.email);

            /* Enlaces para clientes */
            if (roles.has("Cliente")) {
                html += /* html */
                    `<li>
              <a href="comentarios.html">Comentarios</a>
            </li>`;
            }

            /* Enlaces para empleados */
            if (roles.has("Empleado")) {
                html += /* html */
                    `<li>
            <a href="#">Editar</a>
          </li>`;
            }

            /* Enlace para administrador */
            if (roles.has("Administrador")) {
                html += /* html */
                    `<li>
            <a href="#">Empleados</a>
          </li>`;
            }
            this.ul.innerHTML += html;
        }
    }
}

customElements.define("mi-nav", MiNav);
