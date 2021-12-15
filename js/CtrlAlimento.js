import {
    getAuth,
    getFirestore
} from "../lib/fabrica.js";
import {
    getString,
    muestraError
} from "../lib/util.js";
import {
    muestraAlimentos
} from "./navegacion.js";
import {
    tieneRol
} from "./seguridad.js";

const daoAlimento =
    getFirestore().
collection("Alimento");
const params =
    new URL(location.href).
searchParams;
const id = params.get("idProducto");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
    if (tieneRol(usuario, ["Administrador"])) {
        busca();
    }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
    try {
        const doc =
            await daoAlimento.
        doc(id).
        get();
        if (doc.exists) {
            /**
             * @type {
                import("./tipos.js").
                        Alimento} */
            const data = doc.data();
            forma.idProducto.value = data.idProducto;
            forma.nombre.value = data.nombre || "";
            forma.costo.value = data.costo || "";
            forma.descripcion.value = data.descripcion || "";
            forma.addEventListener("submit", guarda);
            forma.eliminar.addEventListener("click", elimina);
        } else {
            throw new Error(
                "No se encontró.");
        }
    } catch (e) {
        muestraError(e);
        muestraAlimentos();
    }
}

/** @param {Event} evt */
async function guarda(evt) {
    try {
        evt.preventDefault();
        const formData =
            new FormData(forma);
        const idProducto = getString(formData, "idProducto").trim();
        const nombre = getString(formData, "nombre").trim();
        const costo = getString(formData, "costo").trim();
        const descripcion = getString(formData, "descripción").trim();
        /**
         * @type {
            import("./tipos.js").
                    Alimento} */
        const modelo = {
            idProducto,
            nombre,
            costo,
            descripcion
        };
        await daoAlimento.
        doc(id).
        set(modelo);
        muestraAlimentos();
    } catch (e) {
        muestraError(e);
    }
}

async function elimina() {
    try {
        if (confirm("Confirmar la " +
                "eliminación")) {
            await daoAlimento.
            doc(id).
            delete();
            muestraAlimentos();
        }
    } catch (e) {
        muestraError(e);
    }
}