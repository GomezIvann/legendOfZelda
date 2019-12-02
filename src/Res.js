// Lista re recursos a precargar
var cache = [];
var imagenes = {
    link : "res/link.png",
    link_derecha : "res/link-derecha.png",
    link_izquierda : "res/link-izquierda.png",
    link_arriba : "res/link-arriba.png",
    fondo : "res/fondo.png",
    tektike: "res/tektike.png",
    tektike_animacion: "res/tektike-animacion.png",
    espada_derecha : "res/espada-derecha.png",
    espada_izquierda : "res/espada-izquierda.png",
    espada_arriba : "res/espada-arriba.png",
    espada_abajo : "res/espada-abajo.png",
    espada_oscura_derecha : "res/espada-oscura-derecha.png",
    espada_oscura_izquierda : "res/espada-oscura-izquierda.png",
    espada_oscura_arriba : "res/espada-oscura-arriba.png",
    espada_oscura_abajo : "res/espada-oscura-abajo.png",
    flecha_derecha : "res/flecha-derecha.png",
    flecha_izquierda : "res/flecha-izquierda.png",
    flecha_arriba : "res/flecha-arriba.png",
    flecha_abajo : "res/flecha-abajo.png",
    link_avance_derecha:"res/link-avance-derecha.png",
    link_avance_izquierda:"res/link-avance-izquierda.png",
    link_avance_arriba:"res/link-avance-arriba.png",
    link_avance_abajo:"res/link-avance-abajo.png",
    link_ataque_derecha: "res/link-ataque-derecha.png",
    link_ataque_izquierda: "res/link-ataque-izquierda.png",
    link_ataque_arriba: "res/link-ataque-arriba.png",
    link_ataque_abajo: "res/link-ataque-abajo.png",
    bloque_relleno: "res/bloque-relleno.png",
    bloque_cueva: "res/bloque-cueva.png",
    bloque_borde: "res/bloque-borde.png",
    bloque_inferior_derecha: "res/bloque-inferior-derecha.png",
    bloque_superior_derecha: "res/bloque-superior-derecha.png",
    bloque_inferior_izquierda: "res/bloque-inferior-izquierda.png",
    bloque_superior_izquierda: "res/bloque-superior-izquierda.png",
    copa : "res/copa.png",
    menu : "res/menu.png",
    savePoint: "res/moneda.png",
    salvaje: "res/salvaje.png",
    salvaje_mov_izquierda: "res/salvaje_izquierda.png",
    salvaje_mov_derecha: "res/salvaje_derecha.png",
    salvaje_giro_der: "res/salvaje_giro_hacia_der.png",
    salvaje_giro_izq: "res/salvaje_giro_hacia_izq.png",
    salvaje_muerte_izq: "res/salvaje_muerte_izq.png",
    salvaje_muerte_der: "res/salvaje_muerte_der.png",
    disparo_lanza_der: "res/lanzaDer.png",
    disparo_lanza_izq: "res/lanzaIzq.png",
    octorok: "res/octorok.png",
    octorok_derecha: "res/octorok-derecha.png",
    octorok_izquierda: "res/octorok-izquierda.png",
    octorok_arriba: "res/octorok-arriba.png",
    octorok_abajo: "res/octorok-abajo.png",
    puerta: "res/puerta.png",
    arbol: "res/arbol.png",
    agua: "res/agua.png",
    icono_vida: "res/vida.png",
    icono_vida_vacia: "res/vida-vacia.png",
    rupia: "res/rupia.png",
    rupia_animacion: "res/rupia-animacion.png",
    icono_rupias: "res/icono-rupias.png",
    icono_llaves: "res/icono-llaves.png",
    icono_flechas: "res/icono-flechas.png",
    roca: "res/roca.png",
    roca_animacion: "res/roca-animacion.png",
    marcador1_espada: "res/marcador1-espada.png",
    marcador2_arco: "res/marcador2-flecha.png",
    arco: "res/arco.png",
    corazon: "res/corazon.png",
    corazon_animado: "res/corazon-animacion.png",
    llave: "res/llave.png",
};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    cache[rutasImagenes[indice]] = new Image();
    cache[rutasImagenes[indice]].src = rutasImagenes[indice];
    cache[rutasImagenes[indice]].onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}