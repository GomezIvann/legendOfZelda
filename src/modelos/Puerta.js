class Puerta extends Modelo {
    constructor(x, y) {
        super(imagenes.puerta, x, y);
        this.abierta = false;
    }
    abrir() {
        this.abierta = true;
    }
}