import Item from './clases/Item.js';
import FormElement from './customElements/FormElement.js'
import { checkValidInputs, getFormValues, showPage, emptyFormAlerts, getUniqueCode, addNewItem, displayStock, prepLowStockOrder } from "./funciones.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh61PbaLfVPrNsFgbiMWuN2IgZhPhSpKs",
  authDomain: "stock-ce94d.firebaseapp.com",
  databaseURL: "https://stock-ce94d-default-rtdb.firebaseio.com",
  projectId: "stock-ce94d",
  storageBucket: "stock-ce94d.appspot.com",
  messagingSenderId: "600515267172",
  appId: "1:600515267172:web:a3bbfc1b57cb96e314ed71",
  measurementId: "G-QRKF7KYDBN",
  databaseURL: "https://stock-ce94d-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

!customElements.get('form-element')? customElements.define('form-element', FormElement): //pass

document.addEventListener('DOMContentLoaded', () => {

    displayStock();

    const API_KEY = "v6GVuC2yWpZZXebdxzHmTJQmN3Vk9dc5";

    document.querySelector('#add-item-but').addEventListener('click', () => {
        showPage('add-item-div');

        // Creo un formulario en modo 'add' con un customElement
        let newForm = document.createElement('form-element');
        
        newForm.addEventListener('submit', async (event) => {
            event.preventDefault()

            emptyFormAlerts('add');

            let inputs = getFormValues();

            if (!checkValidInputs(-1, ...inputs, 'add')) return;

            // Defino un nuevo Item y muestro el stock
            let newItemCode = getUniqueCode(5);
            let newItem = new Item(newItemCode, ...inputs)
            addNewItem(newItem);

            displayStock();
        });

        document.querySelector('#add-item-div').append(newForm);

        const categoryOptions = document.querySelector('#item-category').children.length;

        if (categoryOptions != 1) {
            document.querySelector('#item-newCategory-row').style.display = 'none';
        }

        document.querySelector('#item-category').addEventListener('change', () => {
            let selected = document.querySelector('#item-category').value;
            
            if (selected === 'new') { 
                document.querySelector('#item-newCategory-row').style.display = 'table-row';
            } else {
                document.querySelector('#item-newCategory-row').style.display = 'none';
                document.querySelector('#item-newCategory-row').value = '';
            }
        })
        
        // Boton para volver al stock
        document.querySelector('#return-but').addEventListener('click', () => displayStock());
    })

    document.querySelector('#show-stock-but').addEventListener('click', () => displayStock());
    
    document.querySelector('#order-by').addEventListener('change', () => {
        let stockVisible = document.querySelector('#stock-div').style.display === 'block';

        if (stockVisible) {
            displayStock(document.querySelector('#order-by').value);
        } else {
            prepLowStockOrder(document.querySelector('#order-by').value);
        }
    });

    document.querySelector('#search-bar').addEventListener('keyup', () => {
        const query = document.querySelector('#search-bar').value.toLowerCase();
        const tableRows = document.querySelectorAll('.stock-item-row');
        let tableData, searchHit;

        tableRows.forEach((row) => {
            searchHit = false;

            tableData = row.querySelectorAll('td');
            tableData.forEach((cell) => {
                if(cell.innerText.toLowerCase().includes(query)) {
                    searchHit = true;
                }
            });

            row.style.display = searchHit? 'table-row': 'none';
        })
        
    })
    
    document.querySelector('#prep-order-but').addEventListener('click', () => {
        prepLowStockOrder()
    })

    document.querySelector('#currency-link').addEventListener('click', () => {

        fetch('https://api.apilayer.com/fixer/latest?symbols=ARS&base=USD', {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'apikey': API_KEY
            }
        })
        .then((response) => {
            return response.json()
        })
        .then((result) => {

            Toastify({
                text: `Cotización actual: $${Number(result.rates.ARS).toFixed(2)} por USD`,
                duration: 10000,
                stopOnFocus: false,
                position: 'right',
                style: {
                    height: '40px',
                    width: '270px',
                    background: '#b6b6b6',
                    borderRadius: '20px',
                    fontSize: '10pt',
                    fontWeight: 'bold'
                }
            }).showToast();
        })
 
    })
})