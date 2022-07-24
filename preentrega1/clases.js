class Item {
    // Objeto que contiene la infomración de un ítem del stock
    constructor(nombre = '', marca = '', cantidad = 0, presentacion = '') {
        // En este programa, en general se crea el objeto vacío y se puebla después.
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
    }
    output() {
        // String para la creación del alert de stock
        return `${this.nombre} - Marca: ${this.marca} - Cantidad: ${this.cantidad} - Presentación: ${this.presentacion}\n`
    }
    addParameters() {
        // Método que permite poblar los campos de la clase con información del usuario
        let nombre = getNonNull('Nombre del ítem (ESC para salir):', 'str');

        if (nombre.toLowerCase() === 'esc'){
            // Escapa la función sin sumarle nada al stock
            return false;
        }

        let marca = getNonNull(`Marca de ${nombre.toLowerCase()} (ESC para salir):`, 'str');
        
        if (marca.toLowerCase() === 'esc'){
            // Escapa la función sin sumarle nada al stock
            return false;
        }

        let presentacion = getNonNull(`Presentación de ${nombre.toLowerCase()} (unidad, caja, kilo/s, etc.) (ESC para salir)`, 'str');
        
        if (presentacion.toLowerCase() === 'esc'){
            // Escapa la función sin sumarle nada al stock
            return false;
        }

        let cantidad = getNonNull(`Cantidad en stock de ${nombre.toLowerCase()} (0 para salir)`, 'int');

        if (cantidad === 0){
            // Escapa la función sin sumarle nada al stock
            return false;
        }

        this.nombre = nombre;
        this.marca = marca;
        this.presentacion = presentacion;
        this.cantidad = cantidad;
        return true;
    }
    getPropertyToChange() {
        // Pide al usuario un número que corresponde a una propiedad que desea modificar. También da la opción de modificar todo

        // Genera un mensaje con todas las propiedades de Item y les asigna un número
        let message = 'Ingrese el número del dato a modificar (0 para salir):\n\n';
        // Objeto auxiliar que vincula la propiedad con el número asignado
        let properties = {}
        
        let prNum = 1;
        for (const property in this){
            // Sumo la propiedad al mensaje
            message += `${prNum}) ${property.charAt(0).toUpperCase() + property.slice(1).toLowerCase()}: ${this[property]}\n`;

            // Le asigno la propiedad al número prNum en el objeto auxiliar
            properties[prNum] = property;
            prNum++;
        }
        
        // Agrego la opción de cambiar todos los campos
        message += `${prNum}) Cambiar todos los campos\n`
        properties[prNum] = 'all';

        // Pido al usuario un número asignado a una propiedad
        let propertyNum = getNonNull(message, 'int');

        if (propertyNum === 0) {
            return false;
        }

        // Selecciono la propiedad del objeto auxiliar
        const selectedProperty = properties[propertyNum];

        // Si la selección es válida, devoler el nombre de la propiedad. Si no, avisar y retornar false
        if (selectedProperty) {
            return properties[propertyNum];
        } else {
            alert('La propiedad seleccionada es inválida, no se aplicaron cambios');
            return false;
        }
    }
};

class Stock {
    // Objeto que contiene los Items del stock. Contiene objetos de la clase Item
    constructor() {
        this.items = [];
    }
    length() {
        return this.items.length;
    }
    getItem(index) {
        let selected = this.items[index];

        if (selected) {
            return selected;
        } else {
            return false;
        }
    }
    addNewItem(item) {
        this.items.push(item);
    }
    deleteItem(index) {
        this.items.splice(index, 1);
    }
    getItemNum() {
        let message = 'Ingrese el número de ítem a modificar (0 para salir):\n\n';
        let currentStock = this.displayStock();
        message += currentStock.split('Stock:\n\n')[1];

        let itemNum = getNonNull(message, 'int');

        return itemNum;
    }
    displayStock() {
        if (this.length() === 0) {
            return 'No hay ítems en stock';
        }
        let stock = 'Stock:\n\n'

        for (let i = 0; i < this.length(); i++) {
            stock += `${i + 1}) ${this.items[i].output()}`;
        }
        return stock;
    }
};