/**
 * Pide datos al usuario y chequea que sean válidos
 * @param {str} question string para pedirle el dato al usuario
 * @param {str} type cambia la validación y el parseo que se le realiza al dato
 * @returns string o int, según pidió el programa
 */
 function getNonNull(question, type) {
    let entry;
    switch (type) {
        case 'str':
            // Pide un str que no sea null ni la cadena vacía
            do {
                entry = prompt(question);
            } while (entry == null || entry == '');

            // Emprolija la entrada para que este propiamente capitalizada
            entry = entry.charAt(0).toUpperCase() + entry.slice(1).toLowerCase();
            break;
        case 'int':
            // Pide un int que sea mayor que cero y válido
            do {
                entry = parseInt(prompt(question));
            } while (isNaN(entry) || entry < 0);
            break;
    }

    return entry;
}

/**
 * Genera una salida que se suma al stock actual
 * @param {int} stockSize Número actual de ítems en el stock 
 * @returns un str para ser sumado al string de stock actual
 */
function addNewItem(stockSize) {
    let name = getNonNull('Nombre del ítem (ESC para salir):', 'str');

    if (name.toLowerCase() === 'esc'){
        // Escapa la función sin sumarle nada al stock
        return '';
    }

    let brand = getNonNull(`Marca de ${name.toLowerCase()} (ESC para salir):`, 'str');
    
    if (brand.toLowerCase() === 'esc'){
        // Escapa la función sin sumarle nada al stock
        return '';
    }

    let presentation = getNonNull(`Presentación de ${name.toLowerCase()} (unidad, caja, kilo/s, etc.) (ESC para salir)`, 'str');
    
    if (presentation.toLowerCase() === 'esc'){
        // Escapa la función sin sumarle nada al stock
        return '';
    }

    let quantity = getNonNull(`Cantidad en stock de ${name.toLowerCase()} (0 para salir)`, 'int');

    if (quantity === 0){
        // Escapa la función sin sumarle nada al stock
        return '';
    }

    // Devuelve el string formateado acordemente
    return `${stockSize}) ${name} - Marca: ${brand} - Cantidad: ${quantity} - Presentación: ${presentation}\n`;
}

/**
 * Esta función cambia alguna información de un item del stock actual
 * @param {str} stock string del stock actual
 * @returns el nuevo stock modificado segun eligió el usuario
 */
function changeStock(stock) {
    let itemNum = getNonNull('Número de ítem a cambiar (0 para salir):', 'int');

    if (itemNum === 0) {
        // Devuelve en stock sin modificar 
        return stock;
    }

    // Array que solo incluye los ítems del stock
    let stockArray = stock.split('\n').slice(2);
    let newStock = 'Stock:\n\n';

    // Para cada ítem del stock, lo suma al string del nuevo stock (cambiando el elegido en el medio)
    stockArray.forEach((item) => {
        if (parseInt(item.split(')')[0]) === itemNum) {
            // Cuando paso por el ítem elegido para cambiar, lo modifica
            item = changeItem(item);
        }
        
        newStock += item + '\n';
    });
    
    return newStock.slice(0, -1);
}

/**
 * Esta función cambia el string del ítem elegido por el usuario
 * @param {str} item string con la infomración del ítem del stock
 * @returns el string del ítem de stock modificado acordemente
 */
function changeItem(item) {
    // Array que contiene la información del ítem separada
    let itemArray = item.split(' - ');

    // Nombre actual del ítem
    let currentName = itemArray[0].split(') ')[1];

    let option = getNonNull(`¿Qué desea cambiar de ${currentName} (ESC para salir)?`, 'str');
    let change;
    let newItem = '';

    switch (option.toLowerCase()) {
        case 'nombre':
            change = getNonNull('¿Qué nombre quieres poner? (ESC para salir)', 'str');

            if (change.toLowerCase() === 'esc'){
                return item;
            }

            // En un cambio de nombre, se modifica el principio del string
            newItem += `${itemArray[0].split(') ')[0]}) ${change}`;

            // Luego se agrega el resto del string sin modificar
            newItem += item.split(currentName)[1];
            break;
        case 'marca':
            change = getNonNull('¿Qué marca quieres poner? (ESC para salir)', 'str');
            
            if (change.toLowerCase() === 'esc'){
                return item;
            }

            // En un cambio de marca, presentación o cantidad, se copia todo lo anterior a la opcion elegida
            // y luego se agrega lo que le sigue sin modificar
            newItem += `${item.split('Marca')[0]}Marca: ${change} - ${itemArray[2]} - ${itemArray[3]}`; 
            break;
        case 'cantidad':
            change = getNonNull('¿Qué cantidad quieres poner? (0 para salir)', 'int');

            if (change === 0){
                return item;
            }
            
            // Mismo tipo de modificación que Marca
            newItem += `${item.split('Cantidad')[0]}Cantidad: ${change} - ${itemArray[3]}`; 
            break;
        case 'presentacion':
            change = getNonNull('¿Qué presentacion quieres poner? (ESC para salir)', 'str');
            
            if (change === 0){
                return item;
            }
            
            // Mismo tipo de modificación que Marca
            newItem += `${item.split('Presentación')[0]}Presentación: ${change}`; 
            break;
        case 'esc':
            alert('Eligió salida, no se aplica ningun cambio');
            newItem = item;
            break;
        default:
            alert('Opción a cambiar no válida, no se aplica ningun cambio');
            newItem = item;
            break;
    }

    return newItem;
}

/**
 * Esta función borra un ítem del stock actual
 * @param {str} stock string con el stock actual
 * @param {int} stockSize el tamaño actual del stock en número de ítems
 * @returns un string con el stock modificado acordemente
 */
function deleteItem(stock, stockSize) {
    let itemNum = getNonNull('Número de ítem a borrar (0 para salir):', 'int');

    if (itemNum === 0 || itemNum > stockSize + 1) {
        // Si elige salir o elige un número de ítem no válido, devuelve el mismo stock
        return stock;
    }

    // Array con los ítems del stock separados
    let stockArray = stock.split('\n').slice(2, -1);
    let newStock = 'Stock:\n\n';
    let currentNum;

    // Los ítems se les asigna un nuevo número que puede ser distinto al original con el newIndex
    let newIndex = 1;    
    stockArray.forEach((item) => {
        // Número del ítem en el stock sin modificar. Se compara con la elección del usuario
        currentNum = item.split(')')[0];

        // Información del ítem
        information = item.slice(item.indexOf(')'));

        // Si el número actual no es el elegido, agrega el ítem al stock nuevamente.
        // Así, se saltea el número de ítem elegido para borrar
        if (parseInt(currentNum) != itemNum) {
            newStock += `${newIndex}${information}\n`;
            newIndex++;  
        }             
    })
    return newStock;
}