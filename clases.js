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
            let clonedForm = document.querySelector('#add-item-form').cloneNode(true);

            clonedForm.querySelector('#add-item-submit-input').value = 'Guardar';

            clonedForm.querySelectorAll('.alert-add-item-data').forEach((td) => {
                td.className = 'alert-change-item-data';
                let aux = td.id.split('-')
                aux[2] = 'change'
                td.id = aux.join('-');
            })
            clonedForm.querySelector('#alerting-element-add').id = 'alerting-element-change'

            clonedForm.querySelector('#item-nombre').value = this.nombre;
            clonedForm.querySelector('#item-marca').value = this.marca;
            clonedForm.querySelector('#item-cantidad').value = this.cantidad;
            clonedForm.querySelector('#item-presentacion').value = this.presentacion;

            clonedForm.addEventListener('submit', handleForm);

            clonedForm.addEventListener('submit', () => {

                document.querySelector('#alerting-element-change').innerText = '';
                document.querySelectorAll('.alert-change-item-data').forEach((el) => {
                    el.innerText = '';
                })

                let nombre = clonedForm.querySelector('#item-nombre').value;
                let marca = clonedForm.querySelector('#item-marca').value;
                let cantidad = parseInt(clonedForm.querySelector('#item-cantidad').value);
                let presentacion = clonedForm.querySelector('#item-presentacion').value;

                if (!checkValidInputs(nombre, cantidad, presentacion, 'change')) return;

                this.changeParameters(nombre, marca, cantidad, presentacion);
                
                document.querySelector('#change-item-div').innerHTML = '';

                document.querySelector('#show-item-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                this.displayItem();
            })

            document.querySelector('#show-item-div').style.display = 'none';
            document.querySelector('#change-item-div').style.display = 'block';

            let title = document.createElement('h3')
            title.innerText = 'Modificar un ítem';
            let separador = document.createElement('br');

            document.querySelector('#change-item-div').append(title, separador, clonedForm);

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
        if (this.length() === 0) {
            return 0;
        } else {
            document.querySelector('#empty-stock-alert').style.display = 'none';
        }

        let stockTableHead = document.getElementById('stock-table-head');

        stockTableHead.innerHTML = '';

        let tableRow = document.createElement('tr');
        let tableHeader;

        for (const property in this.items[0]) {
            tableHeader = document.createElement('th');
            tableHeader.innerText = property.charAt(0).toUpperCase() + property.slice(1).toLowerCase();

            tableRow.append(tableHeader);
        }

        stockTableHead.append(tableRow);

        let stockTableBody = document.getElementById('stock-table-body');
        stockTableBody.innerHTML = '';
        
        let tableData;

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

            tableRow.addEventListener('click', () => {
                document.querySelector('#stock-div').style.display = 'none';
                document.querySelector('#add-item-div').style.display = 'none';
                document.querySelector('#show-item-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                item.displayItem();
            
            })
            stockTableBody.append(tableRow);
        })

        return 1;
        
    }
};