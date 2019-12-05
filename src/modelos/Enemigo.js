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
        this.velocidadInteligencia = -1;
        this.vx = this.velocidadInteligencia;
        this.vy = 0;
        // Por defecto un enemigo muere de un golpe
        this.vidas = 1;
    }
    dibujar (scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
    impactado() {
        if (this.vidas > 0)
            this.vidas--;
        if (this.vidas == 0 && this.estado != estados.muriendo) {
            this.estado = estados.muriendo;
            return this.itemAlMorir();
        }
        return null;
    }

    /**
     * Los enemigos dejan un item al morir (a veces)
     * Es mas probable que no deje nada (40% objeto 60% nada)
     */
    itemAlMorir() {
        var random = Math.floor(Math.random() * 7.5) + 1;  // numero entre [1-7]
        var item = null;
        if (random == 1) {
            item = new ItemAnimado(imagenes.corazon,imagenes.corazon_animado,this.x,this.y);
            item.y = item.y - item.alto/2;
        }
        else if (random == 2) {
            item = new ItemAnimado(imagenes.rupia,imagenes.rupia_animacion,this.x,this.y);
            item.y = item.y - item.alto/2;
        }
        else if (random == 3) {
            item = new Item(imagenes.flecha_arriba,this.x,this.y);
            item.y = item.y - item.alto/2;
        }
        return item;
    }

    disparar() {return null;}
    perseguir(jugadorX, jugadorY) {return false;}
}