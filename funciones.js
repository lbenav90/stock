import Stock from './clases/Stock.js';

export function checkValidInputs(id, name, brand, quantity, minQuantity, presentation, type) {
    if ((isNaN(quantity) || quantity <= 0) || (isNaN(minQuantity) && quantity <= 0) || name === '' || presentation === '') {
        // Chequea que ingresen nombre, presentación y una cantidad válida. 
        // Si alguno es inválido, chequea todos para poner las alertas correspondientes.
        if (name === '') {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Ingresar un nombre\n';
            document.querySelector(`#alert-name-data`).innerText += '*';
        }
        if (isNaN(quantity) || quantity <= 0) {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Cantidad inválida\n';
            document.querySelector(`#alert-quantity-data`).innerText += '*';
        }
        if (isNaN(minQuantity) || minQuantity <= 0) {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Cantidad mínima inválida\n';
            document.querySelector(`#alert-minQuantity-data`).innerText += '*';
        }
        if (presentation === '') {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Ingresar una presentación\n';
            document.querySelector(`#alert-presentation-data`).innerText += '*';
        }
        return false;
    }

    let stock = new Stock ();
    stock.getStockFromStorage();

    let uniqueItems = true;

    stock.items.forEach((item) => {
        if (type === 'change' && id === item.id){
            1;
        } else if (name.toLowerCase().trim() === item.name.toLowerCase() && 
            brand.toLowerCase().trim() === item.brand.toLowerCase() && 
            presentation.toLowerCase().trim() === item.presentation.toLowerCase()) {   

            document.querySelector(`#alerting-element-${type}`).innerText += 'Ítem ya existente\n';
            uniqueItems = false;
        }
    })

    return uniqueItems;
}

export function cleanUpString(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}