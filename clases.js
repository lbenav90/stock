class Item {
    // Objeto que contiene la información de un ítem del stock
    constructor(id, nombre, marca, cantidad, presentacion) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
    }
    displayItem() {
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
        editButton.addEventListener('click', () => {
            let newForm = document.createElement('form-element');
            newForm.type = 'change';
            newForm.nombre = this.nombre;
            newForm.marca = this.marca;
            newForm.cantidad = this.cantidad;
            newForm.presentacion = this.presentacion;

            newForm.addEventListener('submit', handleForm);

            newForm.addEventListener('submit', () => {

                document.querySelector('#alerting-element-change').innerText = '';
                document.querySelectorAll('.alert-change-item-data').forEach((el) => {
                    el.innerText = '';
                })

                let nombre = newForm.querySelector('#item-nombre').value;
                let marca = newForm.querySelector('#item-marca').value;
                let cantidad = parseInt(newForm.querySelector('#item-cantidad').value);
                let presentacion = newForm.querySelector('#item-presentacion').value;

                if (!checkValidInputs(nombre, cantidad, presentacion, 'change')) return;

                this.changeParameters(nombre, marca, cantidad, presentacion);
                
                document.querySelector('#change-item-div').innerHTML = '';

                document.querySelector('#show-item-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                this.displayItem();
            })

            document.querySelector('#show-item-div').style.display = 'none';
            document.querySelector('#change-item-div').style.display = 'block';

            document.querySelector('#change-item-div').append(newForm);

        })
    }
    changeParameters(nombre, marca, cantidad, presentacion) {
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

        if (selected) {
            return selected;
        } else {
            return false;
        }
    }
    addNewItem(item) {
        this.items.push(item);
    }
    deleteItem(index) {
        this.items.splice(index, 1);
    }
    displayStock() {
        let stockTableHead = document.getElementById('stock-table-head');
        stockTableHead.innerHTML = '';

        let stockTableBody = document.getElementById('stock-table-body');
        stockTableBody.innerHTML = '';

        if (this.length() === 0) {
            document.querySelector('#empty-stock-alert').style.display = 'block';
            return 0;
        } else {
            document.querySelector('#empty-stock-alert').style.display = 'none';
        }

        let tableRow = document.createElement('tr');
        let tableHeader;

        for (const property in this.items[0]) {
            tableHeader = document.createElement('th');
            tableHeader.innerText = property.charAt(0).toUpperCase() + property.slice(1).toLowerCase();

            tableRow.append(tableHeader);
        }

        tableHeader = document.createElement('th');
        tableRow.append(tableHeader);


        stockTableHead.append(tableRow);
        
        let tableData, deleteButton;
        let itemIndex = 0;

        this.items.forEach((item) => {
            tableRow = document.createElement('tr');

            for (const property in item) {
                tableData = document.createElement('td');
                if (item[property] == '') {
                    tableData.innerText = 'None';
                } else {
                    tableData.innerText = item[property];
                }

                tableRow.append(tableData);
            }

            tableData = document.createElement('td');
            deleteButton = document.createElement('button');
            deleteButton.className = 'del-but';
            deleteButton.innerText = 'Borrar';

            deleteButton.addEventListener('click', (event) => {
                this.deleteItem(this.items.indexOf(item));
                this.displayStock();
                event.stopPropagation();
            })

            tableData.append(deleteButton);

            tableRow.append(tableData);

            tableRow.addEventListener('click', () => {
                document.querySelector('#stock-div').style.display = 'none';
                document.querySelector('#add-item-div').style.display = 'none';
                document.querySelector('#show-item-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                item.displayItem();
            
            })
            stockTableBody.append(tableRow);
            itemIndex++;
        })

        return 1;
        
    }
};