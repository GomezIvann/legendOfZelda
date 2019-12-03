class EnemigoOctorok extends Enemigo {
    constructor(x, y) {
        super(imagenes.octorok, x, y);

        this.aDerecha = new Animacion(imagenes.octorok_derecha,
            this.ancho, this.alto, 4, 2, this.disparar.bind(this));
        this.aIzquierda = new Animacion(imagenes.octorok_izquierda,
            this.ancho, this.alto, 4, 2, this.disparar.bind(this));
        this.aArriba = new Animacion(imagenes.octorok_arriba,
            this.ancho, this.alto, 4, 2, this.disparar.bind(this));
        this.aAbajo = new Animacion(imagenes.octorok_abajo,
            this.ancho, this.alto, 4, 2, this.disparar.bind(this));

        // Ref a la animación actual
        this.animacion = this.aIzquierda;

        this.cadencia = 20;
        this.velocidadInteligencia = -2;
        this.vx = this.velocidadInteligencia;
    }
    disparar() {
        if (this.cadencia == 0 && this.estado == estados.moviendo) {
            var disparo = new DisparoConAnimacion(imagenes.roca, imagenes.roca_animacion, this.x, this.y, this.orientacion); // por defecto a derecha
            if (this.orientacion == orientaciones.derecha) { // derecha
                disparo.x += 20;
                disparo.vy = 0;
            }
            if (this.orientacion == orientaciones.izquierda) { // izquierda
                disparo.x -= 20;
                disparo.vx = disparo.vx * -1;
                disparo.vy = 0;
            }
            else if (this.orientacion == orientaciones.arriba) { // arriba
                disparo.y += 20;
                disparo.vx = 0;
                disparo.vy = disparo.vy * -1;
            }
            else if (this.orientacion == orientaciones.abajo) { // abajo
                disparo.y -= 20;
                disparo.vx = 0;
            }
            this.cadencia = 50;
            return disparo;
        }
        return null;
    }
    actualizar() {
        this.animacion.actualizar();
        switch (this.estado) {
            case estados.moviendo:
                if (this.orientacion == orientaciones.derecha) {
                    this.animacion = this.aDerecha;
                }
                if (this.orientacion == orientaciones.izquierda) {
                    this.animacion = this.aIzquierda;
                }
                if (this.orientacion == orientaciones.arriba) {
                    this.animacion = this.aArriba;
                }
                if (this.orientacion == orientaciones.abajo) {
                    this.animacion = this.aAbajo;
                }
        }

        if (this.estado == estados.muriendo) {
            this.vx = 0;
            this.estado = estados.muerto;
        }
        else {
            if (this.vx == 0) {
                if (this.orientacion == orientaciones.izquierda)
                    this.orientacion = orientaciones.derecha;
                else
                    this.orientacion = orientaciones.izquierda;

                this.velocidadInteligencia = this.velocidadInteligencia * -1;
                this.vx = this.velocidadInteligencia;
            }
        }

        if (this.cadencia > 0) // no valores negativos
            this.cadencia--;
    }
}