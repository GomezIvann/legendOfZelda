class DisparoConAnimacion extends Disparo {
    constructor(imagen, animacion, x, y, direccion) {
        super(imagen, x, y, direccion);
        this.animacion = new Animacion(animacion, this.ancho, this.alto, 4, 2);
    }
    actualizar() {
        this.animacion.actualizar();
    }
    dibujar (scrollX, scrollY) {
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
}