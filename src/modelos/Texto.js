class Texto {
    constructor(valor, x, y, symbol) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.symbol = symbol;
    }
    dibujar(){
        contexto.font = "20px Pixel NES";
        contexto.fillStyle = "white";
        contexto.textAlign = "left";
        contexto.fillText(this.symbol+this.valor,this.x,this.y);
    }
}
