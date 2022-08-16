import Stock from './Stock.js'
import FormElement from '../customElements/FormElement.js'
import { checkValidInputs, showPage, getFormValues, emptyFormAlerts } from '../funciones.js';

!customElements.get('form-element')? customElements.define('form-element', FormElement): 1;

export default class Item {
    // Objeto que contiene la información de un ítem del stock
    constructor(id, name, brand, quantity, minQuantity, presentation, description, stockName, code) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.quantity = quantity;
        this.minQuantity = minQuantity || 1;
        this.presentation = presentation;
        this.description = description;
        this.stockName = stockName || 'main';
        this.code = code;
    }
    increaseStock(){
        this.quantity++;
    }
    decreaseStock(){
        // Evita que la cantidad se vaya a menos que cero
        if (this.quantity > 0) {
            this.quantity--;
            return true;
        } else {
            return false
        }
    }
    displayItem() {
        // Método que crea el HTML conteniendo la información del ítem.
        // Refactorizar en un custom element?
        let itemName = document.createElement('h3');
        itemName.innerText = this.name;

        let itemBrand = document.createElement('p');
        itemBrand.innerText = (this.brand === '')? 'Marca: None' : `Marca: ${this.brand}`;
        
        let itemQuantity = document.createElement('p');
        itemQuantity.innerText = `Cantidad: ${this.quantity}`;

        let itemMinQuantity = document.createElement('p');
        itemMinQuantity.innerText = `Cantidad mínima: ${this.minQuantity}`;
        
        let itemPresentation = document.createElement('p');
        itemPresentation.innerText = `Presentación: ${this.presentation}`;

        let itemDescription = document.createElement ('p');
        itemDescription.innerText = (this.description === '')? 'Descripción: None' : `Descripción: ${this.description}`;

        let itemStockName = document.createElement('p');
        itemStockName.innerText = `Stock: ${this.stockName}`;

        let editButton = document.createElement('button');
        editButton.className = 'btn btn-outline-secondary';
        editButton.innerText = 'Editar';
        this.addEditButtonEventListener(editButton);

        let delButton = document.createElement('button');
        delButton.className = 'btn btn-outline-secondary';
        delButton.innerText = 'Borrar';
        
        delButton.addEventListener('click', () => {
            let stock = new Stock();
            stock.getStockFromStorage()

            stock.deleteItem(this.code)
        })

        let showItemDiv = document.querySelector('#show-item-div');
        showItemDiv.innerHTML = '';

        let dataDiv = document.createElement('div');
        dataDiv.className = 'item-data-div'
        dataDiv.append(itemName, itemBrand, itemQuantity, itemMinQuantity, itemPresentation, itemDescription, itemStockName);

        let butDiv = document.createElement('div');
        butDiv.className = 'item-but-div';
        butDiv.append(editButton, delButton)

        showItemDiv.append(dataDiv, butDiv);
    }
    addEditButtonEventListener(editButton) {
        // Agrega la funcionalidad del butón para editar la información del ítem.
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();

            document.querySelector('#change-item-div').innerHTML = '';

            let newForm = document.createElement('form-element');
            newForm.type = 'change';
            newForm.name = this.name;
            newForm.brand = this.brand;
            newForm.quantity = this.quantity;
            newForm.minQuantity = this.minQuantity;
            newForm.presentation = this.presentation;
            newForm.description = this.description;
            newForm.stockName = this.stockName;

            newForm.addEventListener('submit', (event) => {
                event.preventDefault();

                emptyFormAlerts('change');

                let inputs = getFormValues();

                if (!checkValidInputs(this.id, ...inputs, 'change')) return;

                let stock = new Stock();
                stock.getStockFromStorage();
                stock.changeParameters(this.code, inputs);
                stock.saveStockInStorage();
                
                showPage('stock-div');

                stock.displayStock();
            })

            showPage('change-item-div');


            document.querySelector('#change-item-div').append(newForm);

            document.querySelector('#item-stockName').value = this.stockName;
            document.querySelector('#item-stockNameInput-row').style.display = 'none';

            document.querySelector('#item-stockName').addEventListener('change', () => {
                let selected = document.querySelector('#item-stockName').value;
                
                if (selected === 'new') { 
                    document.querySelector('#item-stockNameInput-row').style.display = 'table-row';
                } else {
                    document.querySelector('#item-stockNameInput-row').style.display = 'none';
                    document.querySelector('#item-stockNameInput-row').value = '';
                }
            })

            document.querySelector('#return-but').addEventListener('click', () => {
                showPage('stock-div');
    
                let stock = new Stock();
                stock.displayStock();
            })

        })
    }
    changeParameters(inputs) {
        // Cambia los parámetros del ítem.
        // TODO: modificar para que sólo sea necesario poner lo que se desea cambiar.
        [this.name, this.brand, this.quantity, this.minQuantity, this.presentation, this.description, this.stockName] = inputs;
    }
}