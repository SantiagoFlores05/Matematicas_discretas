// Función que obtiene y procesa un conjunto desde input HTML según id
function obtenerConjunto(id) {
    // Separa los elementos por comas, elimina espacios innecesarios y los devuelve como arreglo
    return document.getElementById(id).value.split(',').map(e => e.trim());
}

// Función principal que procesa un único conjunto ingresado por el usuario
function procesarConjunto() {
    const conjunto = obtenerConjunto('setInput'); 
    const validacion = validarConjunto(conjunto);

    // Retorno de validación fallida
    if (!validacion.esValido) {
        document.getElementById('result').innerHTML = validacion.mensaje;
        return;
    }

    // Generación de subconjuntos y subconjuntos propios
    const subconjuntos = generarSubconjuntos(conjunto);
    const propios = subconjuntos.filter(sub => sub.length !== conjunto.length); // Excluye el conjunto completo

    // Cálculo del número de Bell y particiones
    const bell = calcularNumeroBell(conjunto.length);
    const particiones = particionesConjunto(conjunto);

    // Salida HTML con todos los resultados obtenidos
    const output = `
        <h3>Subconjuntos:</h3><p>${subconjuntos.map(s => `[${s}]`).join(', ')}</p>
        <h3>Subconjuntos Propios:</h3><p>${propios.map(s => `[${s}]`).join(', ')}</p>
        <h3>Número de Subconjuntos: ${subconjuntos.length}</h3>
        <h3>Número de Subconjuntos Propios: ${propios.length}</h3>
        <h3>Número de Bell (Particiones): ${bell}</h3>
        <h3>Particiones:</h3><p>${particiones.map(p => `[${p.join('], [')}]`).join('<br>')}</p>
        <h3>Conjunto Potencia:</h3><p>${subconjuntos.map(s => `[${s}]`).join(', ')}</p>
    `;
    document.getElementById('result').innerHTML = output;
}

// Función del producto cartesiano 
function calcularProductoCartesiano() {
    const A = obtenerConjunto('setInput');
    const B = obtenerConjunto('setInput2');

    const validA = validarConjunto(A);
    const validB = validarConjunto(B);

    // Verificación de conjuntos
    if (!validA.esValido || !validB.esValido) {
        document.getElementById('cartesianResult').innerHTML = "Todos los elementos deben ser solo letras o solo números.";
        return;
    }

    // Genera el producto cartesiano 
    const producto = A.flatMap(a => B.map(b => `(${a}, ${b})`));
    document.getElementById('cartesianResult').innerHTML =
        `<h3>Producto Cartesiano:</h3><p>${producto.join(', ')}</p>`;
}

// Función que genera todos los subconjuntos 
function generarSubconjuntos(conjunto) {
    return conjunto.reduce((subs, val) =>
        subs.concat(subs.map(sub => [val, ...sub])), [[]]);
}

// Función que calcula el número de Bell para determinar el número de particiones de un conjunto
function calcularNumeroBell(n) {
    const bell = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    bell[0][0] = 1;

    for (let i = 1; i <= n; i++) {
        bell[i][0] = bell[i - 1][i - 1];
        for (let j = 1; j <= i; j++) {
            bell[i][j] = bell[i - 1][j - 1] + bell[i][j - 1];
        }
    }
    return bell[n][0];
}

// Función que genera todas las posibles particiones de un conjunto
function particionesConjunto(conjunto) {
    if (conjunto.length === 0) return [[]];
    if (conjunto.length === 1) return [[conjunto]];

    const resultado = [];

    // Función que genera combinaciones de subconjuntos agrupados
    const generarParticiones = (particion, index, sublista) => {
        if (index >= conjunto.length) {
            resultado.push(particion);
            return;
        }
        generarParticiones([...particion, [...sublista, conjunto[index]]], index + 1, []);
        generarParticiones(particion, index + 1, [...sublista, conjunto[index]]);
    };

    generarParticiones([], 0, []);
    return resultado;
}

// Función que valida que el conjunto no tenga elementos repetidos y que todos sean letras o todos números
function validarConjunto(conjunto) {
    if (new Set(conjunto).size !== conjunto.length) {
        return { esValido: false, mensaje: "El conjunto contiene elementos repetidos." };
    }
    
    const sonLetras = conjunto.every(e => /^[a-zA-Z]+$/.test(e));
    const sonNumeros = conjunto.every(e => /^[0-9]+$/.test(e));

    if (!(sonLetras || sonNumeros)) {
        return { esValido: false, mensaje: "Todos los elementos deben ser solo letras o solo números." };
    }

    return { esValido: true, mensaje: "" };
}
