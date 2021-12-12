// @ts-nocheck
import {
    getAuth,
    getFirestore
} from "../lib/fabrica.js";
import {
    cod,
    muestraError
} from "../lib/util.js";
import {
    tieneRol
} from "./seguridad.js";

/** @type {HTMLUListElement} */
const lista = document.
querySelector("#lista");
const daoSucursal =
    getFirestore().
collection("Sucursal");

getAuth().
onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
    if (tieneRol(usuario, ["Cliente"])) {
        consulta();
    }
}

/** Muestra los mensajes
 * almacenados en la collection
 * "Sucursal". Se actualiza
 * automáticamente. */
function consulta() {
    /* Consulta que se actualiza
     * automáticamente. Pide todos
     * los registros de la colección
     *  "Sucursal"
     * ordenados por el campo
     *  "idProducto"
     * de forma
     *  descendente. */
    daoSucursal.
    orderBy("nombreSucursal").
    onSnapshot(
        htmlLista, errConsulta);
}

/** Muestra los datos enviados por
 * el servidor.
 * Si los datos cambian en el
 * servidor, se vuelve a invocar
 * esta función y recibe los datos
 * actualizados.
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap estructura
 *    parecida a un Array, que
 *    contiene una copia de los
 *    datos del servidor.
 */
function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) {
        /* Cuando el número de
         * documentos devueltos por la
         * consulta es mayor que 0,
         * revisa uno por uno los
         * documentos de la consulta y
         * los muestra. El iterador
         * "doc" apunta a un
         * documento de la base
         * de datos. */
        snap.forEach(doc =>
            html += htmlFila(doc));
    } else {
        /* Cuando el número de
         * documentos devueltos por la
         * consulta es igual a 0,
         * agrega un texto HTML. */
        html += /* html */
            `<li class="vacio">
          -- No hay sucursales
          registradas. --
        </li>`;
    }
    lista.innerHTML = html;
}

/** Agrega el texto HTML
 * que corresponde a un
 * documento de un mensaje.
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
    /** Recupera los datos del
     * documento.
     * @type {import("./tipos.js").
                        Sucursal} */
    const data = doc.data();
    /* Agrega un li con los datos
     * del documento, los cuales se
     * codifican para evitar
     * inyección de código. */
    return ( /* html */
        `<li class="fila" style="padding: 2em">
        <strong class="primario" style="padding: 2em; margin: 1px solid black ";>
          <p>
            <br style="color: red">
            Sucursal ${cod(data.nombreSucursal)}
            <br>
          </p>
            ${cod(data.direccion)}
          <br>
          <p>
          De: ${cod(data.hapertura)}
          </p>
          <br>
          <p>
          A: ${cod(data.hcierre)}
          </p>
        </strong>
      </li>`);
}

/** Función que se invoca cuando
 * hay un error al recuperar los
 * mensajes y muestra el error. Al
 * invocar esta función, la
 * conexión se cancela, por lo
 * cual intenta conectarse otra
 * vez.
 * @param {Error} e */
function errConsulta(e) {
    muestraError(e);
    // Intenta conectarse otra vez.
    consulta();
}