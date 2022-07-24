alert('Bienvenido a la aplicación de stock!');

const stock = new Stock();

// Mensaje del menú principal del programa
const message = getInitialMessage();

let option = getNonNull(message, 'int');

// Repite el loop mientras el usuario no elija 0
while (option != 0) {
    switch (option) {
        case 1:
            // Mostrar el stock actual, solo si hay algun ítem agregado
            alert(stock.displayStock());
            break;
        case 2:
            // Agrege un nuevo ítem, sólo si se genera exitosamente
            newItem = addNewItem(stock);
            break;
        case 3:
            // Cambia la información de un ítem de stock
            if (stock.length() != 0) {
                changeStock(stock);
            } else {
                alert('No hay ítems en stock');
            }
            break;
        case 4:
            // Borra un ítem del stock
            if (stock.length() != 0) {
                deleteItem(stock);
            } else {
                alert('No hay ítems en stock');
            }
            break;
    }

    option = getNonNull(message, 'int');
}