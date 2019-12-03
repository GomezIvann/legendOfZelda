/**
 * Clase base para implementar un enemigo
 */
class Enemigo extends Modelo {
    constructor(imagenRuta, x, y) {
        super(imagenRuta, x, y);
        this.estado = estados.moviendo;
        this.orientacion = orientaciones.izquierda;
        this.animacion = null;
        // Por defecto un enemigo solo se mueve en el eje x
        this.vxInteligencia = -1;
        this.vx = this.vxInteligencia;
        this.vyInteligencia = 0;
        this.vy = this.vyInteligencia;
    }
    dibujar (scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
    impactado() {
        if (this.estado != estados.muriendo)
            this.estado = estados.muriendo;
        return this.itemAlMorir();
    }

    /**
     * Deja un item al morir
     */
    itemAlMorir() {
        var random = Math.floor(Math.random() * 4) + 1;  // number en [1-4]
        var item = null;
        if (random == 1) {
            item = new ItemAnimado(imagenes.corazon,imagenes.corazon_animado,this.x,this.y);
        }
        else if (random == 2) {
            item = new ItemAnimado(imagenes.rupia,imagenes.rupia_animacion,this.x,this.y);
        }
        else if (random == 3) {
            item = new Item(imagenes.flecha_arriba,this.x,this.y);
        }

        item.y = item.y - item.alto/2;
        return item;
    }

    disparar() {return null;}
    perseguir(jugadorX, jugadorY) {}
}