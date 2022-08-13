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
        
        let quantity = this.getAttribute('quantity') || '';
        let itemId = this.getAttribute('itemId') || null;

        let div = document.createElement('div');
        div.className = 'quantity-div';

        let span = document.createElement('span');
        span.className = 'quantity-span';
        span.innerText = quantity;

        let butDiv = document.createElement('div');
        butDiv.className = 'quantity-but-div';
        
        let plus = document.createElement('button');
        plus.className = 'quantity-but quantity-plus';
        plus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>';
        
        plus.addEventListener('click', (event) => {
            event.stopPropagation();

            let stock = new Stock();
            stock.getStockFromStorage();
            stock.getItem(itemId - 1).increaseStock();
            quantity++;
            
            this.setAttribute('quantity', quantity)
            stock.saveStockInStorage();

            this.parentElement.parentElement.removeEventListener('click', () => {
                showPage('show-item-div');
                item.displayItem();
            })
            this.parentElement.parentElement.addEventListener('click', () => {
                showPage('show-item-div');
                stock.getItem(itemId - 1).displayItem();
            })

            this.connectedCallback();
        })

        let minus = document.createElement('button');
        minus.className = 'quantity-but quantity-minus'
        minus.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>';
        
        minus.addEventListener('click', (event) => {
            event.stopPropagation();

            let stock = new Stock();
            stock.getStockFromStorage();
            
            if (stock.getItem(itemId - 1).decreaseStock()) {
                quantity--;
                stock.saveStockInStorage()
    
                this.setAttribute('quantity', quantity)

                this.parentElement.parentElement.removeEventListener('click', () => {
                    showPage('show-item-div');
                    item.displayItem();
                })
                this.parentElement.parentElement.addEventListener('click', () => {
                    showPage('show-item-div');
                    stock.getItem(itemId - 1).displayItem();
                })

                this.connectedCallback();
            };
        })

        butDiv.append(plus, minus);

        div.append(span, butDiv);
        
        this.append(div);
    }
    static get observedAttributes() {
        return ['quantity', 'itemId'];
    }

    get quantity() { return this.hasAttribute('quantity'); }
    get itemId() { return this.hasAttribute('itemId'); }

    set quantity(val) { val? this.setAttribute('quantity', val) : this.removeAttribute('quantity'); }
    set itemId(val) { val? this.setAttribute('itemId', val) : this.removeAttribute('itemId'); }

}