class EnemigoFinal extends Enemigo {
    constructor(x, y) {
        super(imagenes.link_oscuro, x, y);
        this.vidas = 3;
        this.cadencia = 30; // cadencia de disparo
        this.vy = 0;
        this.vx = 0;

        // Animaciones
        this.aAvanceDerecha = new Animacion(imagenes.link_oscuro_avance_derecha, this.ancho, this.alto, 4, 2);
        this.aAvanceIzquierda = new Animacion(imagenes.link_oscuro_avance_izquierda, this.ancho, this.alto, 4, 2);
        this.aAvanceArriba = new Animacion(imagenes.link_oscuro_avance_arriba, this.ancho, this.alto, 4, 2);
        this.aAvanceAbajo = new Animacion(imagenes.link_oscuro_avance_abajo, this.ancho, this.alto, 4, 2);

        // Ataque
        this.aAbajo = new Animacion(imagenes.link_oscuro, this.ancho, this.alto, 4, 1);
        this.aAtaqueDerecha = new Animacion(imagenes.link_oscuro_ataque_derecha,
            this.ancho, this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueIzquierda = new Animacion(imagenes.link_oscuro_ataque_izquierda,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueArriba = new Animacion(imagenes.link_oscuro_ataque_arriba,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueAbajo = new Animacion(imagenes.link_oscuro_ataque_abajo,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));

        this.animacion = this.aAbajo;
        this.orientacion = orientaciones.abajo;
        this.vyInteligencia = 2;
        this.vxInteligencia = 2;
        this.distanciaJugador = 70;
        this.modoBusqueda = false;
    }
    actualizar (){
        this.animacion.actualizar();

        if ( this.vx > 0 )
            this.orientacion = orientaciones.derecha;
        if ( this.vx < 0 )
            this.orientacion = orientaciones.izquierda;
        if ( this.vy > 0 && this.vx == 0 )
            this.orientacion = orientaciones.abajo;
        if ( this.vy < 0 && this.vx == 0 )
            this.orientacion = orientaciones.arriba;

        switch (this.estado) {
            case estados.atacando:
                if (this.orientacion == orientaciones.derecha)
                    this.animacion = this.aAtaqueDerecha;
                if (this.orientacion == orientaciones.izquierda)
                    this.animacion = this.aAtaqueIzquierda;
                if (this.orientacion == orientaciones.arriba)
                    this.animacion = this.aAtaqueArriba;
                if (this.orientacion == orientaciones.abajo)
                    this.animacion = this.aAtaqueAbajo;
                break;
            case estados.moviendo:
                if ( this.vx != 0 ) {
                    if (this.orientacion == orientaciones.derecha)
                        this.animacion = this.aAvanceDerecha;
                    if (this.orientacion == orientaciones.izquierda)
                        this.animacion = this.aAvanceIzquierda;
                }
                if ( this.vy != 0 ) {
                    if (this.orientacion == orientaciones.arriba)
                        this.animacion = this.aAvanceArriba;
                    if (this.orientacion == orientaciones.abajo)
                        this.animacion = this.aAvanceAbajo;
                }
                break;
        }

        if (this.estado == estados.muriendo) {
            this.vx = 0;
            this.vy = 0;
            this.estado = estados.muerto;
        }

        // Tiempo Disparo
        if ( this.cadencia > 0 )
            this.cadencia--;
    }

    /**
     * Cuando el jugador se acerca al jefe final, se activa el modo busqueda
     * (comienza a perseguirle)
     * @param jugadorX
     * @param jugadorY
     */
    perseguir(jugadorX, jugadorY) {
        var diffX = jugadorX - this.x;
        var diffY = jugadorY - this.y;

        if (this.modoBusqueda){
            if (diffX != 0 && diffY != 0) { // reducir velocidad en diagonal (si no se hace imposible esquivar)
                this.vxInteligencia=1.5;
                this.vyInteligencia=1.5;
            }
            this.vx = Math.sign(diffX) * this.vxInteligencia;
            this.vy = Math.sign(diffY) * this.vyInteligencia;
            this.vxInteligencia=2;
            this.vyInteligencia=2;
        }
        else if (diffX <= this.distanciaJugador && diffX >= -this.distanciaJugador
            && diffY >= -this.distanciaJugador && diffY <= this.distanciaJugador){

            this.modoBusqueda=true;
        }
    }
    disparar(){
        if (this.cadencia == 0 && this.estado == estados.moviendo && this.modoBusqueda) {
            this.estado = estados.atacando;
            this.cadencia = 30;
            return this.orientacionAtaque();
        }
        else
            return null;
    }
    finAnimacionAtaque(){
        this.estado = estados.moviendo;
    }
    orientacionAtaque() {
        var espada = new Disparo(imagenes.espada_oscura_derecha, this.x, this.y, this.orientacion);
        if (this.orientacion == orientaciones.derecha) {
            espada.x += 28;
            espada.vy = 0;
        }
        if (this.orientacion == orientaciones.izquierda) {
            espada.cambiarImagen(imagenes.espada_oscura_izquierda);
            espada.x -= 28;
            espada.vx *= -1;
            espada.vy = 0;
        }
        if (this.orientacion == orientaciones.arriba) {
            espada.cambiarImagen(imagenes.espada_oscura_arriba);
            espada.y -= 32;
            espada.x -= 6;
            espada.vx = 0;
            espada.vy *= -1;
        }
        if (this.orientacion == orientaciones.abajo) {
            espada.cambiarImagen(imagenes.espada_oscura_abajo);
            espada.y += 30;
            espada.x += 3;
            espada.vx = 0;
        }
        return espada;
    }
}