//alert('Bienvenido a la aplicación de stock!');

const stock = new Stock();

document.addEventListener('DOMContentLoaded', () => {

    stock.displayStock();

    document.querySelector('#add-item-form').addEventListener('submit', handleForm);

    document.querySelector('#add-item-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        document.querySelector('#stock-div').style.display = 'none';
        document.querySelector('#add-item-div').style.display = 'block';
        document.querySelector('#show-item-div').style.display = 'none';
        document.querySelector('#change-item-div').style.display = 'none';

        // Vacío los inputs
        document.querySelector('#item-nombre').value = '';
        document.querySelector('#item-marca').value = '';
        document.querySelector('#item-cantidad').value = '';
        document.querySelector('#item-presentacion').value = '';

        document.querySelector('#alerting-element').innerText = ''
        document.querySelectorAll('.alert-add-item-data').forEach((el) => {
            el.innerText = '';
        });
    })

    document.querySelector('#add-item-form').addEventListener('submit', () => {
        document.querySelector('#alerting-element').innerText = '';
        document.querySelectorAll('.alert-add-item-data').forEach((el) => {
            el.innerText = '';
        })
        
        let nombre = document.querySelector('#item-nombre').value;
        let marca = document.querySelector('#item-marca').value;
        let cantidad = parseInt(document.querySelector('#item-cantidad').value);
        let presentacion = document.querySelector('#item-presentacion').value;

        if ((isNaN(cantidad) || cantidad <= 0) || nombre === '' || presentacion === '') {
            // Chequea que ingresen nombre, presentación y una cantidad válida
            if (nombre === '') {
                document.querySelector('#alerting-element').innerText += 'Ingresar un nombre\n';
                document.querySelector('#alert-nombre').innerText += '*';
            }
            if (isNaN(cantidad) || cantidad <= 0) {
                document.querySelector('#alerting-element').innerText += 'Cantidad inválida\n';
                document.querySelector('#alert-cantidad').innerText += '*';
            }
            if (presentacion === '') {
                document.querySelector('#alerting-element').innerText += 'Ingresar una presentación\n';
                document.querySelector('#alert-presentacion').innerText += '*';
            }
            return;
        }

        let newItem = new Item(stock.length() + 1,
                               nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase(), 
                               marca.charAt(0).toUpperCase() + marca.slice(1).toLowerCase(), 
                               cantidad, 
                               presentacion.charAt(0).toUpperCase() + presentacion.slice(1).toLowerCase());
        stock.addNewItem(newItem);

        document.querySelector('#stock-div').style.display = 'block';
        document.querySelector('#add-item-div').style.display = 'none';

        stock.displayStock();
    });

    document.querySelector('#show-stock-but').addEventListener('click', () => {
        // Oculto los divs que no correponden y muestro el que sí
        document.querySelector('#stock-div').style.display = 'block';
        document.querySelector('#add-item-div').style.display = 'none';
        document.querySelector('#show-item-div').style.display = 'none';
        document.querySelector('#change-item-div').style.display = 'none';

        stock.displayStock();
    });                   
})