class Jugador extends Modelo {
    constructor(x, y) {
        super(imagenes.link, x, y);
        this.estado = estados.moviendo;
        this.orientacion = orientaciones.derecha;
        this.vidas = 3;
        this.maxVidas = 5; // maximo de vidas permitido
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY
        this.velocidad = 3;
        this.retroceso = false; // para elretroceso
        this.invencible = false; // invencible tras golpe

        // Tipos de ataque
        this.espada = true;
        this.arco = false;

        // Disparo
        this.cadenciaDisparo = 24;
        this.tiempoDisparo = 0;

        // Tiempo de invencibilidad
        this.tiempoInvencible = 0;
        this.tiempoRetroceso = 36; // 4 iteraciones

        // Numero de flechas disponibles
        this.flechas = 0;

        // Animaciones
        this.aAvanceDerecha = new Animacion(imagenes.link_avance_derecha, this.ancho, this.alto, 4, 2);
        this.aAvanceIzquierda = new Animacion(imagenes.link_avance_izquierda, this.ancho, this.alto, 4, 2);
        this.aAvanceArriba = new Animacion(imagenes.link_avance_arriba, this.ancho, this.alto, 4, 2);
        this.aAvanceAbajo = new Animacion(imagenes.link_avance_abajo, this.ancho, this.alto, 4, 2);

        // vx = 0
        this.aDerecha = new Animacion(imagenes.link_derecha, this.ancho, this.alto, 4, 1);
        this.aIzquierda = new Animacion(imagenes.link_izquierda, this.ancho, this.alto, 4, 1);
        this.aArriba = new Animacion(imagenes.link_arriba, this.ancho, this.alto, 4, 1);
        this.aAbajo = new Animacion(imagenes.link, this.ancho, this.alto, 4, 1);

        // Ataque
        this.aAtaqueDerecha = new Animacion(imagenes.link_ataque_derecha,
            this.ancho, this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueIzquierda = new Animacion(imagenes.link_ataque_izquierda,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueArriba = new Animacion(imagenes.link_ataque_arriba,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));
        this.aAtaqueAbajo = new Animacion(imagenes.link_ataque_abajo,
            this.ancho,this.alto,4,2,this.finAnimacionAtaque.bind(this));

        this.animacion = this.aDerecha;
    }
    dibujar(scrollX, scrollY){
        scrollX = scrollX || 0;
        scrollY = scrollY || 0;
        if (this.invencible) {
            contexto.globalAlpha = 0.5;
            this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
            contexto.globalAlpha = 1;
        }
        else
            this.animacion.dibujar(this.x - scrollX, this.y - scrollY);
    }
    actualizar(){
        this.animacion.actualizar();

        // Establecer orientación SOLO si no esta en retroceso
        // Durante este tiempo sigue orientado hacia el mismo sitio (como en cualquier videojuegos)
        if (!this.retroceso) {
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
                if ( this.vx == 0 && this.vy == 0 ) {
                    if (this.orientacion == orientaciones.derecha)
                        this.animacion = this.aDerecha;
                    if (this.orientacion == orientaciones.izquierda)
                        this.animacion = this.aIzquierda;
                    if (this.orientacion == orientaciones.arriba)
                        this.animacion = this.aArriba;
                    if (this.orientacion == orientaciones.abajo)
                        this.animacion = this.aAbajo;
                }
                break;
        }

        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 )
            this.tiempoDisparo--;

        // Tiempo Retroceso
        if ( this.tiempoInvencible > 0 )
            this.tiempoInvencible--;

        if (this.tiempoInvencible == this.tiempoRetroceso)
            this.retroceso = false;
        else if (this.tiempoInvencible == 0)
            this.invencible = false;
    }
    moverX (direccion){
        this.vx = direccion * this.velocidad;
    }
    moverY (direccion){
        this.vy = direccion * this.velocidad;
    }
    masVida(){
        if (this.maxVidas > this.vidas)
            this.vidas++;
    }
    retrocesoColision(colision) {
        if ( (this.vx != 0 || this.vy != 0) // en movimiento
            && !this.porDetras(colision)) {
            this.vx *= -this.velocidad;
            this.vy *= -this.velocidad;
        } else {
            this.vx = Math.sign(colision.vx)*this.velocidad*this.velocidad;
            this.vy = Math.sign(colision.vy)*this.velocidad*this.velocidad;
        }
        this.retroceso = true;
        this.invencible = true;
        this.tiempoInvencible = 40;
        this.vidas--;
    }

