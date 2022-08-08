import Stock from './clases/Stock.js';
import Item from './clases/Item.js';
import FormElement from './customElements/FormElement.js'
import { checkValidInputs, cleanUpString } from "./funciones.js";

!customElements.get('form-element')? customElements.define('form-element', FormElement): 1;

document.addEventListener('DOMContentLoaded', () => {
    
    let stock = new Stock();

    stock.displayStock();

    document.querySelector('#add-item-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        document.querySelector('#stock-div').style.display = 'none';
        document.querySelector('#add-item-div').style.display = 'block';
        document.querySelector('#show-item-div').style.display = 'none';
        document.querySelector('#change-item-div').style.display = 'none';

        // Borro cualquier contenido de los divs con formularios
        document.querySelector('#change-item-div').innerHTML = '';
        document.querySelector('#add-item-div').innerHTML = '';

        // Creo un formulario en modo 'add'
        let newForm = document.createElement('form-element');
        
        newForm.addEventListener('submit', (event) => {
            event.preventDefault()

            // Borro contenidos de los elementos de alerta
            document.querySelector('#alerting-element-add').innerText = '';
            document.querySelectorAll('.alert-add-item-data').forEach((el) => {
                el.innerText = '';
            })
            
            let name = document.querySelector('#item-name').value.trim();
            let brand = document.querySelector('#item-brand').value.trim();
            let quantity = parseInt(document.querySelector('#item-quantity').value);
            let minQuantity = parseInt(document.querySelector('#item-minQuantity').value);
            let presentation = document.querySelector('#item-presentation').value.trim();
            let description = document.querySelector('#item-description').value.trim();
            
            // Si hay un input inválido, usa los elementos de alerta y finaliza la ejecución
            if (!checkValidInputs(-1, name, brand, quantity, minQuantity, presentation, 'add')) return;
            
            // Defino un nuevo Item
            let newItem = new Item(stock.length() + 1, cleanUpString(name), cleanUpString(brand),
                                   quantity, minQuantity, cleanUpString(presentation), cleanUpString(description), 'main')
            stock.addNewItem(newItem);
            
            // Muestro el stock
            document.querySelector('#stock-div').style.display = 'block';
            document.querySelector('#add-item-div').style.display = 'none';
            
            stock.displayStock();
        });
        
        document.querySelector('#add-item-div').append(newForm);
        
        // Vacío los inputs
        document.querySelector('#item-name').value = '';
        document.querySelector('#item-brand').value = '';
        document.querySelector('#item-quantity').value = '';
        document.querySelector('#item-minQuantity').value = '';
        document.querySelector('#item-presentation').value = '';
        document.querySelector('#item-description').value = '';

        document.querySelector('#alerting-element-add').innerText = ''
        document.querySelectorAll('.alert-add-item-data').forEach((el) => {
            el.innerText = '';
        });
    })

    document.querySelector('#show-stock-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        document.querySelector('#stock-div').style.display = 'block';
        document.querySelector('#add-item-div').style.display = 'none';
        document.querySelector('#show-item-div').style.display = 'none';
        document.querySelector('#change-item-div').style.display = 'none';

        document.querySelector('#change-item-div').innerHTML = '';

        stock.getStockFromStorage();
        stock.displayStock();
    });      
    
    document.querySelector('#prep-order-but').addEventListener('click', () => {
        // Iterar sobre todos los Items y agregar a una lista los que tengan una cantidad menor o igual al minimo establecido
    })
})