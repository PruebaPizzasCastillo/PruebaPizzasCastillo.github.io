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
const daoAlimento =
    getFirestore().
collection("Alimento");

getAuth().
onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
    if (tieneRol(usuario, ["Administrador"])) {
        consulta();
    }
}

function consulta() {
    daoAlimento.
    orderBy("idProducto")
        .onSnapshot(
            htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) {
        snap.forEach(doc =>
            html += htmlFila(doc));
    } else {
        html += /* html */
            `<li class="vacio">
          -- No hay alimentos. --
        </li>`;
    }
    lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
function htmlFila(doc) {
    /**
     * @type {import("./tipos.js").
                    Alimento} */
    const data = doc.data();
    const idProducto = cod(data.idProducto);
    const nombre = cod(data.nombre);
    const costo = cod(data.costo);
    const descripcion = cod(data.descripcion);
    const parámetros = new URLSearchParams();
    parámetros.append("idProducto", doc.idProducto);
    return ( /* html */
        `<li>
        <a class="fila" href=
    "editar.html?${parámetros}">
          <strong class="primario">
            ${idProducto} // ${nombre} // ${costo} // ${descripcion}
          </strong>
        </a>
       
      </li>`);
}

/** @param {Error} e */
function errConsulta(e) {
    muestraError(e);
    consulta();
}