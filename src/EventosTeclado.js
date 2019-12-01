var teclas = [];

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function onKeyDown( event) {
    entrada = entradas.teclado;

    // agregar la tecla pulsada si no estaba
    var posicion = teclas.indexOf(event.keyCode);
    if ( posicion == -1 ) {
        teclas.push(event.keyCode);
        switch ( event.keyCode ){
            case 32:
                controles.disparo = true;
                break;
            case 38:
                controles.moverY = 1;
                break;
            case 40:
                controles.moverY = -1;
                break;
            case 39:
                controles.moverX = 1;
                break;
            case 37:
                controles.moverX = -1;
                break;
            case 65:
                controles.abrir = true;
                break;
            case 13:
                controles.continuar = true;
                break;
            case 49:
                controles.cambioAtaque = true;
                controles.espada = true;
                break;
            case 50:
                controles.cambioAtaque = true;
                controles.arco = true;
                break;
        }
    }
}

function onKeyUp( event) {
    // sacar la tecla pulsada
    var posicion = teclas.indexOf(event.keyCode);
    teclas.splice( posicion, 1);
    switch ( event.keyCode ){
        case 32:
            controles.disparo = false;
            break;
        case 38:
            if ( controles.moverY == 1 ){
                controles.moverY = 0;
            }
            break;
        case 40:
            if ( controles.moverY == -1 ){
                controles.moverY = 0;
            }
            break;
        case 39:
            if ( controles.moverX == 1 ){
                controles.moverX = 0;
            }
            break;
        case 37:
            if ( controles.moverX == -1 ){
                controles.moverX = 0;
            }
            break;
        case 65:
            controles.abrir = false;
            break;
        case 13:
            controles.continuar = false;
            break;
        case 49:
            controles.cambioAtaque = false;
            controles.espada = false;
            break;
        case 50:
            controles.cambioAtaque = false;
            controles.arco = false;
            break;
    }
}
