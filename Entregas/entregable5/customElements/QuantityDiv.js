import Stock from '../clases/Stock.js'
import { showPage } from '../funciones.js'

/**
 * Esta clase define un customElement para usar en la tabla de stock
 * Contiene la cantidad del ítem en stock y dos botones, para aumentar y baar el stock, con sus funcionalidades agregadas
 */
export default class QuantityDiv extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '';
        
        let quantity = this.getAttribute('quantity') || 0;
        let itemCode = this.getAttribute('itemCode') || null;

        let div = document.createElement('div');
        div.className = 'quantity-div';

        let span = document.createElement('span');
        span.className = 'quantity-span';
        span.innerText = quantity;

        let butDiv = document.createElement('div');
        butDiv.className = 'quantity-but-div';
        
        // Boton para aumentar el stock
        let plus = document.createElement('button');
        plus.className = 'quantity-but quantity-plus';
        plus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>';
        
        plus.addEventListener('click', (event) => {
            event.stopPropagation();

            let stock = new Stock();
            stock.getStockFromStorage();
            stock.getItem(itemCode).increaseStock();
            quantity++;
            
            this.setAttribute('quantity', quantity)
            stock.saveStockInStorage();

            // Cambio el event listener porque si no, muestra la información del ítem antes de editar
            this.parentElement.parentElement.removeEventListener('click', () => {
                showPage('show-item-div');
                item.displayItem();
            })
            this.parentElement.parentElement.addEventListener('click', () => {
                showPage('show-item-div');
                stock.getItem(itemCode).displayItem();
            })

            let editButton = document.querySelector(`#stock-item-${itemCode}-edit-but`)
            editButton.removeEventListener('click', (event) => {
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

                newForm.addEventListener('submit', (event) => {
                    event.preventDefault();

                    emptyFormAlerts('change');

                    let inputs = getFormValues();

                    if (!checkValidInputs(this.id, ...inputs, 'change')) return;

                    let stock = new Stock();
                    stock.getStockFromStorage();
                    stock.changeParameters(this.id, inputs);
                    stock.saveStockInStorage();
                    
                    showPage('stock-div');

                    stock.displayStock();
                })

                showPage('change-item-div');


                document.querySelector('#change-item-div').append(newForm);

                document.querySelector('#return-but').addEventListener('click', () => {
                    showPage('stock-div');
        
                    let stock = new Stock();
                    stock.displayStock();
                })

            })

            stock.getItem(itemCode).addEditButtonEventListener(editButton);

            this.connectedCallback();
        })

        // Boton para bajar el stock
        let minus = document.createElement('button');
        minus.className = 'quantity-but quantity-minus'
        minus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>';
        
        minus.addEventListener('click', (event) => {
            event.stopPropagation();

            let stock = new Stock();
            stock.getStockFromStorage();
            
            if (stock.getItem(itemCode).decreaseStock()) {
                quantity--;
                stock.saveStockInStorage()
    
                this.setAttribute('quantity', quantity)

                // Cambio el event listener porque si no, muestra la información del ítem antes de editar
                this.parentElement.parentElement.removeEventListener('click', () => {
                    showPage('show-item-div');
                    item.displayItem();
                })
                this.parentElement.parentElement.addEventListener('click', () => {
                    showPage('show-item-div');
                    stock.getItem(itemCode).displayItem();
                })

                let editButton = document.querySelector(`#stock-item-${itemCode}-edit-but`)
            editButton.removeEventListener('click', (event) => {
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

                newForm.addEventListener('submit', (event) => {
                    event.preventDefault();

                    emptyFormAlerts('change');

                    let inputs = getFormValues();

                    if (!checkValidInputs(this.id, ...inputs, 'change')) return;

                    let stock = new Stock();
                    stock.getStockFromStorage();
                    stock.changeParameters(this.id, inputs);
                    stock.saveStockInStorage();
                    
                    showPage('stock-div');

                    stock.displayStock();
                })

                showPage('change-item-div');


                document.querySelector('#change-item-div').append(newForm);

                document.querySelector('#return-but').addEventListener('click', () => {
                    showPage('stock-div');
        
                    let stock = new Stock();
                    stock.displayStock();
                })

            })

            stock.getItem(itemCode).addEditButtonEventListener(editButton);

                this.connectedCallback();
            };
        })

        butDiv.append(plus, minus);

        div.append(span, butDiv);
        
        this.append(div);
    }
    static get observedAttributes() {
        return ['quantity', 'itemCode'];
    }

    // Setters y getters de las propiedades de la clase
    get quantity() { return this.hasAttribute('quantity'); }
    get itemCode() { return this.hasAttribute('itemCode'); }

    set quantity(val) { val? this.setAttribute('quantity', val) : this.removeAttribute('quantity'); }
    set itemCode(val) { val? this.setAttribute('itemCode', val) : this.removeAttribute('itemCode'); }

}