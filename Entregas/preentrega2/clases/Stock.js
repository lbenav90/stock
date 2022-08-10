import QuantityDiv from '../customElements/QuantityDiv.js';
import { showPage } from '../funciones.js';
import Item from './Item.js'

!customElements.get('quantity-div')? customElements.define('quantity-div', QuantityDiv): 1;

export default class Stock {
    // Objeto que contiene los Items del stock. Contiene objetos de la clase Item
    constructor() {
        this.items = [];
    }
    length() {
        return this.items.length;
    }
    getItem(index) {
        let selected = this.items[index];

        return selected? selected : false; 
    }
    addNewItem(item) {
        this.items.push(item);
        this.saveStockInStorage();
    }
    deleteItem(index) {
        this.items.splice(index, 1);
        let newId = 1;

        // Cambia los id de los ítems para evitar agujeros
        this.items.forEach((item) => {
            item.id = newId;
            newId++;
        })
        this.saveStockInStorage();
    }
    displayStock() {
        // Método que arma la tabla de stock con todos los ítems

        // Borro lo que hay en la tabla anterior
        let stockTableHead = document.getElementById('stock-table-head');
        stockTableHead.innerHTML = '';

        let stockTableBody = document.getElementById('stock-table-body');
        stockTableBody.innerHTML = '';

        this.getStockFromStorage();

        // Si no hay ítems, muestro un texto que lo indica
        if (this.length() === 0) {
            document.querySelector('#empty-stock-alert').style.display = 'block';
            return;
        } else {
            document.querySelector('#empty-stock-alert').style.display = 'none';
        }

        let tableRow = document.createElement('tr');
        let tableHeader;

        // Sólo mostrar algunas propiedades del ítem en la tabla de stock
        let stockTableHeaders = {'Id': 'id', 'Nombre': 'name', 'Marca': 'brand', 'Cantidad': 'quantity', 'Presentación': 'presentation'};
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

        this.items.forEach((item) => {
            tableRow = document.createElement('tr');
            tableRow.className = 'stock-item-row';

            for (const header in stockTableHeaders) {
                let property = stockTableHeaders[header];

                tableData = document.createElement('td');

                if (property === 'quantity') {
                    quantityDiv = document.createElement('quantity-div');
                    quantityDiv.quantity = item.quantity;
                    quantityDiv.itemId = item.id

                    tableData.append(quantityDiv);
                } else if (item[property] == '') {
                    tableData.innerText = 'None';
                } else {
                    tableData.innerText = item[property];
                }

                tableRow.append(tableData);
            };

            tableData = document.createElement('td');
            deleteButton = document.createElement('button');
            deleteButton.className = 'stock-table-but';
            deleteButton.title = 'Borrar'
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16"><path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/></svg>';

            deleteButton.addEventListener('click', (event) => {
                this.deleteItem(this.items.indexOf(item));
                this.displayStock();

                // Evita que al hacer click se active el event listener de la fila
                event.stopPropagation();
            })

            editButton = document.createElement('button');
            editButton.className = 'stock-table-but';
            editButton.title = 'Editar'
            editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
            item.addEditButtonEventListener(editButton);

            tableData.append(editButton, deleteButton);

            tableRow.append(tableData);

            tableRow.addEventListener('click', () => {
                showPage('show-item-div');

                item.displayItem();
            })
            stockTableBody.append(tableRow);
        })
    }
    saveStockInStorage() {
        sessionStorage.setItem('stock', JSON.stringify(this.items))
    }
    getStockFromStorage() {
        let savedStock = JSON.parse(sessionStorage.getItem('stock'))
        let newItem;

        if (savedStock) {
            this.items = [];
            savedStock.forEach((item) => {
                newItem = new Item(item.id, item.name, item.brand, parseInt(item.quantity), parseInt(item.minQuantity),
                                   item.presentation, item.description, item.stockName);

                this.items.push(newItem)
            })
        } else {
            this.items = [];
        }
    }
    changeParameters(id, name, brand, quantity, minQuantity, presentation, description) {
        let item = this.items[id - 1];
        item.changeParameters(name, brand, quantity, minQuantity, presentation, description);
    }
};