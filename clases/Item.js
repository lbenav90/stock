import Stock from './Stock.js'
import FormElement from '../customElements/FormElement.js'

!customElements.get('form-element')? customElements.define('form-element', FormElement): 1;

export default class Item {
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
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();

            document.querySelector('#change-item-div').innerHTML = '';

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

                if (!checkValidInputs(nombre, marca, cantidad, presentacion, 'change')) return;

                let stock = new Stock();
                stock.getStockFromStorage();
                stock.changeParameters(this.id, nombre, marca, cantidad, presentacion);
                stock.saveStockInStorage();
                
                document.querySelector('#change-item-div').innerHTML = '';

                document.querySelector('#stock-div').style.display = 'block';
                document.querySelector('#change-item-div').style.display = 'none';

                stock.displayStock();
            })

            document.querySelector('#stock-div').style.display = 'none';
            document.querySelector('#add-item-div').style.display = 'none';
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