var soundtrack = {
    intro : "res/intro.mp3",
    overworld : "res/overworld.mp3",
};

var musicaAmbiente;

var efectos = {
    disparo : "",
    explosion : "",
};

function reproducirMusica( srcSoundtrack ) {
    musicaAmbiente = new Audio(srcSoundtrack);
    musicaAmbiente.loop = true;
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