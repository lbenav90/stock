class Item {
    constructor(nombre, marca, cantidad, presentacion) {
        this.nombre = nombre;
        this.marca = marca;
        this.cantidad = cantidad;
        this.presentacion = presentacion;
    }
    output() {
        return `) ${this.nombre} - Marca: ${this.marca} - Cantidad: ${this.cantidad} - Presentación: ${this.presentacion}\n`
    }
}