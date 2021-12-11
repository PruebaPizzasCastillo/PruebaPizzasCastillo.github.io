import {
    getAuth,
    getFirestore
} from "../lib/fabrica.js";
import {
    getString,
    muestraError
} from "../lib/util.js";
import {
    muestraSucursal,
} from "./navegacion.js";
import {
    tieneRol
} from "./seguridad.js";

const daoSucursal =
    getFirestore().
collection("Sucursal");
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
        const nombreSucursal = getString(formData, "nombre").trim();
        const direccion = getString(formData, "direccion").trim();
        const hapertura = getString(formData, "hapertura").trim();
        const hcierre = getString(formData, "hcierre").trim();
        /**
         * @type {
            import("./tipos.js").
                    Sucursal} */
        const modelo = {
            nombreSucursal,
            direccion,
            hapertura,
            hcierre
        };
        await daoSucursal.
        add(modelo);
        muestraSucursal();
    } catch (e) {
        muestraError(e);
    }
}