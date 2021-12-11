class MiFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /* html */
        `<footer>
            <p>Pizzas Castillo S.A. de C.V.</p>
            <p>Contacto: infernodmr@live.com.mx</p>
            <p>Todos los derechos reservados al autor &copy; Ayala Perez Nelson Antonio</p>
        </footer>`;
    }
}

customElements.define("mi-footer", MiFooter);