class EnemigoSalvaje extends Enemigo {
    constructor(x, y) {
        super(imagenes.salvaje, x, y);

        this.aGiroDerecha = new Animacion(imagenes.salvaje_giro_der,
            this.ancho, this.alto, 4, 3, this.finAnimacionGirar.bind(this));
        this.aGiroIzquierda = new Animacion(imagenes.salvaje_giro_izq,
            this.ancho, this.alto, 4, 3, this.finAnimacionGirar.bind(this));
        this.aDerecha = new Animacion(imagenes.salvaje_mov_derecha,
            this.ancho, this.alto, 6, 4, this.disparar.bind(this));
        this.aIzquierda = new Animacion(imagenes.salvaje_mov_izquierda,
            this.ancho, this.alto, 6, 4, this.disparar.bind(this));
        this.aMorirIzquierda = new Animacion(imagenes.salvaje_muerte_izq,
            this.ancho, this.alto, 6, 6, this.finAnimacionMorir.bind(this));
        this.aMorirDerecha = new Animacion(imagenes.salvaje_muerte_der,
            this.ancho, this.alto, 6, 6, this.finAnimacionMorir.bind(this));

        // Ref a la animación actual
        this.animacion = this.aIzquierda;

        this.cadencia = 50;
        this.vxInteligencia = -2;
        this.vx = this.vxInteligencia;
    }
    /**
     * Cuando termina de girar tiene que:
     *      1. Cambiar la velocidad del objeto a la contraria
     *      2. Cambiar la orientacion del enemigo
     *      3. Poner  estado = moviendo para la animacion
     */
    finAnimacionGirar() {
        this.vxInteligencia *= -1;
        this.vx = this.vxInteligencia;
        if (this.orientacion == orientaciones.izquierda)
            this.orientacion = orientaciones.derecha;
        else
            this.orientacion = orientaciones.izquierda;
        this.estado = estados.moviendo;
    }
    disparar() {
        if (this.cadencia == 0 && this.estado == estados.moviendo) {
            var y2 = this.y - 4; //salga a la altura del arco de la animación y no centrado
            var disparo = new Disparo(imagenes.disparo_lanza_der, this.x, y2, this.orientacion);
            disparo.vy = 0;
            if (this.orientacion == orientaciones.izquierda) {
                disparo.cambiarImagen(imagenes.disparo_lanza_izq);
                disparo.vx = disparo.vx * -1; //invertir
                disparo.vy = 0;
            }
            this.cadencia = 50;
            return disparo;
        }
        return null;
    }
    actualizar() {
        this.animacion.actualizar();
        switch (this.estado) {
            case estados.girando:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aGiroIzquierda;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aGiroDerecha;
                }
                break;
            case estados.muriendo:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aMorirDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aMorirIzquierda;
                }
                break;
            case estados.moviendo:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aIzquierda;
                }
        }
        if (this.estado == estados.muriendo) {
            this.vx = 0;
        } else {
            if (this.vx == 0 && this.estado != estados.muerto) // choque
                this.estado = estados.girando;
        }
        if (this.cadencia > 0) // no valores negativos
            this.cadencia--;
    }
    finAnimacionMorir(){
        this.estado = estados.muerto;
    }
}