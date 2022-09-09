import QuantityDiv from './customElements/QuantityDiv.js';
import { getDatabase, ref, set, remove, get } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

!customElements.get('quantity-div')? customElements.define('quantity-div', QuantityDiv): 1;

/**
 * Checks if the inputs have a base validity and checks for mandatory fields.
 * @param inputs - values entered to form
 * @returns bool - if the inputs are valid or not
 */
export function checkValidInputs(code, name, brand, quantity, minQuantity, presentation, description, category, type) {
    if ((isNaN(quantity) || quantity <= 0) || (isNaN(minQuantity) && quantity <= 0) || name === '' || category === '') {
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
        if (category === '') {
            document.querySelector(`#alerting-element-${type}`).innerText += 'Ingresar una categoría\n';
            document.querySelector(`#alert-category-data`).innerText += '*';
        }
        return false;
    }

    const currentStock = JSON.parse(sessionStorage.getItem('current-stock'))

    let uniqueItems = true;

    // No deja agregar un ítem que tiene el mismo nombre, marca y presentación que uno ya existente
    for (const itemCode in currentStock) {
        let item = currentStock[itemCode];

        if (type === 'change' && code === item.code){
            // Esto evita chequear un ítem consigo mismo en modo EDITAR
            continue;
        } else if (name.toLowerCase().trim() === item.name.toLowerCase() && 
                   brand.toLowerCase().trim() === item.brand.toLowerCase() && 
                   presentation.toLowerCase().trim() === item.presentation.toLowerCase()) {   

            document.querySelector(`#alerting-element-${type}`).innerText += 'Ítem ya existente\n';
            uniqueItems = false;
        }
    }

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

    document.querySelector('#search-bar').value = '';

    if (!divClasses.includes(divClassShow)) {
        return false;
    }

    if (['stock-div', 'low-stock-div'].includes(divClassShow)) {
        document.querySelector('#filter-nav').style.display = 'block';
    } else {
        document.querySelector('#filter-nav').style.display = 'none';
        document.querySelector('#order-by').value = 'name'; 
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
    let category = document.querySelector('#item-category').value;

    // Si el usuario eligió un nuevo nombre de stock, ir a buscarlo
    category = (category === 'new')? document.querySelector('#item-newCategory').value.toLowerCase(): category;

    return [name, brand, quantity, minQuantity, presentation, description, category];
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

    csvString += Object.keys(headers).join(',') + '\n';

    let data, itemDataArray
    items.forEach((item) => {
        itemDataArray = [];
        for (const header in headers) {
            data = item[headers[header]]
            itemDataArray.push(data? data : '---');
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
export function getUniqueCode(length) {
    let code = Math.random().toString(36).slice(2, length + 2);

    const currentStock = JSON.parse(sessionStorage.getItem('current-stock')) || [];

    const currentCodes = Object.keys(currentStock)

    if (currentCodes.includes(code)){
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
export function updateCategories(categories) {
    sessionStorage.setItem('stock-categories', JSON.stringify(categories))
}

export async function displayStock() {
    showPage('stock-div');

    document.querySelector('#filter-nav').style.visibility = 'hidden';
    // Borro lo que hay en la tabla anterior
    let stockTableHead = document.getElementById('stock-table-head');
    stockTableHead.innerHTML = '';

    let stockTableBody = document.getElementById('stock-table-body');
    stockTableBody.innerHTML = '';

    document.querySelector('#empty-stock-alert').style.display = 'none';

    const stockDB = await getDatabase();
    const stockStatusRef = await ref(stockDB, 'stock/empty');
    const stockStatus = await get(stockStatusRef);

    if (stockStatus.val()) {
        document.querySelector('#empty-stock-alert').style.display = 'block';
        return; 
    } 
    
    const stockDBRef = await ref(stockDB, 'stock/items')
    const currentStockSnapshot = await get(stockDBRef)
    const currentStock = currentStockSnapshot.val();

    sessionStorage.setItem('current-stock', JSON.stringify(currentStock))

    let tableRow = document.createElement('tr');
    let tableHeader;

    // Sólo mostrar algunas propiedades del ítem en la tabla de stock
    let stockTableHeaders = {'Nombre': 'name', 
                             'Marca': 'brand', 
                             'Cantidad': 'quantity', 
                             'Presentación': 'presentation',
                             'Descripción':  'description'};

    for (const header in stockTableHeaders) {
        tableHeader = document.createElement('th');
        tableHeader.innerText = header;

        tableRow.append(tableHeader);
    };

    // Header vacío para los botones de acción
    tableHeader = document.createElement('th');
    tableRow.append(tableHeader);

    stockTableHead.append(tableRow);
    
    let tableData, deleteButton, editButton, quantityDiv;
    let categories = [];

    let items = Object.values(currentStock);

    items.forEach((item) => {

        !categories.includes(item.category) && categories.push(item.category);

        tableRow = document.createElement('tr');
        tableRow.className = 'stock-item-row';
        tableRow.id = `stock-item-${item.code}-row`;

        for (const header in stockTableHeaders) {
            let property = stockTableHeaders[header];

            tableData = document.createElement('td');
            tableData.className = 'item-data';

            if (property === 'quantity') {
                quantityDiv = document.createElement('quantity-div');
                quantityDiv.quantity = item.quantity;
                quantityDiv.itemCode = item.code

                tableData.append(quantityDiv);
            } else if (item[property] == '') {
                tableData.innerText = '---';
            } else {
                tableData.innerText = item[property];
            }

            tableRow.append(tableData);
        };

        tableData = document.createElement('td');
        tableData.className = 'item-data';

        deleteButton = document.createElement('button');
        deleteButton.className = 'stock-table-but';
        deleteButton.id = `stock-item-${item.code}-del-but`
        deleteButton.title = 'Borrar'
        deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/></svg>';

        deleteButton.addEventListener('click', async (event) => {
            event.stopPropagation();

            await deleteItem(item.code);
        })

        editButton = document.createElement('button');
        editButton.className = 'stock-table-but';
        editButton.id = `stock-item-${item.code}-edit-but`
        editButton.title = 'Editar'
        editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
        addEditButtonEventListener(editButton, item);

        tableData.append(editButton, deleteButton);

        tableRow.append(tableData);

        tableRow.addEventListener('click', () => {
            showPage('show-item-div');

            const currentStock = JSON.parse(sessionStorage.getItem('current-stock'));
            const updatedItem = currentStock[item.code];
            
            displayItem(updatedItem);
        })
        stockTableBody.append(tableRow);
    });

    updateCategories(categories);
    let categorySelect = document.querySelector('#category-select');
    categorySelect.innerHTML = '';

    let newCategory = document.createElement('option');
    newCategory.value = 'all';
    newCategory.innerText = 'Todos';

    categorySelect.append(newCategory);

    categories.forEach((category) => {
        newCategory = document.createElement('option');
        newCategory.value = category;
        newCategory.innerText = category;

        categorySelect.append(newCategory);
    })

    categorySelect.addEventListener('change', () => {
        let selected = document.querySelector('#category-select').value;
        let tableRows = document.querySelectorAll('.stock-item-row');
        let currentStock = JSON.parse(sessionStorage.getItem('current-stock'));
        const query = document.querySelector('#search-bar').value.toLowerCase();
        let itemCode, itemCategory, searchHit;
        
        tableRows.forEach((row) => {
            itemCode = row.id.split('-')[2];
            itemCategory = currentStock[itemCode].category;
            searchHit = false;

            if (query === '') {
                if (selected === 'all' || itemCategory === selected) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            } else {
                tableData = row.querySelectorAll('td');
                tableData.forEach((cell) => {
                    if(cell.innerText.toLowerCase().includes(query)) {
                        searchHit = true;
                    }
                });

                if (searchHit && (selected === 'all' || itemCategory === selected)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            }
        })
    })

    document.querySelector('#filter-nav').style.visibility = 'visible';
}

export function prepLowStockOrder(order = 'name') {
    showPage('low-stock-div');

    const currentStock = JSON.parse(sessionStorage.getItem('current-stock'));

    let lowStockItems = [];
    let item;

    for (const itemCode in currentStock) {
        item = currentStock[itemCode];

        item.quantity <= item.minQuantity && lowStockItems.push(item);

    }

    // Si no hay ítems para pedir, muestro un texto que lo indica
    if (lowStockItems.length === 0) {
        document.querySelector('#no-low-stock-alert').style.display = 'block';
        return;
    } else {
        document.querySelector('#no-low-stock-alert').style.display = 'none';        
    };

    let orderBy = document.querySelector('#order-by').value;
    lowStockItems.sort((a,b) => {
        if (a[orderBy] > b[orderBy]){
            return 1
        } else if (a[orderBy] < b[orderBy]) {
            return -1
        }
        return 0;
    })

    let lowStockTableHead = document.querySelector('#low-stock-table-head');
    let lowStockTableBody = document.querySelector('#low-stock-table-body');

    let tableRow = document.createElement('tr');
    let tableHeader;

    // Sólo mostrar algunas propiedades del ítem en la tabla de bajo stock
    // Este objeto me permite iterar y poner nombres de columnas y acceder a las propiedades de Item (en inglés)
    let lowStockTableHeaders = {'Nombre':       'name', 
                                'Marca':        'brand', 
                                'Cantidad':     'quantity', 
                                'Presentación': 'presentation',
                                'Descripción':  'description'};

    // Creo los headers de la tabla
    for (const header in lowStockTableHeaders) {
        tableHeader = document.createElement('th');
        tableHeader.innerText = header;

        tableRow.append(tableHeader);
    };

    let exportBut = document.createElement('button');
    exportBut.className = 'btn btn-outline-secondary';
    exportBut.id = 'export-but';
    exportBut.innerText = 'Exportar';
    exportBut.addEventListener('click', () => {
        let csvString = getCSVString(lowStockTableHeaders, lowStockItems);

        let csvFile = new Blob(["\ufeff", csvString], {
            type: 'csv',
            name: 'pedido.csv'
        });

        saveAs(csvFile, 'pedido.csv', {type: "text/csv;charset=ISO-8859-1"});
    })

    tableRow.append(exportBut);
    lowStockTableHead.append(tableRow);
    
    let tableData, property;

    // Agrego una línea con su información por cada ítem con bajo stock
    lowStockItems.forEach((item) => {
        tableRow = document.createElement('tr');
        tableRow.className = 'stock-item-row';
        tableRow.id = `stock-item-${item.code}-row`;

        for (const header in lowStockTableHeaders) {
            property = lowStockTableHeaders[header];

            tableData = document.createElement('td');
            tableData.className = 'item-data';

            // Para campos no obligatorios, poner "---" si no se ingresaron datos
            tableData.innerText = (item[property] === '')? '---' : item[property];

            tableRow.append(tableData);
        };
        lowStockTableBody.append(tableRow);
    })
}

export async function deleteItem(code) {
    const currentStock = JSON.parse(sessionStorage.getItem('current-stock'));
    const delItem = currentStock[code];

    swal({
        title: '¿Desea borrar el siguiente ítem?\n ',
        text: `${delItem.name} - ${delItem.brand}`,
        icon: 'warning',
        buttons: {
            confirm: 'Confirmar',
            cancel: 'Cancelar'
        }
    }).then(async (response) => {
        if (response) {
    
            const stockDB = await getDatabase();
            await remove(ref(stockDB, `stock/items/${code}`))
            
            if (Object.keys(JSON.parse(sessionStorage.getItem('current-stock'))).length === 1) {
                await set(ref(stockDB, 'stock/empty'), true)
            }
            
            await displayStock();

            Toastify({
                text: 'Ítem borrado',
                duration: 2000,
                stopOnFocus: false,
                position: 'right',
                style: {
                    height: '40px',
                    width: '130px',
                    background: '#b6b6b6',
                    borderRadius: '20px',
                    fontSize: '10pt',
                    fontWeight: 'bold'
                }
            }).showToast();
        }
    })
}

export async function addNewItem(item) { 
    const stockDB = getDatabase();
    set(ref(stockDB, `stock/items/${item.code}`), item)
    set(ref(stockDB, 'stock/empty'), false)
}

function displayItem(item) {
    let itemName = document.createElement('h3');
    itemName.innerText = item.name;
    itemName.className = 'item-inner-data';

    let itemBrand = document.createElement('p');
    itemBrand.innerText = (item.brand === '')? 'Marca: ---' : `Marca: ${item.brand}`;
    itemBrand.className = 'item-inner-data';
    
    let itemQuantity = document.createElement('p');
    itemQuantity.innerText = `Cantidad: ${item.quantity}`;
    itemQuantity.className = 'item-inner-data';

    let itemMinQuantity = document.createElement('p');
    itemMinQuantity.innerText = `Cantidad mínima: ${item.minQuantity}`;
    itemMinQuantity.className = 'item-inner-data';
    
    let itemPresentation = document.createElement('p');
    itemPresentation.innerText = `Presentación: ${item.presentation}`;
    itemPresentation.className = 'item-inner-data';

    let itemDescription = document.createElement ('p');
    itemDescription.innerText = (item.description === '')? 'Descripción: ---' : `Descripción: ${item.description}`;
    itemDescription.className = 'item-inner-data';

    let itemCategory = document.createElement('p');
    itemCategory.innerText = `Categoría: ${item.category}`;
    itemCategory.className = 'item-inner-data';

    let editButton = document.createElement('button');
    editButton.className = 'btn btn-outline-secondary';
    editButton.innerText = 'Editar';
    addEditButtonEventListener(editButton, item);    

    let delButton = document.createElement('button');
    delButton.className = 'btn btn-outline-secondary';
    delButton.innerText = 'Borrar';
    
    delButton.addEventListener('click', () => {
        deleteItem(item.code)
    })

    let showItemDiv = document.querySelector('#show-item-div');
    showItemDiv.innerHTML = '';

    let dataDiv = document.createElement('div');
    dataDiv.className = 'item-data-div'
    dataDiv.append(itemName, itemBrand, itemQuantity, itemMinQuantity, itemPresentation, itemDescription, itemCategory);

    let butDiv = document.createElement('div');
    butDiv.className = 'item-but-div';
    butDiv.append(editButton, delButton)

    showItemDiv.append(dataDiv, butDiv);
}

function addEditButtonEventListener(editButton, item) {
    editButton.addEventListener('click', (event) => {
        event.stopPropagation();

        showPage('change-item-div');

        document.querySelector('#change-item-div').innerHTML = '';

        let newForm = document.createElement('form-element');
        newForm.type = 'change';
        newForm.name = item.name;
        newForm.brand = item.brand;
        newForm.quantity = item.quantity;
        newForm.minQuantity = item.minQuantity;
        newForm.presentation = item.presentation;
        newForm.description = item.description;
        newForm.category = item.category;

        newForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            emptyFormAlerts('change');

            let inputs = getFormValues();
            
            if (!checkValidInputs(item.code, ...inputs, 'change')) return;

            let changedItem = {
                code: item.code,
                name: inputs[0],
                brand: inputs[1],
                quantity: inputs[2],
                minQuantity: inputs[3],
                presentation: inputs[4],
                description: inputs[5],
                category: inputs[6]
            }

            const stockDB = await getDatabase();
            await set(ref(stockDB, `stock/items/${item.code}`), changedItem)             
            
            showPage('stock-div');

            displayStock();
        })

        document.querySelector('#change-item-div').append(newForm);

        document.querySelector('#item-category').value = item.category;
        document.querySelector('#item-newCategory-row').style.display = 'none';

        document.querySelector('#item-category').addEventListener('change', () => {
            let selected = document.querySelector('#item-category').value;
            
            if (selected === 'new') { 
                document.querySelector('#item-newCategory-row').style.display = 'table-row';
            } else {
                document.querySelector('#item-newCategory-row').style.display = 'none';
                document.querySelector('#item-newCategory-row').value = '';
            }
        })

        document.querySelector('#return-but').addEventListener('click', () => {
            showPage('stock-div');

            displayStock();
        })
    })    
}