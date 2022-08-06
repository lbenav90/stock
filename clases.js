class Item {
    // Objeto que contiene la información de un ítem del stock
    constructor(id, nombre, marca, cantidad, presentacion) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
    }
    increaseStock(){
        this.cantidad++;
    }
    decreaseStock(){
        this.cantidad--;
    }
    displayItem() {
        // Método que crea el HTML conteniendo la información del ítem.
        // Refactorizar en un custom element?
        let itemName = document.createElement('h3');
        itemName.innerText = this.nombre;

        let itemBrand = document.createElement('p');
        if (this.marca === '') {
            itemBrand.innerText = 'Marca: None';
        } else {
            itemBrand.innerText = `Marca: ${this.marca}`;
        }
        
        let itemQuantity = document.createElement('p');
        itemQuantity.innerText = `Cantidad: ${this.cantidad}`;
        
        let itemPresentation = document.createElement('p');
        itemPresentation.innerText = `Presentación: ${this.presentacion}`;

        let editButton = document.createElement('button');
        editButton.className = 'nav-but';
        editButton.innerText = 'Editar';
        this.addEditButtonEventListener(editButton);

        let showItemDiv = document.querySelector('#show-item-div');
        showItemDiv.innerHTML = '';
        showItemDiv.append(itemName, itemBrand, itemQuantity, itemPresentation, editButton);
    }
    addEditButtonEventListener(editButton) {
        // Agrega la funcionalidad del butón para editar la información del ítem.
        editButton.addEventListener('click', () => {
            let newForm = document.createElement('form-element');
            newForm.type = 'change';
            newForm.nombre = this.nombre;
            newForm.marca = this.marca;
            newForm.cantidad = this.cantidad;
            newForm.presentacion = this.presentacion;

            newForm.addEventListener('submit', (event) => {
                event.preventDefault();

                document.querySelector('#alerting-element-change').innerText = '';
                document.querySelectorAll('.alert-change-item-data').forEach((el) => {
                    el.innerText = '';
                })

                let nombre = newForm.querySelector('#item-nombre').value;
                let marca = newForm.querySelector('#item-marca').value;
                let cantidad = parseInt(newForm.querySelector('#item-cantidad').value);
                let presentacion = newForm.querySelector('#item-presentacion').value;

                if (!checkValidInputs(nombre, cantidad, presentacion, 'change')) return;

                let stock = new Stock();
                stock.getStockFromStorage();
                stock.changeParameters(this.id, nombre, marca, cantidad, presentacion);
                stock.saveStockInStorage();
                
                document.querySelector('#change-item-div').innerHTML = '';

                document.querySelector('#stock-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                stock.displayStock();
            })

            document.querySelector('#show-item-div').style.display = 'none';
            document.querySelector('#change-item-div').style.display = 'block';

            document.querySelector('#change-item-div').append(newForm);

        })
    }
    changeParameters(nombre, marca, cantidad, presentacion) {
        // Cambia los parámetros del ítem.
        // TODO: modificar para que sólo sea necesario poner lo que se desea cambiar.
        this.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
        this.marca = marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase();
        this.cantidad = cantidad;
        this.presentacion = presentacion.charAt(0).toUpperCase() + presentacion.slice(1).toLowerCase();
    }
}

class Stock {
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

        // Un header por cada propiedad del ítem. Modificar en el fututo cuando haya más categorías.
        for (const property in this.items[0]) {
            tableHeader = document.createElement('th');
            tableHeader.innerText = property.charAt(0).toUpperCase() + property.slice(1).toLowerCase();

            tableRow.append(tableHeader);
        }

        // Header vacío para el botón de borrar;
        tableHeader = document.createElement('th');
        tableRow.append(tableHeader);

        stockTableHead.append(tableRow);
        
        let tableData, deleteButton, editButton, quantityDiv;

        this.items.forEach((item) => {
            tableRow = document.createElement('tr');

            for (const property in item) {
                tableData = document.createElement('td');
                if (property === 'cantidad') {
                    quantityDiv = document.createElement('quantity-div');
                    quantityDiv.quantity = item[property];
                    quantityDiv.itemId = item.id

                    tableData.append(quantityDiv);
                } else if (item[property] == '') {
                    tableData.innerText = 'None';
                } else {
                    tableData.innerText = item[property];
                }

                tableRow.append(tableData);
            }

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

            editButton.addEventListener('click', (event) => {
                this.addEditButtonEventListener(editButton);

                event.stopPropagation();
            });

            tableData.append(editButton, deleteButton);

            tableRow.append(tableData);

            tableRow.addEventListener('click', () => {
                // Muestra la información del ítem seleccionado.
                document.querySelector('#stock-div').style.display = 'none';
                document.querySelector('#add-item-div').style.display = 'none';
                document.querySelector('#show-item-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

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
                newItem = new Item(item.id, item.nombre, item.marca,
                                   parseInt(item.cantidad),item.presentacion)

                this.items.push(newItem)
            })
        } else {
            this.items = [];
        }
    }
    changeParameters(id, nombre, marca, cantidad, presentacion) {
        let item = this.items[id - 1];
        item.changeParameters(nombre, marca, cantidad, presentacion);
    }
};