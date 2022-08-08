/**
 * Clase que define un elemento HTML personalizado. Permite crear variaciones del mismo formulario
 */
class FormElement extends HTMLElement {
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
        let nombre = this.getAttribute('nombre') || '';
        let marca = this.getAttribute('marca') || '';
        let cantidad = this.getAttribute('cantidad') || '';
        let presentacion = this.getAttribute('presentacion') || '';

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
        
        // Array que me permite iterar agregando filas a la tabla
        let formRows = ['Nombre', 'Marca', 'Cantidad', 'Presentacion', ''];

        // La variable html va a juntar todo el string que genera el HTML del elemento.
        // No se usa .innerHTML aca porque no funciona, debe ser asignado de una y no utilizando +=
        let html =  `<h3>${title}</h3><br>`;
        html += `<form method="post" id="${type}-item-form"><table>`;

        // Genero cada campo del formulario como una fila en la tabla.
        // Dentro contiene las peculiaridades de cada campo
        formRows.forEach((row) => {
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
                html += `<td class="${type}-item-data"><label for="item-${row.toLowerCase()}">`;

                if (row === 'Presentacion') {
                    // Agrega la tilde de 'Presentación'
                    html += 'Presentación:</label></td>';
                } else {
                    html += `${row}:</label></td>`;
                }
                html += `<td class="${type}-item-data">`;

                // Agrega el valor a cada input. Si es un formulario 'add', los valores defaultean a ''.
                switch (row) {
                    case 'Nombre':
                        html += `<input type="text" id="item-${row.toLowerCase()}" value="${nombre}"></td>`;
                        break;
                    case 'Marca':
                        html += `<input type="text" id="item-${row.toLowerCase()}" value="${marca}"></td>`;
                        break;
                    case 'Cantidad':
                        html += `<input type="number" id="item-${row.toLowerCase()}" value="${cantidad}"></td>`;
                        break;
                    case 'Presentacion':
                        html += `<input type="text" id="item-${row.toLowerCase()}" value="${presentacion}"></td>`;
                        break;
                }

                html += `<td class="alert-${type}-item-data" id="alert-${row.toLowerCase()}-data"></td>`
            }
            html += '</tr>';
        });


        html += '</table></form>';

        // Asigno el string con el HTML de una.
        this.innerHTML = html;

    }
    static get observedAttributes() {
        // Los atributos que, cuando cambian, se agregan o de borran, llaman a attributeChangedCallback()
        return ['type', 'nombre', 'marca', 'cantidad', 'presentacion'];
    }

    // Funciones SET y GET para todos los atributos.
    get type(){ return this.hasAttribute('type'); }
    set type(val) { if (val) { this.setAttribute('type', val); } else { this.removeAttribute('type'); } }

    get nombre() { return this.hasAttribute('nombre'); }
    get marca() { return this.hasAttribute('marca'); }
    get cantidad() { return this.hasAttribute('cantidad'); }
    get presentacion() { return this.hasAttribute('presentacion'); }
    
    set nombre(val){ if (val) { this.setAttribute('nombre', val); } else { this.removeAttribute('nombre'); } }
    set marca(val){ if (val) { this.setAttribute('marca', val); } else { this.removeAttribute('marca'); } }
    set cantidad(val){ if (val) { this.setAttribute('cantidad', val); } else { this.removeAttribute('cantidad'); } }
    set presentacion(val){ if (val) { this.setAttribute('presentacion', val); } else { this.removeAttribute('presentacion'); } }

    attributeChangedCallback(name, oldValue, newValue) {
        // Vuelve a renderear el objeto
        this.render();
    }
}

// Asigno la clase a un elemento personalizado
customElements.define('form-element', FormElement);