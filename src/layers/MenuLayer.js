class MenuLayer extends Layer {
    constructor() {
        super();
        this.iniciar();
    }
    iniciar() {
        reproducirMusica(soundtrack.intro);
        this.fondo =
            new Fondo(imagenes.menu,480*0.5,320*0.5);
    }
    dibujar (){
        this.fondo.dibujar();
    }
    procesarControles() {
        if (controles.continuar) {
            gameLayer = new GameLayer();
            layer = gameLayer;
            controles.continuar = false;
        }
    }
}
