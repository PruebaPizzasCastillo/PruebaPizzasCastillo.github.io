import {
    getAuth,
    getFirestore
} from "../lib/fabrica.js";
import {
    getString,
    muestraError
} from "../lib/util.js";
import {
    muestraAlimentos,
} from "./navegacion.js";
import {
    tieneRol
} from "./seguridad.js";

const daoAlimento =
    getFirestore().
collection("Alimento");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(
    protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
    if (tieneRol(usuario, ["Empleado"])) {
        forma.addEventListener(
            "submit", guarda);
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
        const descripcion = getString(formData, "descripcion").trim();
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
        add(modelo);
        muestraAlimentos();
    } catch (e) {
        muestraError(e);
    }
}