alert('Bienvenido a su lista de tareas!')

let tareas = 'Tareas a realizar:\n';
let tarea;
let temp_tarea = '';
let cantidad = 0;

// Vuelve a pedir el prompt si el usuario aprieta 'Cancelar'
do {
    tarea = prompt('Ingrese una tarea a realizar (ESC para finalizar):');
} while (tarea == null);

while (tarea.toUpperCase() != 'ESC') {

    if (!isNaN(parseInt(tarea)) || tarea == ''){
        // chequea si se ingresó sólo un numero o nada y saltea la iteración //
        alert('Tarea inválida');

        tarea = prompt('Ingrese una tarea a realizar (ESC para finalizar):');
        continue; 
    }
    
    cantidad += 1

    // Emprolijar el texto ingresado //
    temp_tarea = tarea.charAt(0).toUpperCase() + tarea.slice(1).toLowerCase();

    tareas += `\n${cantidad}) ${temp_tarea}`;

    // Vuelve a pedir el prompt si el usuario aprieta 'Cancelar'
    do {
        tarea = prompt('Ingrese una tarea a realizar (ESC para finalizar):');
    } while (tarea == null);
    
};

alert(tareas);