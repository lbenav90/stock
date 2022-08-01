class Item {
    // Objeto que contiene la información de un ítem del stock
    constructor(id, nombre, marca, cantidad, presentacion) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
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

                let itemName = document.createElement('h3');
                itemName.innerText = item.nombre;

                let itemBrand = document.createElement('p');
                if (item.marca === '') {
                    itemBrand.innerText = `Marca: None`;
                } else {
                    itemBrand.innerText = `Marca: ${item.marca}`;
                }
                
                let itemQuantity = document.createElement('p');
                itemQuantity.innerText = `Cantidad: ${item.cantidad}`;
                
                let itemPresentation = document.createElement('p');
                itemPresentation.innerText = `Presentación: ${item.presentacion}`;

                let showItemDiv = document.querySelector('#show-item-div');
                showItemDiv.innerHTML = '';
                showItemDiv.append(itemName, itemBrand, itemQuantity, itemPresentation);
            })
            
            stockTableBody.append(tableRow);
        })

        return 1;
    }
};