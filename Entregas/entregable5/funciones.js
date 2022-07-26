import Stock from './clases/Stock.js';

/**
 * Checks if the inputs have a base validity and checks for mandatory fields.
 * @param inputs - values entered to form
 * @returns bool - if the inputs are valid or not
 */
export function checkValidInputs(id, name, brand, quantity, minQuantity, presentation, description, stockName, type) {
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

    // No deja agregar un ítem que tiene el mismo nombre, marca y presentación que uno ya existente
    stock.items.forEach((item) => {
        if (type === 'change' && id === item.id){
            // Esto evita chequear un ítem consigo mismo en modo EDITAR
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

/**
 * Handles different types of string clean up.
 * @param {str} s string to clean up
 * @param {str} type of cleanup desired. 'cap1' for capitalizing the first letter. 'capAll' for capitalizing all words
 * @returns a formatted string
 */
export function cleanUpString(s, type) {
    switch (type) {
        case 'cap1':
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        case 'capAll':
            let words = s.split(' ');
            let cleaned = [];
        
            words.forEach((word) => { cleaned.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()); });

            return cleaned.join(' ');          
    }
}

/**
 * Shows the requested div and hides the others
 * @param {str} divClassShow id of the div to be shown
 * @returns bool - correct execution
 */
export function showPage(divClassShow) {
    let divClasses = ['stock-div', 'add-item-div', 'show-item-div', 'change-item-div', 'low-stock-div'];
    let div;

    if (!divClasses.includes(divClassShow)) {
        return false;
    }

    divClasses.forEach((divClass) => {
        div = document.querySelector(`#${divClass}`);
        
        switch (divClass) {
            case 'stock-div':
                div.querySelector('#stock-table-head').innerHTML = '';
                div.querySelector('#stock-table-body').innerHTML = '';
                break;
            case 'low-stock-div':
                div.querySelector('#low-stock-table-head').innerHTML = '';
                div.querySelector('#low-stock-table-body').innerHTML = '';
                break;
            case 'add-item-div':
            case 'change-item-div':
                div.innerHTML = '';
        }

        if (divClass === divClassShow) {
            div.style.display = 'block'
        } else {
            div.style.display = 'none';
        }
    })

    return true;

}

/**
 * Gets the values from the input fields, both for 'add' and 'change' forms. 
 * Trims leading and tailing whitespace and parses the integer fields.
 * @returns array of cleaned and parsed inputs
 */
export function getFormValues() {
    let name = cleanUpString(document.querySelector('#item-name').value.trim(), 'capAll');
    let brand = cleanUpString(document.querySelector('#item-brand').value.trim(), 'capAll');
    let quantity = parseInt(document.querySelector('#item-quantity').value);
    let minQuantity = parseInt(document.querySelector('#item-minQuantity').value)
    let presentation = cleanUpString(document.querySelector('#item-presentation').value.trim(), 'capAll');
    let description = cleanUpString(document.querySelector('#item-description').value.trim(), 'cap1');
    let stockName = document.querySelector('#item-stockName').value;

    // Si el usuario eligió un nuevo nombre de stock, ir a buscarlo
    stockName = (stockName === 'new')? document.querySelector('#item-stockNameInput').value.toLowerCase(): stockName;

    return [name, brand, quantity, minQuantity, presentation, description, stockName];
}

/**
 * empties the table fields used to alert the user to invalid inputs
 * @param {str} type 'add' or 'change' - form version
 */
export function emptyFormAlerts(type) {
    let dataHeader = ['name', 'brand', 'quantity', 'minQuantity', 'presentation', 'description'];
    document.querySelector(`#alerting-element-${type}`).innerHTML = '';
    dataHeader.forEach((header) => {
        document.querySelector(`#item-${header}`).innerHTML = '';
    })
    document.querySelectorAll(`.alert-${type}-item-data`).forEach((el) => {
        el.innerHTML = '';
    })
}

/**
 * Crea un string formateado para un archivo .csv que se va a descargar
 * @param {Object} headers un objeto que vincula el nombre en español de los datos deseados y el nombre de la propiedad de Item correspondiente
 * @param {Array} items array de los ítems que se desean incluir en el archivo
 * @returns un string formateado para csv
 */
export function getCSVString(headers, items) {
    let csvString = '';

    let headerArray = [];
    for (const header in headers) {
        headerArray.push(header);
    }

    csvString += headerArray.join(',') + '\n';

    items.forEach((item) => {
        let itemDataArray = [];
        for (const header in headers) {
            itemDataArray.push(item[headers[header]]);
        }

        csvString += itemDataArray.join(',') + '\n';
    })

    return csvString;
}

/**
 * Genera un código al azar de un largo determinado y chequea que sea único.
 * @param {int} length largo del código deseado
 * @param {*} stock stock actual para chequear los códigos actuales
 * @returns string con el código único.
 */
export function getUniqueCode(length, stock) {
    let codes = [];
    stock.items.forEach((item) => {
        codes.push(item.itemCode);
    });

    let code = Math.random().toString(36).slice(2, length + 2);

    if (codes.includes(code)){
        return getUniqueCode(length, stock);
    } else {
        return code;
    }
}

/**
 * Esta función chequea si alguno de los nombres de stockNames no está guardado en el sessionStorage. Si no lo esta, lo agrega.
 * Esto evita que al borrar el último ítem de un stock, ese stock se borre.
 * @param {Array} stockNames array de los nombres de los stock actualmente en los ítems
 */
export function updateStockNames(stockNames) {
    let oldNames = JSON.parse(sessionStorage.getItem('stock-names'));

    stockNames.forEach((name) => {
        !oldNames.includes(name) && oldNames.push(name);
    })

    sessionStorage.setItem('stock-names', JSON.stringify(oldNames));
}