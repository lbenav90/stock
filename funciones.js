import Stock from './clases/Stock.js';

export function checkValidInputs(id, name, brand, quantity, minQuantity, presentation, description, type) {
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
            return;
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

export function showPage(divClassShow) {
    let divClasses = ['stock-div', 'add-item-div', 'show-item-div', 'change-item-div', 'low-stock-div'];
    let div;

    if (!divClasses.includes(divClassShow)) {
        return false;
    }

    divClasses.forEach((divClass) => {
        div = document.querySelector(`#${divClass}`);
        
        div.innerHTML = '';

        if (divClass === divClassShow) {
            div.style.display = 'block'
        } else {
            div.style.display = 'none';
        }
    })

    // Reescribo la tabla de stock
    document.querySelector('#stock-div').innerHTML = `<h4 id="empty-stock-alert">No hay ítems aún, agrega algunos!</h4>
                                                      <table id="stock-table" class="table table-hover">
                                                          <thead id="stock-table-head"></thead>
                                                          <tbody id="stock-table-body"></tbody>
                                                      </table>`;

    return true;

}

export function getFormValues() {
    let name = cleanUpString(document.querySelector('#item-name').value.trim());
    let brand = cleanUpString(document.querySelector('#item-brand').value.trim());
    let quantity = parseInt(document.querySelector('#item-quantity').value);
    let minQuantity = parseInt(document.querySelector('#item-minQuantity').value)
    let presentation = cleanUpString(document.querySelector('#item-presentation').value.trim());
    let description = cleanUpString(document.querySelector('#item-description').value.trim());

    return [name, brand, quantity, minQuantity, presentation, description];
}