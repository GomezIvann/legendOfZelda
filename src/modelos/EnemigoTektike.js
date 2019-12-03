class EnemigoTektike extends Enemigo {
    constructor(x, y) {
        super(imagenes.tektike, x, y);
        this.animacion = new Animacion(imagenes.tektike_animacion, this.ancho, this.alto, 4, 2);
        this.velocidadInteligencia = -2;
        this.vx = this.velocidadInteligencia;
    }
    actualizar (){
        this.animacion.actualizar();
        if (this.estado == estados.muriendo) {
            this.vx = 0;
            this.estado = estados.muerto;
        } else {
            if (this.vx == 0) { // choque
                this.velocidadInteligencia *= -1;
                this.vx = this.velocidadInteligencia;

                if (this.orientacion == orientaciones.izquierda)
                    this.orientacion = orientaciones.derecha;
                else
                    this.orientacion = orientaciones.izquierda;
            }
        }
    }
}