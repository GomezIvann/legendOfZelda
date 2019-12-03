class ItemAnimado extends Item {
    constructor(imagen, animacion, x, y) {
        super(imagen, x, y);
        this.animacion = new Animacion(animacion,
            this.ancho,this.alto,3,2);
    }
    actualizar(){
        this.animacion.actualizar();
    }
    dibujar (scrollX, scrollY){
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
}
