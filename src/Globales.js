var entradas = {}; // tipos
entradas.pulsaciones = 1;
entradas.teclado = 2;
entradas.gamepad = 3;
var entrada = entradas.pulsaciones;


var nivelActual = 0;
var nivelMaximo = 2;

var saved = false;

var estados = {};
estados.moviendo = 2; // Incluye parado, derecha , izquierda
estados.saltando = 3;
estados.muriendo = 4;
estados.muerto = 5;
estados.atacando = 6;
estados.impactado = 7;
estados.girando = 8;

var orientaciones = {};
orientaciones.derecha = 2;
orientaciones.izquierda = 3;
orientaciones.arriba = 4;
orientaciones.abajo = 5;