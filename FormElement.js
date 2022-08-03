class FormElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    render() {
        let type = this.getAttribute('type') || 'add';

        let nombre = this.getAttribute('nombre') || '';
        let marca = this.getAttribute('marca') || '';
        let cantidad = this.getAttribute('cantidad') || '';
        let presentacion = this.getAttribute('presentacion') || '';
    
        let title;

        switch (type) {
            case 'add':
                title = 'Agregar un ítem';
                break;
            case 'change':
                title = 'Modificar un ítem';
                break;
        }
        
        let formRows = ['Nombre', 'Marca', 'Cantidad', 'Presentacion', ''];

        let html =  `<h3>${title}</h3><br>`;
        html += `<form method="post" id="${type}-item-form"><table>`;

        formRows.forEach((row) => {
            html += '<tr>';
            if (row === '') {
                html += `<td id="alerting-element-${type}" class="${type}-item-data"></td>`;
                html += `<td id="${type}-item-submit" class="${type}-item-data">`;

                if (type == 'add') {
                    html += `<input type="submit" id="${type}-item-submit-input" value="Agregar"></td>`;
                } else {
                    html += `<input type="submit" id="${type}-item-submit-input" value="Guardar"></td>`;
                }
            } else {
                html += `<td class="${type}-item-data"><label for="item-${row.toLowerCase()}">`;

                if (row === 'Presentacion') {
                    html += 'Presentación:</label></td>';
                } else {
                    html += `${row}:</label></td>`;
                }
                html += `<td class="${type}-item-data">`;

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

        this.innerHTML = html;

    }
    static get observedAttributes() {
        return ['type', 'nombre', 'marca', 'cantidad', 'presentacion'];
    }

    get nombre() { return this.hasAttribute('nombre'); }
    get marca() { return this.hasAttribute('marca'); }
    get cantidad() { return this.hasAttribute('cantidad'); }
    get presentacion() { return this.hasAttribute('presentacion'); }
    
    set nombre(val){ if (val) { this.setAttribute('nombre', val); } else { this.removeAttribute('nombre'); } }
    set marca(val){ if (val) { this.setAttribute('marca', val); } else { this.removeAttribute('marca'); } }
    set cantidad(val){ if (val) { this.setAttribute('cantidad', val); } else { this.removeAttribute('cantidad'); } }
    set presentacion(val){ if (val) { this.setAttribute('presentacion', val); } else { this.removeAttribute('presentacion'); } }


    get type(){
        return this.hasAttribute('type');
    }
    set type(val) {
        if (val) {
            this.setAttribute('type', val);
        } else {
            this.removeAttribute('type');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
}

customElements.define('form-element', FormElement);