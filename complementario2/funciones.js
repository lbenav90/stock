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

    let newItem = new Item(name, brand, quantity, presentation);
    // Devuelve el string formateado acordemente
    return `${stockSize}${newItem.output()}`;
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
            item = changeItem(item).slice(0,-1);
        }
        
        newStock += item + '\n';
    });
    
    return newStock.slice(0, -1);
}

/**
 * Reconstruye el objeto a partir de su string en el stock. Para cambios más fáciles de propiedades
 * @param {*} itemString string que viene del stock que contiene toda la información de un item
 * @returns un objeto Item con las mismas propiedades
 */
function reconstructItem(itemString) {
    // Array que contiene la información del ítem separada
    let itemArray = itemString.split(' - ');

    return new Item(itemArray[0].split(') ')[1], 
                    itemArray[1].split('Marca: ')[1], 
                    parseInt(itemArray[2].split('Cantidad: ')[1]), 
                    itemArray[3].split('Presentación: ')[1])
}

/**
 * Esta función cambia el string del ítem elegido por el usuario
 * @param {str} item string con la infomración del ítem del stock
 * @returns el string del ítem de stock modificado acordemente
 */
function changeItem(item) {
    // Obtener el objecto Item para acceder mas fácilmente a las propiedades
    const oldItem = reconstructItem(item);
    const numItem = item.split(') ')[0];

    let option = getNonNull(`¿Qué desea cambiar de ${oldItem.nombre} (0 para salir)?: `, 'str').toLowerCase();
    let change;

    if (oldItem[option]) {
        // Si la opción elegida es válida
        if (option === 'cantidad') {
            // Caso especial al alegir cantidad debido a que necesita un número
            change = getNonNull('Qué cantidad desea poner? (Ingrese 0 para salir):', 'int');
            if (change === 0) {
                return `${numItem}${oldItem.output()}`;
            }
        } else {
            change = getNonNull(`Qué ${option} desea poner? (Ingrese ESC para salir):`, 'str');
            if (change.toLowerCase() === 'esc') {
                return `${numItem}${oldItem.output()}`;
            }
        }
        // Cambio en la propiedad elegida
        oldItem[option] = change;
    } else if (option === 'esc') {
        alert('Salida pedida por el usuario, no hubo cambios en el stock');
    } else {
        alert('Opcion inválida, no hubo cambios en el stock');
    }
    return `${numItem}${oldItem.output()}`;
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