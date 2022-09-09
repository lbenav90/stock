import FormElement from '../customElements/FormElement.js'
import { checkValidInputs, showPage, getFormValues, displayStock, deleteItem, emptyFormAlerts } from '../funciones.js';
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

!customElements.get('form-element')? customElements.define('form-element', FormElement): 1;

export default class Item {
    // Objeto que contiene la información de un ítem del stock
    constructor(code, name, brand, quantity, minQuantity, presentation, description, category) {
        this.code = code;
        this.name = name;
        this.brand = brand;
        this.quantity = quantity;
        this.minQuantity = minQuantity || 1;
        this.presentation = presentation;
        this.description = description;
        this.category = category || null;
    }
    displayItem() {
        // Método que crea el HTML conteniendo la información del ítem.
        let itemName = document.createElement('h3');
        itemName.innerText = this.name;
        itemName.className = 'item-inner-data';

        let itemBrand = document.createElement('p');
        itemBrand.innerText = (this.brand === '')? 'Marca: ---' : `Marca: ${this.brand}`;
        itemBrand.className = 'item-inner-data';
        
        let itemQuantity = document.createElement('p');
        itemQuantity.innerText = `Cantidad: ${this.quantity}`;
        itemQuantity.className = 'item-inner-data';

        let itemMinQuantity = document.createElement('p');
        itemMinQuantity.innerText = `Cantidad mínima: ${this.minQuantity}`;
        itemMinQuantity.className = 'item-inner-data';
        
        let itemPresentation = document.createElement('p');
        itemPresentation.innerText = `Presentación: ${this.presentation}`;
        itemPresentation.className = 'item-inner-data';

        let itemDescription = document.createElement ('p');
        itemDescription.innerText = (this.description === '')? 'Descripción: ---' : `Descripción: ${this.description}`;
        itemDescription.className = 'item-inner-data';

        let itemCategory = document.createElement('p');
        itemCategory.innerText = `Categoría: ${this.category}`;
        itemCategory.className = 'item-inner-data';

        let editButton = document.createElement('button');
        editButton.className = 'btn btn-outline-secondary';
        editButton.innerText = 'Editar';
        this.addEditButtonEventListener(editButton);

        let delButton = document.createElement('button');
        delButton.className = 'btn btn-outline-secondary';
        delButton.innerText = 'Borrar';
        
        delButton.addEventListener('click', () => {
            deleteItem(this.code)
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
    addEditButtonEventListener(editButton) {
        // Agrega la funcionalidad del butón para editar la información del ítem.
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();

            showPage('change-item-div');

            document.querySelector('#change-item-div').innerHTML = '';

            let newForm = document.createElement('form-element');
            newForm.type = 'change';
            newForm.name = this.name;
            newForm.brand = this.brand;
            newForm.quantity = this.quantity;
            newForm.minQuantity = this.minQuantity;
            newForm.presentation = this.presentation;
            newForm.description = this.description;
            newForm.category = this.category;

            newForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                emptyFormAlerts('change');

                let inputs = getFormValues();
                
                if (!checkValidInputs(this.code, ...inputs, 'change')) return;

                let changedItem = new Item(this.code, ...inputs)

                const stockDB = await getDatabase();
                await set(ref(stockDB, `stock/items/${this.code}`), changedItem)             
                
                showPage('stock-div');

                displayStock();
            })

            document.querySelector('#change-item-div').append(newForm);

            document.querySelector('#item-category').value = this.category;
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
    changeParameters(inputs) {
        // Cambia los parámetros del ítem.
        // TODO: modificar para que sólo sea necesario poner lo que se desea cambiar.
        [this.name, this.brand, this.quantity, this.minQuantity, this.presentation, this.description, this.category] = inputs;
    }
}