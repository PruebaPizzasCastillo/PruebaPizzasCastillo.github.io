import {
    getAuth,
    getFirestore
} from "../lib/fabrica.js";
import {
    urlStorage
} from "../lib/storage.js";
import {
    cod,
    muestraError
} from "../lib/util.js";
import {
    tieneRol
} from "./seguridad.js";

/** @type {HTMLUListElement} */
// @ts-ignore
const lista = document.
querySelector("#lista");
const firestore = getFirestore();
const daoRol = firestore.
collection("Rol");
const daoAlimento = firestore.
collection("Alimento");
const daoUsuario = firestore.collection("Usuario");

getAuth().onAuthStateChanged(
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
    daoUsuario.onSnapshot(
        htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
    let html = "";
    if (snap.size > 0) {
        /** @type {
              Promise<string>[]} */
        let alimentos = [];
        snap.forEach(doc => alimentos.push(htmlFila(doc)));
        const htmlFilas = await Promise.all(alimentos);
        /* Junta el todos los
         * elementos del arreglo en
         * una cadena. */
        html += htmlFilas.join("");
    } else {
        html += /* html */
            `<li class="vacio">
          -- No hay alimentos
          registrados. --
        </li>`;
    }
    lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
    /**
     * @type {import("./tipos.js").
                        Producto} */
    const data = doc.data();
    const img = cod(
        await urlStorage(doc.id));
    const alimento =
        await buscaAlimento(
            data.idProducto);
    const parámetros =
        new URLSearchParams();
    parámetros.append("id", doc.id);
    return ( /* html */
        `<li>
        <a class="fila conImagen"
            href=
      "usuario.html?${parámetros}">
          <span class="marco">
            <img src="${img}" alt="Falta el Avatar">
          </span>
          <span class="texto">
            <strong
                class="primario">
              ${cod(doc.id)}
            </strong>
            <span
                class="secundario">
              ${alimento}<br>
            </span>
          </span>
        </a>
      </li>`);
}

/** Recupera el html de un
 * alimento en base a su id.
 * @param {string} idProducto */
async function
buscaAlimento(idProducto) {
    if (idProducto) {
        const doc =
            await daoAlimento.
        doc(idProducto).
        get();
        if (doc.exists) {
            /**
             * @type {import(
                "./tipos.js").
                  Alumno} */
            const data = doc.data();
            return ( /* html */
                `${cod(data.nombre)}`);
        }
    }
    return " ";
}

/** @param {Error} e */
function errConsulta(e) {
    muestraError(e);
    consulta();
}