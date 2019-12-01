class Texto {
    constructor(valor, x, y) {
        this.valor = valor;
        this.x = x;
        this.y = y;
    }
    dibujar (){
        contexto.font = "20px Pixel NES";
        contexto.fillStyle = "white";
        contexto.textAlign = "left";
        contexto.fillText("X"+this.valor,this.x,this.y);
    }
}
