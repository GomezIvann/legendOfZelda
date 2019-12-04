class Bloque extends Modelo {
    constructor(rutaImagen, x, y, destruible) {
        super(rutaImagen, x, y);
        this.destruible = destruible;
        this.destruido = false;
    }
}
