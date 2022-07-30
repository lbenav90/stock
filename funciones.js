function runStockLoop() {
    document.getElementById('stock-table-head').innerHTML = '';
    document.getElementById('stock-table-body').innerHTML = '';

    // Mensaje del menú principal del programa
    const message = getInitialMessage();

    let option = getNonNull(message, 'int');

    // Repite el loop mientras el usuario no elija 0
    while (option != 0) {
        switch (option) {
            case 1:
                // Manipular el DOM para mostrar el stock actual
                let status = stock.displayStock();
                if (status == 0) {
                    alert('No hay ítems en stock aún');
                    break;
                } else {
                    return;
                }
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
}

/**
 * Devuelve las opciones del menú principal. Sirve apra ordenar el código y que no se vea desprolijo
 * @returns string para el alert del menú principal
 */
function getInitialMessage() {
    let message = 'Menú principal:\n';
    message += 'Elige 1 para ver el stock actual\n';
    message += 'Elige 2 para agregar un nuevo ítem\n';
    message += 'Elige 3 para cambiar un item\n';
    message += 'Elige 4 para borrar un ítem\n';
    message += 'Elige 0 para salir del programa';
    return message;
}

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
            entry = entry.trim();
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
 * Crea un nuevo objeto de la clase Item y lo agrega si fue creado exitosamente.
 * @param {Stock} stock objeto de stock actual
 * @returns {bool} true si se agregó exitosamente, false si no.
 */
function addNewItem(stock) {
    // Crea un nuevo objeto vacío
    const nuevoItem = new Item();

    // Pide al usuario los datos y los llena, dando true si es exitoso
    let exito = nuevoItem.addParameters();

    if (exito) {
        // Si el objeto se pobló exitosamente, se agrega al Stock
        stock.addNewItem(nuevoItem);
        return true;
    } else {
        return false;
    }
}

/**
 * Esta función cambia alguna información de un item del stock actual
 * @param {str} stock objeto de Stock actual
 * @returns {bool} true si se modifica exitosamente o false, si no.
 */
function changeStock(stock) {
    // Pide al usuario un número que se refiere al Item que se desea cambiar
    let itemNum = stock.getItemNum();

    if (itemNum === 0) {
        // Devuelve en stock sin modificar 
        return false;
    }

    // Selecciona el Item deseado
    const selectedItem = stock.getItem(itemNum - 1);

    if (selectedItem) {
        // Si el Item existe, lo cambia
        let success = changeItem(selectedItem);
        return success;
    } else {
        alert('Opción inválida, no se realizan cambios')
        return false;
    }
}

/**
 * Esta función le pide los datos a cambiar al usuario y los modifica si toso es válido
 * @param {Item} item referencia al ítem a ser cambiado
 */
function changeItem(item) {
    // Pide al usuario el nombre de una propiedad a cambiar
    let property = item.getPropertyToChange();

    if (!property) {
        return false;
    }

    let change;

    if (property === 'all') {
        // EL usuario puede elegir cambiar todas las propiedades a la vez
        // En ese caso, crea un nuevo Item, asigna los nuevos valores y despues copia todas las propiedades
        change = new Item();
        change.addParameters();

        for (const property in item) {
            item[property] = change[property];
        }

        return true;
    } else if (property === 'cantidad') {
        // Caso especial para el cambio de cantidad ya que es un número
        change = getNonNull(`¿Que cantidad de ${item.nombre.toLowerCase()} desea poner (0 para salir)?`, 'int');

        if (change === 0) {
            return false;
        }
    } else {
        // Para strings se piden todas en un sólo bloque
        change = getNonNull(`¿Qué ${property} desea poner (ESC para salir)?`, 'str');

        if (change.toLowerCase() === 'esc') {
            return false;
        }
    }

    // Cambio de la propiedad solicitada
    item[property] = change;
    return true;
}

/**
 * Esta función borra un ítem del stock actual
 * @param {Stock} stock objeto de Stock que contiene los ítems
 * @returns {bool} true si borra un ítem exitosamente o false si no
 */
function deleteItem(stock) {
    // Pide al usuario un número que se refiere al Item que se desea cambiar
    let itemNum = stock.getItemNum();

    if (itemNum === 0) {
        return false;
    }

    // Busca el Item solicitado, y si no existe, sale de la función sin hacer nada más
    let selected = stock.getItem(itemNum - 1);
    if (!selected) {
        return false;
    }

    // Pide una confirmación al usuario para borrar el ítem, mostrando la información elegida
    let respuesta = getNonNull(`¿Estás seguro que desear borrar el siguiente ítem?:\n\n` + 
                               `Nombre: ${selected.nombre}\n` + 
                               `Marca: ${selected.marca}\n` + 
                               `Cantidad: ${selected.cantidad}\n` + 
                               `Presentación: ${selected.presentacion}\n\n` + 
                               '1 para aceptar o 0 para salir', 'int');

    // Si el usuario está de acuerdo, borra el Item seleccionado
    if (respuesta) {
        let success = stock.deleteItem(itemNum - 1);
    
        return success;
    } else {
        return false;
    }

}