class EnemigoFinal extends Enemigo {
    constructor(x, y) {
        super(imagenes.link_oscuro, x, y);
        this.vidas = 3;
        this.golpeado = false;

        // Disparo
        this.cadencia = 30;

        // Tiempo en retroceso
        this.tiempoRetroceso = 0;

        // Animaciones
        this.aAvanceDerecha = new Animacion(imagenes.link_oscuro_avance_derecha, this.ancho, this.alto, 4, 2);
        this.aAvanceIzquierda = new Animacion(imagenes.link_oscuro_avance_izquierda, this.ancho, this.alto, 4, 2);
        this.aAvanceArriba = new Animacion(imagenes.link_oscuro_avance_arriba, this.ancho, this.alto, 4, 2);
        this.aAvanceAbajo = new Animacion(imagenes.link_oscuro_avance_abajo, this.ancho, this.alto, 4, 2);

        // Ataque
        this.aAtaqueDerecha = new Animacion(imagenes.link_oscuro_ataque_derecha,
            this.ancho, this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueIzquierda = new Animacion(imagenes.link_oscuro_ataque_izquierda,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueArriba = new Animacion(imagenes.link_oscuro_ataque_arriba,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueAbajo = new Animacion(imagenes.link_oscuro_ataque_abajo,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));

        this.animacion = this.aAvanceIzquierda;
        this.vyInteligencia = 1;
        this.vxInteligencia = 1;
    }
    actualizar (){
        this.animacion.actualizar();

        if (!this.golpeado) {
            if ( this.vx > 0 )
                this.orientacion = orientaciones.derecha;
            if ( this.vx < 0 )
                this.orientacion = orientaciones.izquierda;
            if ( this.vy > 0 && this.vx == 0 )
                this.orientacion = orientaciones.abajo;
            if ( this.vy < 0 && this.vx == 0 )
                this.orientacion = orientaciones.arriba;
        }

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
            this.estado = estados.muerto;
        }

        // Tiempo Disparo
        if ( this.cadencia > 0 )
            this.cadencia--;

        // Tiempo Retroceso
        if ( this.tiempoRetroceso > 0 )
            this.tiempoRetroceso--;
        else if (this.tiempoRetroceso == 0 && this.golpeado == true) {
            this.golpeado = false;
            this.vidas--;
        }
    }
    perseguir(jugadorX, jugadorY) {
        var diffX = jugadorX - this.x;
        var diffY = jugadorY - this.y;

        this.vx = Math.sign(diffX) * this.vxInteligencia;
        this.vy = Math.sign(diffY) * this.vyInteligencia;
    }
    retrocesoColision() {
        this.vx = this.vx*-this.velocidad;
        this.vy = this.vy*-this.velocidad;
        this.golpeado = true;
        this.tiempoRetroceso = 3;
    }
    disparar(){
        if (this.cadencia == 0 && this.estado == estados.moviendo) {
            this.vx = 0;
            this.vy = 0;
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