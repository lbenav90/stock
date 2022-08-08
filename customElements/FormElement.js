/**
 * Clase que define un elemento HTML personalizado. Permite crear variaciones del mismo formulario
 */
export default class FormElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // Definido así apra evitar bucles infinitos con attributeChangedCallback()
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    render() {
        // Método que define el elemento personalizado. El atributo 'type' define si es un formulario para agregar o modificar ítems
        let type = this.getAttribute('type') || 'add';

        // Atributos necesarios para los formularios de edición. Tal vez convenga utilizar dataclases TODO
        let name = this.getAttribute('name') || '';
        let brand = this.getAttribute('brand') || '';
        let quantity = this.getAttribute('quantity') || '';
        let minQuantity = this.getAttribute('minQuantity') || '';
        let presentation = this.getAttribute('presentation') || '';
        let description = this.getAttribute('description') || '';

        // Deifno un título que va en un element h3
        let title;
        switch (type) {
            case 'add':
                title = 'Agregar un ítem';
                break;
            case 'change':
                title = 'Modificar un ítem';
                break;
        }
        
        // Objeto que me permite vincular los nombres en español con los nombres de las propiedades del Item
        let formRows = {'Nombre': 'name', 'Marca': 'brand', 'Cantidad': 'quantity', 'Cantidad mínima': 'minQuantity',
                        'Presentación': 'presentation', 'Descripción': 'description', '': ''};

        // La variable html va a juntar todo el string que genera el HTML del elemento.
        // No se usa .innerHTML aca porque no funciona, debe ser asignado de una y no utilizando +=
        let html =  `<h3>${title}</h3><br>`;
        html += `<form method="post" id="${type}-item-form"><table>`;

        // Genero cada campo del formulario como una fila en la tabla.
        // Dentro contiene las peculiaridades de cada campo
        for (const row in formRows) {
            html += '<tr>';
            if (row === '') {
                // Esta fila representa la parte del input 'submit'. Es sustancialmente distinto al resto.
                html += `<td id="alerting-element-${type}" class="${type}-item-data"></td>`;
                html += `<td id="${type}-item-submit" class="${type}-item-data">`;

                // Este condicional permite cambiar el texto del botón.
                if (type == 'add') {
                    html += `<input type="submit" id="${type}-item-submit-input" value="Agregar"></td>`;
                } else {
                    html += `<input type="submit" id="${type}-item-submit-input" value="Guardar"></td>`;
                }
            } else {
                // El resto de las filas son similares
                html += `<td class="${type}-item-data"><label for="item-${formRows[row]}">`;

                html += `${row}:</label></td>`;
                
                html += `<td class="${type}-item-data">`;

                // Agrega el valor a cada input. Si es un formulario 'add', los valores defaultean a ''.
                switch (row) {
                    case 'Nombre':
                        html += `<input type="text" id="item-${formRows[row]}" value="${name}"></td>`;
                        break;
                    case 'Marca':
                        html += `<input type="text" id="item-${formRows[row]}" value="${brand}"></td>`;
                        break;
                    case 'Cantidad':
                        html += `<input type="number" id="item-${formRows[row]}" value="${quantity}"></td>`;
                        break;
                    case 'Cantidad mínima':
                        html += `<input type="number" id="item-${formRows[row]}" value="${minQuantity}"></td>`
                        break;
                    case 'Presentación':
                        html += `<input type="text" id="item-${formRows[row]}" value="${presentation}"></td>`;
                        break;
                    case 'Descripción':
                        html += `<textarea id="item-${formRows[row]}" rows="4" cols="50">${description}</textarea></td>`;
                        break;
                }

                html += `<td class="alert-${type}-item-data" id="alert-${formRows[row]}-data"></td>`
            }
            html += '</tr>';
        };


        html += '</table></form>';

        // Asigno el string con el HTML de una.
        this.innerHTML = html;

    }
    static get observedAttributes() {
        // Los atributos que, cuando cambian, se agregan o de borran, llaman a attributeChangedCallback()
        return ['type', 'name', 'brand', 'quantity', 'minQuantity', 'presentation', 'description'];
    }

    // Funciones SET y GET para todos los atributos.
    get type() { return this.hasAttribute('type'); }
    set type(val) { if (val) { this.setAttribute('type', val); } else { this.removeAttribute('type'); } }

    get name() { return this.hasAttribute('name'); }
    get brand() { return this.hasAttribute('brand'); }
    get quantity() { return this.hasAttribute('quantity'); }
    get minQuantity() { return this.hasAttribute('minQuantity'); }
    get presentation() { return this.hasAttribute('presentation'); }
    get description() { return this.hasAttribute('description'); }
    
    set name(val) { val? this.setAttribute('name', val) : this.removeAttribute('name'); } 
    set brand(val) { val? this.setAttribute('brand', val) : this.removeAttribute('brand'); } 
    set quantity(val) { val? this.setAttribute('quantity', val) : this.removeAttribute('quantity'); } 
    set minQuantity(val) { val? this.setAttribute('minQuantity', val) : this.removeAttribute('minQuantity'); } 
    set presentation(val) { val? this.setAttribute('presentation', val) : this.removeAttribute('presentation'); } 
    set description(val) { val? this.setAttribute('description', val) : this.removeAttribute('description'); } 

    attributeChangedCallback(name, oldValue, newValue) {
        // Vuelve a renderear el objeto
        this.render();
    }
}