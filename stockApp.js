import Stock from './clases/Stock.js';
import Item from './clases/Item.js';
import FormElement from './customElements/FormElement.js'
import { checkValidInputs } from "./funciones.js";

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
            
            let nombre = document.querySelector('#item-nombre').value;
            let marca = document.querySelector('#item-marca').value;
            let cantidad = parseInt(document.querySelector('#item-cantidad').value);
            let presentacion = document.querySelector('#item-presentacion').value;
            
            // Si hay un input inválido, usa los elementos de alerta y finaliza la ejecución
            if (!checkValidInputs(nombre, marca, cantidad, presentacion, 'add')) return;
            
            // Defino un nuevo Item
            let newItem = new Item(stock.length() + 1,
            nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(), 
            marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase(), 
            cantidad, 
            presentacion.charAt(0).toUpperCase() + presentacion.slice(1).toLowerCase());
            stock.addNewItem(newItem);
            
            // Muestro el stock
            document.querySelector('#stock-div').style.display = 'block';
            document.querySelector('#add-item-div').style.display = 'none';
            
            stock.displayStock();
        });
        
        document.querySelector('#add-item-div').append(newForm);
        
        // Vacío los inputs
        document.querySelector('#item-nombre').value = '';
        document.querySelector('#item-marca').value = '';
        document.querySelector('#item-cantidad').value = '';
        document.querySelector('#item-presentacion').value = '';

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

        stock.displayStock();
    });                   
})