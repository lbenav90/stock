alert('Bienvenido a la aplicación de stock!');

let stock = 'Stock:\n\n';
let stockSize = 0;

// Mensaje del menú principal del programa
let message = 'Menú principal:\nElige 1 para ver el stock actual\nElige 2 para agregar un nuevo ítem\n';
message += 'Elige 3 para cambiar un item\nElige 4 para borrar un ítem\nElige 0 para salir del programa';

let option = getNonNull(message, 'int');
let newItem;

// Repite el loop mientras el usuario no elija 0
while (option != 0) {
    switch (option) {
        case 1:
            // Monstrar el stock actual, solo si hay algun ítem agregado
            if (stockSize === 0){
                alert('No hay ítems en stock');
            } else {
                alert(stock)
            }
            break;
        case 2:
            // Agrege un nuevo ítem, sólo si se genera exitosamente
            newItem = addNewItem(stockSize + 1);
            if (newItem != '') {
                stockSize++;
                stock += newItem;
            }
            break;
        case 3:
            // Cambia la información de un ítem de stock
            stock = changeStock(stock);
            break;
        case 4:
            // Borra un ítem del stock
            stockSize--;
            stock = deleteItem(stock, stockSize);
            break;
    }

    option = getNonNull(message, 'int');
}