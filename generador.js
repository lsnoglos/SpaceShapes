function generador(cantidad, valorInicial, incremento) {
    const arreglo = [];
    for (let i = 0; i < cantidad; i++) {
        arreglo.push(valorInicial + (i * incremento));
    }
    return arreglo;
}

if (typeof window !== 'undefined') {
    window.generador = generador;
}

if (typeof module !== 'undefined') {
    module.exports = generador;
}
