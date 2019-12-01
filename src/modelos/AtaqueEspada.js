class AtaqueEspada extends Disparo {
    constructor(imagen, x, y, direccion) {
        super(imagen, x, y, direccion);
        this.vx = 0;
        this.vy = 0;
        this.tiempoDeVida = 10; // duracion del sprite de la espada
    }
    actualizar() {
        if (this.tiempoDeVida > 0)
            this.tiempoDeVida--;
    }
    /**
     * Ataque espada sin velocidad se elimina cuando su tiempo de vida es 0
     * @returns {boolean}
     */
    destroy() {
        return this.tiempoDeVida==0;
    }
}