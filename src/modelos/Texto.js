class Texto {
    constructor(valor, x, y, symbol, color) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    dibujar(){
        contexto.font = "20px Pixel NES";
        contexto.fillStyle = this.color;
        contexto.textAlign = "left";
        contexto.fillText(this.symbol+this.valor,this.x,this.y);
    }
}
