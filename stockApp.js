import Stock from './clases/Stock.js';
import Item from './clases/Item.js';
import FormElement from './customElements/FormElement.js'
import { checkValidInputs, getFormValues, showPage, emptyFormAlerts, getCSVString, getUniqueCode } from "./funciones.js";

!customElements.get('form-element')? customElements.define('form-element', FormElement): //pass

document.addEventListener('DOMContentLoaded', () => {
    showPage('stock-div');

    let stock = new Stock();
    stock.displayStock();

    document.querySelector('#add-item-but').addEventListener('click', () => {
        showPage('add-item-div');

        // Creo un formulario en modo 'add' con un customElement
        let newForm = document.createElement('form-element');
        
        newForm.addEventListener('submit', (event) => {
            event.preventDefault()

            emptyFormAlerts('add');
            
            let inputs = getFormValues();
            
            // Si hay un input inválido, usa los elementos de alerta y finaliza la ejecución
            if (!checkValidInputs(-1, ...inputs, 'add')) return;
            
            // Defino un nuevo Item y muestro el stock
            let newItemCode = getUniqueCode(5, stock);
            let newItem = new Item(stock.length() + 1, ...inputs, 'main', newItemCode)
            stock.addNewItem(newItem);
            
            showPage('stock-div');
            stock.displayStock();
        });

        document.querySelector('#add-item-div').append(newForm);
        
        // Boton para volver al stock
        document.querySelector('#return-but').addEventListener('click', () => {
            showPage('stock-div');
    
            stock.displayStock();
        })
    })

    document.querySelector('#show-stock-but').addEventListener('click', () => {
        showPage('stock-div');

        stock.displayStock();
    });      
    
    document.querySelector('#prep-order-but').addEventListener('click', () => {
        showPage('low-stock-div');

        // Busco el stock actualizado e itero sobre sus elementos, tomando aquellos con cantidades menores a su cantidad mínima
        stock = new Stock();
        stock.getStockFromStorage();

        let lowStockItems = [];

        stock.items.forEach((item) => {

            item.quantity <= item.minQuantity && lowStockItems.push(item);

        })

        // Si no hay ítems para pedir, muestro un texto que lo indica
        if (lowStockItems.length === 0) {
            document.querySelector('#no-low-stock-alert').style.display = 'block';
            return;
        } else {
            document.querySelector('#no-low-stock-alert').style.display = 'none';        
        };

        let lowStockTableHead = document.querySelector('#low-stock-table-head');
        let lowStockTableBody = document.querySelector('#low-stock-table-body');

        let tableRow = document.createElement('tr');
        let tableHeader;

        // Sólo mostrar algunas propiedades del ítem en la tabla de bajo stock
        // Este objeto me permite iterar y poner nombres de columnas y acceder a las propiedades de Item (en inglés)
        let lowStockTableHeaders = {'Id':           'id', 
                                    'Nombre':       'name', 
                                    'Marca':        'brand', 
                                    'Cantidad':     'quantity', 
                                    'Presentación': 'presentation'};

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

            let csvFile = new Blob([csvString], {
                type: 'csv',
                name: 'pedido.csv'
            });

            saveAs(csvFile, 'pedido.csv');
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

                // Para campos no obligatorios, poner "Vacío" si no se ingresaron datos
                tableData.innerText = (item[property] === '')? 'Vacío' : item[property];

                tableRow.append(tableData);
            };
            lowStockTableBody.append(tableRow);
        })
    })
})