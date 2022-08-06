/**
 * Chequea que los inputs en los formularios sean válidos y si no lo son, agrega alertas en el formulario
 * @param {str} nombre 
 * @param {int} cantidad 
 * @param {str} presentacion 
 * @param {str} type 'add' o 'change', los dos tipos de formularios
 * @returns bool, indica si los inputs son válidos
 */
function checkValidInputs(nombre, cantidad, presentacion, type) {
    if ((isNaN(cantidad) || cantidad <= 0) || nombre === '' || presentacion === '') {
        // Chequea que ingresen nombre, presentación y una cantidad válida. 
        // Si alguno es inválido, chequea todos para poner las alertas correspondientes.
        if (nombre === '') {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Ingresar un nombre\n';
            document.querySelector(`#alert-nombre-data`).innerText += '*';
        }
        if (isNaN(cantidad) || cantidad <= 0) {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Cantidad inválida\n';
            document.querySelector(`#alert-cantidad-data`).innerText += '*';
        }
        if (presentacion === '') {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Ingresar una presentación\n';
            document.querySelector(`#alert-presentacion-data`).innerText += '*';
        }
        return false;
    }
    return true;
}