    /**
     * Retorna true si modelo esta por detras
     * @param modelo
     */
    porDetras (objConMovimiento) {
        if(this.orientacion == objConMovimiento.orientacion) {
            if (this.orientacion == orientaciones.arriba && objConMovimiento.y > this.y) {
                return true;
            } else if (this.orientacion == orientaciones.abajo && objConMovimiento.y < this.y) {
                return true;
            } else if (this.orientacion == orientaciones.izquierda && objConMovimiento.x > this.x) {
                return true;
            } else if (this.orientacion == orientaciones.derecha && objConMovimiento.x < this.x) {
                return true;
            }
        }
        return false;
    }
    atacar(){
        if (this.tiempoDisparo == 0) {
            // mientras dispara no se mueve
            this.vx = 0;
            this.vy = 0;
            // reiniciar Cadencia
            this.estado = estados.atacando;
            this.tiempoDisparo = this.cadenciaDisparo;

            var ataque = null;
            if (this.espada)
                ataque = this.orientacionAtaqueEspada();
            else if (this.arco && this.flechas > 0) {
                ataque = this.orientacionAtaqueArco();
                this.flechas--;
            }
            return ataque;
        }
        else
            return null;
    }
    finAnimacionAtaque(){
        this.estado = estados.moviendo;
    }

    /**
     * Devuelve la espada en funcion de la orientación
     * @returns {Disparo}
     */
    orientacionAtaqueEspada() {
        var espada = new AtaqueEspada(imagenes.espada_derecha, this.x, this.y, this.orientacion);

        if ( this.orientacion == orientaciones.derecha )
            espada.x += 28; // coordinar animacion y espada
        if ( this.orientacion == orientaciones.izquierda ){
            espada.cambiarImagen(imagenes.espada_izquierda);
            espada.x -= 28; // coordinar animacion y espada
        }
        if ( this.orientacion == orientaciones.arriba ){
            espada.cambiarImagen(imagenes.espada_arriba);
            espada.y -= 32; // coordinar animacion y espada
            espada.x -= 6;
        }
        if ( this.orientacion == orientaciones.abajo ){
            espada.cambiarImagen(imagenes.espada_abajo);
            espada.y += 30; // coordinar animacion y espada
            espada.x += 3;
        }
        return espada;
    }

    /**
     * Devuelve la flecha en funcion de la orientación
     * @returns {Disparo}
     */
    orientacionAtaqueArco() {
        var flecha = new Disparo(imagenes.flecha_derecha, this.x, this.y, this.orientacion);

        if (this.orientacion == orientaciones.derecha) {
            flecha.x += 28; // coordinar animacion y flecha
            flecha.vy = 0;
        }
        if (this.orientacion == orientaciones.izquierda) {
            flecha.cambiarImagen(imagenes.flecha_izquierda);
            flecha.x -= 28; // coordinar animacion y flecha
            flecha.vx *= -1;
            flecha.vy = 0;
        }
        if (this.orientacion == orientaciones.arriba) {
            flecha.cambiarImagen(imagenes.flecha_arriba);
            flecha.y -= 32; // coordinar animacion y flecha
            flecha.x -= 6;
            flecha.vx = 0;
            flecha.vy *= -1;
        }
        if (this.orientacion == orientaciones.abajo) {
            flecha.cambiarImagen(imagenes.flecha_abajo);
            flecha.y += 30; // coordinar animacion y flecha
            flecha.x += 3;
            flecha.vx = 0;
        }
        return flecha;
    }
}