class Disparo extends Modelo {
    constructor(imagen, x, y, direccion) {
        super(imagen, x, y);
        this.vx = 7;
        this.vy = 7;
        this.img = imagen;
        this.tiempoVida = 0; // AtaqueEspada.js y ataques con tiempo de duracion limitado
        this.orientacion = direccion;
    }
    actualizar() {}
    isDisparoJugador() {
        return this.img == imagenes.espada_derecha || this.img == imagenes.flecha_derecha;
    }
    isAtaqueEspada() {
        return this.img == imagenes.espada_derecha;
    }
    /**
     * Disparo sin velocidad
     * @returns {boolean}
     */
    destroy() {
        return this.vx == 0 && this.vy == 0;
    }
}
