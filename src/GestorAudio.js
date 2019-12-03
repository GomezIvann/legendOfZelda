var soundtrack = {
    intro : "res/intro.mp3",
    overworld : "res/overworld.mp3",
    trifuerza_obtenida: "res/trifuerza-obtenida.mp3"
};

var musicaAmbiente = null;

var efectos = {
    ataque : "",
};

function reproducirMusica(srcSoundtrack, loop) {
    musicaAmbiente = new Audio(srcSoundtrack);
    musicaAmbiente.loop = loop;
    musicaAmbiente.play();
}
function pararMusica() {
    // musicaAmbiente.stop(); Ya no funciona, deprecated
    // lo que hace stop es basicamente esto:
    musicaAmbiente.pause();
    musicaAmbiente.currentTime = 0;
}
function reproducirEfecto( srcEfecto ) {
    var efecto = new Audio( srcEfecto );
    efecto.play();
}