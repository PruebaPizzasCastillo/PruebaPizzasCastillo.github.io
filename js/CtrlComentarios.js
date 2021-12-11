import { getAuth, getFirestore } from "../lib/fabrica.js";

import { cod, getString, muestraError } from "../lib/util.js"

import { tieneRol } from "./seguridad.js"

const daoComentarios = getFirestore().collection("Comentario");

let usuarioId = "";
/**@type {HTMLFormElement} */
const forma = document["forma"];
/**@type {HTMLUListElement} */
const lista = document.querySelector("#lista");

getAuth().onAuthStateChanged(protege, muestraError);

/** @param {import("../lib/tiposFire.js").User} usuario*/
async function protege(usuario) {
    if (tieneRol(usuario, ["Cliente"])) {
        usuarioId = usuario.email;
        consulta();
        forma.addEventListener("submit", agrega);
    }
}


/** Agrega los datos a la colección de comentarios
 * @param {Event} evt*/
async function agrega(evt) {
    try {
        evt.preventDefault();
        const formData = new FormData(forma);

        /**@type {string} */
        const texto = getString(formData, "texto").trim();
        // @ts-ignore
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        /** @type {import(
        "./tipos.js").Comentario} */
        const modelo = { usuarioId, texto, timestamp };
        await daoComentarios.add(modelo);
        forma.texto.value = "";
    } catch (e) {
        muestraError(e);
    }
}

/**Consulta */
function consulta() {
    daoComentarios.orderBy("timestamp", "desc").onSnapshot(htmlLista, errConsulta);
}

/**Mostrar los datos enviados en el servidor 
 * @param {import("../lib/tiposFire.js").QuerySnapshot}*/
function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) {
        snap.forEach(doc =>
            html += htmlFila(doc));
    } else {
        html += /* html */
            `
        <li class="vacio">
            -- Sin comentarios aún. --
        </li>
        `;
    }
    lista.innerHTML = html;
}

/** @param {import("../lib/tiposFire.js").DocumentSnapshot} doc */
function htmlFila(doc) {
    /**Recupera datos del doc
     * @type {import("./tipos.js").Comentario}*/
    const data = doc.data();
    return ( /* html */
        `<li class="fila">
        <strong class="primario">
            ${cod(data.usuarioId)}
        </strong>
        <span class="secundario">
            ${cod(data.texto)}
        </span>
        </li>`);
}

/** Error al recuperar los comentarios y muestra error 
 * @param {Error} e */
function errConsulta(e) {
    muestraError(e);
    //Reconexión
    consulta();
}
