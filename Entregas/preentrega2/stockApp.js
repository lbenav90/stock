import Stock from './clases/Stock.js';
import Item from './clases/Item.js';
import FormElement from './customElements/FormElement.js'
import { checkValidInputs, cleanUpString, showPage} from "./funciones.js";

!customElements.get('form-element')? customElements.define('form-element', FormElement): 1;

document.addEventListener('DOMContentLoaded', () => {
    
    let stock = new Stock();

    stock.displayStock();

    document.querySelector('#add-item-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        showPage('add-item-div')

        // Creo un formulario en modo 'add'
        let newForm = document.createElement('form-element');
        
        newForm.addEventListener('submit', (event) => {
            event.preventDefault()

            // Borro contenidos de los elementos de alerta
            document.querySelector('#alerting-element-add').innerText = '';
            document.querySelectorAll('.alert-add-item-data').forEach((el) => {
                el.innerText = '';
            })
            
            let name = document.querySelector('#item-name').value.trim();
            let brand = document.querySelector('#item-brand').value.trim();
            let quantity = parseInt(document.querySelector('#item-quantity').value);
            let minQuantity = parseInt(document.querySelector('#item-minQuantity').value);
            let presentation = document.querySelector('#item-presentation').value.trim();
            let description = document.querySelector('#item-description').value.trim();
            
            // Si hay un input inválido, usa los elementos de alerta y finaliza la ejecución
            if (!checkValidInputs(-1, name, brand, quantity, minQuantity, presentation, 'add')) return;
            
            // Defino un nuevo Item
            let newItem = new Item(stock.length() + 1, cleanUpString(name), cleanUpString(brand),
                                   quantity, minQuantity, cleanUpString(presentation), cleanUpString(description), 'main')
            stock.addNewItem(newItem);
            
            showPage('stock-div');
            
            stock.displayStock();
        });
        
        document.querySelector('#add-item-div').append(newForm);
        
        // Vacío los inputs
        document.querySelector('#item-name').value = '';
        document.querySelector('#item-brand').value = '';
        document.querySelector('#item-quantity').value = '';
        document.querySelector('#item-minQuantity').value = '';
        document.querySelector('#item-presentation').value = '';
        document.querySelector('#item-description').value = '';

        document.querySelector('#alerting-element-add').innerText = ''
        document.querySelectorAll('.alert-add-item-data').forEach((el) => {
            el.innerText = '';
        });
    })

    document.querySelector('#show-stock-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        showPage('stock-div');

        stock.getStockFromStorage();
        stock.displayStock();
    });      
    
    document.querySelector('#prep-order-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        showPage('low-stock-div');

        stock = new Stock();
        stock.getStockFromStorage();

        let lowStockItems = [];

        stock.items.forEach((item) => {

            item.quantity <= item.minQuantity && lowStockItems.push(item);

        })

        let lowStockDiv = document.querySelector('#low-stock-div');

        // Si no hay ítems para pedir, muestro un texto que lo indica
        if (lowStockItems.length === 0) {
            let noLowStock = document.createElement('h4');
            noLowStock.innerText = 'No hay ítems con bajo stock!';
            lowStockDiv.append(noLowStock);
            return;
        } else {
            let lowStockTable = document.createElement('table');
            lowStockTable.className = 'table table-hover';

            let lowStockTableHead = document.createElement('thead');
            lowStockTableHead.id = 'low-stock-table-head';
            let lowStockTableBody = document.createElement('tbody');
            lowStockTableBody.id = 'low-stock-table-body';

            lowStockTable.append(lowStockTableHead, lowStockTableBody);
            lowStockDiv.append(lowStockTable);
        };

        let lowStockTableHead = document.querySelector('#low-stock-table-head');
        let lowStockTableBody = document.querySelector('#low-stock-table-body');

        let tableRow = document.createElement('tr');
        let tableHeader;

        // Sólo mostrar algunas propiedades del ítem en la tabla de bajo stock
        let lowStockTableHeaders = {'Id':           'id', 
                                    'Nombre':       'name', 
                                    'Marca':        'brand', 
                                    'Cantidad':     'quantity', 
                                    'Presentación': 'presentation'};

        for (const header in lowStockTableHeaders) {
            tableHeader = document.createElement('th');
            tableHeader.innerText = header;

            tableRow.append(tableHeader);
        };

        lowStockTableHead.append(tableRow);
        
        let tableData, property;

        lowStockItems.forEach((item) => {
            tableRow = document.createElement('tr');
            tableRow.className = 'stock-item-row';

            for (const header in lowStockTableHeaders) {
                property = lowStockTableHeaders[header];

                tableData = document.createElement('td');

                tableData.innerText = (item[property] === '')? 'None' : item[property];

                tableRow.append(tableData);
            };
            lowStockTableBody.append(tableRow);
        })
    })
})