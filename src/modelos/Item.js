class Item extends Modelo {
    constructor(imagen, x, y) {
        super(imagen, x, y);
        this.img = imagen;
        this.id = -1; // indice de la puerta si es una llave
    }
    actualizar() {}
    isFlecha() {
        return this.img == imagenes.flecha_arriba;
    }
    isRupia() {
        return this.img == imagenes.rupia;
    }
    isCorazon() {
        return this.img == imagenes.corazon;
    }
    isLlave(){
        return this.img == imagenes.llave;
    }
}