// Procesar conjunto: subconjuntos, particiones, conjunto potencia
function procesarConjunto() {
    let setInput = document.getElementById('setInput').value.split(',').map(e => e.trim());
    let validacion = validarConjunto(setInput);
    if (!validacion.esValido) {
        document.getElementById('result').innerHTML = validacion.mensaje;
        return;
    }

    let subconjuntos = generarSubconjuntos(setInput);
    let subconjuntosPropios = subconjuntos.filter(sub => sub.length !== setInput.length);
    let numeroBell = calcularNumeroBell(setInput.length);
    let particiones = particionesConjunto(setInput);

    let output = `
        <h3>Subconjuntos:</h3>
        <p>${subconjuntos.map(sub => `[${sub}]`).join(', ')}</p>
        <h3>Subconjuntos Propios:</h3>
        <p>${subconjuntosPropios.map(sub => `[${sub}]`).join(', ')}</p>
        <h3>Número de Subconjuntos: ${subconjuntos.length}</h3>
        <h3>Número de Subconjuntos Propios: ${subconjuntosPropios.length}</h3>
        <h3>Número de Bell (Particiones): ${numeroBell}</h3>
        <h3>Particiones:</h3>
        <p>${particiones.map(part => `[${part.join('], [')}]`).join('<br>')}</p>
        <h3>Conjunto Potencia:</h3>
        <p>${subconjuntos.map(sub => `[${sub}]`).join(', ')}</p>
    `;
    document.getElementById('result').innerHTML = output;
}

function calcularProductoCartesiano() {
    let setInput = document.getElementById('setInput').value.split(',').map(e => e.trim());
    let setInput2 = document.getElementById('setInput2').value.split(',').map(e => e.trim());
    let validacionA = validarConjunto(setInput);
    let validacionB = validarConjunto(setInput2);
    if (!validacionA.esValido || !validacionB.esValido) {
        document.getElementById('cartesianResult').innerHTML = "Conjuntos inválidos.";
        return;
    }
    
    let productoCartesiano = [];
    for (let a of setInput) {
        for (let b of setInput2) {
            productoCartesiano.push(`(${a}, ${b})`);
        }
    }
    
    document.getElementById('cartesianResult').innerHTML = `<h3>Producto Cartesiano:</h3><p>${productoCartesiano.join(', ')}</p>`;
}

function generarSubconjuntos(conjunto) {
    return conjunto.reduce((subconjuntos, value) => 
        subconjuntos.concat(subconjuntos.map(sub => [value, ...sub])), [[]]);
}

function calcularNumeroBell(n) {
    let bell = new Array(n + 1).fill(0).map(() => new Array(n + 1).fill(0));
    bell[0][0] = 1;
    for (let i = 1; i <= n; i++) {
        bell[i][0] = bell[i - 1][i - 1];
        for (let j = 1; j <= i; j++) {
            bell[i][j] = bell[i - 1][j - 1] + bell[i][j - 1];
        }
    }
    return bell[n][0];
}

function particionesConjunto(conjunto) {
    if (conjunto.length === 0) return [[]];
    if (conjunto.length === 1) return [[conjunto]];

    let resultado = [];
    let agregar = (particion, index, sublista) => {
        if (index >= conjunto.length) {
            resultado.push(particion);
            return;
        }
        agregar(particion.concat([sublista.concat(conjunto[index])]), index + 1, []);
        agregar(particion, index + 1, sublista.concat(conjunto[index]));
    };
    agregar([], 0, []);
    return resultado;
}

function validarConjunto(conjunto) {
    let conjuntoSet = new Set(conjunto);
    if (conjunto.length !== conjuntoSet.size) {
        return { esValido: false, mensaje: "El conjunto contiene elementos repetidos." };
    }
    let tipos = new Set(conjunto.map(e => typeof e));
    if (tipos.size > 1) {
        return { esValido: false, mensaje: "Todos los elementos del conjunto deben ser del mismo tipo." };
    }
    return { esValido: true, mensaje: "" };
}
