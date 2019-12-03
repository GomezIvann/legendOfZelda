class EnemigoTektike extends Enemigo {
    constructor(x, y) {
        super(imagenes.tektike, x, y);
        this.animacion = new Animacion(imagenes.tektike_animacion, this.ancho, this.alto, 4, 2);
    }
    actualizar (){
        this.animacion.actualizar();
        if (this.estado == estados.muriendo) {
            this.vx = 0;
            this.estado = estados.muerto;
        } else {
            if (this.vx == 0) { // choque
                this.vxInteligencia *= -1;
                this.vx = this.vxInteligencia;

                if (this.orientacion == orientaciones.izquierda)
                    this.orientacion = orientaciones.derecha;
                else
                    this.orientacion = orientaciones.izquierda;
            }
        }
    }
}