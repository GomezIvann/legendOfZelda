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

    /**
     * true si es un disparo del jugador (2 tipos: espada o arco)
     * @returns {boolean}
     */
    isDisparoJugador() {
        return this.img == imagenes.espada_derecha || this.img == imagenes.flecha_derecha;
    }

    /**
     * Disparo sin velocidad
     * @returns {boolean}
     */
    destroy() {
        return this.vx == 0 && this.vy == 0;
    }
}
