class GameLayer extends Layer {
    constructor() {
        super();
        this.mensaje = new Fondo(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }
    iniciar() {
        pararMusica();
        reproducirMusica(soundtrack.overworld);
        this.espacio = new Espacio(0);

        this.bloques = [];
        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);
        this.enemigos = [];
        this.items = [];
        this.puertas = [[],[],[],[],[],[]]; // puerta9: [0][0-1], puerta8: [1][0-1], puerta7 [2][0-1]...
        this.disparos = [];
        this.vidas = [];

        this.iconoRupias =
            new Fondo(imagenes.icono_rupias,480*0.67,320*0.045);
        this.rupiasObtenidas = new Texto(0,480*0.7,320*0.07,"X","white");
        this.iconoLlaves =
            new Fondo(imagenes.icono_llaves,480*0.67,320*0.12);
        this.llavesObtenidas = new Texto(0,480*0.7,320*0.14,"X","white");
        this.iconoFlechas =
            new Fondo(imagenes.icono_flechas,480*0.8,320*0.05);
        this.flechasDisponibles = new Texto(0,480*0.84,320*0.07,"X","white");
        this.marcador1 =
            new Fondo(imagenes.marcador1_espada,480*0.48,320*0.075);
        this.espadaMarcador =
            new Fondo(imagenes.espada_arriba,480*0.48,320*0.088);
        this.marcador2 =
            new Fondo(imagenes.marcador2_arco,480*0.58,320*0.075);
        this.arcoMarcador =
            new Fondo(imagenes.arco,480*0.58,320*0.088);

        this.cargarMapa("res/"+nivelActual+".txt");

        this.marcadorVidasJugador();

        this.scrollX = 0;
        this.scrollY = this.jugador.y - 320 * 0.7;
        this.trifuerzaObtenida=false;
        this.delayPuerta = 5;
    }

    actualizar() {
        if (this.pausa)
            return;

        this.espacio.actualizar();
        // sin vidas, reiniciamos
        if (this.jugador.vidas==0) {
            this.pausa = true;
            this.mensaje =
                new Texto(mensajesTexto.derrota, 480/3.25, 320/2, "", "red");
            this.iniciar();
        }

        if (this.trifuerzaObtenida){
            // hemos de ponerlo a false para que al cargar el siguiente mapa
            // no aparezca en la posición del punto de salvado
            saved = false;

            if (this.pausa == false) {
                menuLayer = new MenuLayer();
                layer = menuLayer;
            }
        }

        if ( this.savePoint.colisiona(this.jugador) )
            saved = true;

        // Eliminar disparos sin velocidad y ataque espada si toca
        for (var i=0; i < this.disparos.length; i++){
            if ( this.disparos[i] != null && this.disparos[i].destroy() ){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparos[i]);
                this.disparos.splice(i, 1);
                i--;
            }
        }
        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {
                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);
                j--;
            }
        }
        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparos.length; i++){
            if ( this.disparos[i] != null &&
                !this.disparos[i].estaEnPantalla()){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparos[i]);
                this.disparos.splice(i, 1);
                i--;
            }
        }

        // -----------------------------ACTUALIZAR-----------------------------
        this.jugador.actualizar();

        for (var i=0; i < this.enemigos.length; i++){
            if (this.enemigos[i].perseguir(this.jugador.x, this.jugador.y)){
                this.pausa = true;
                this.mensaje =
                    new Texto(mensajesTexto.enemigoModoCombate, 480/7, 320/2, "","red");
            }

            this.enemigos[i].actualizar();

            // Comprobar si a ese enemigo le toca atacar, si es el caso añadir
            var disparo = this.enemigos[i].disparar();
            if (disparo != null) {
                this.espacio.agregarCuerpoDinamico(disparo);
                this.disparos.push(disparo);
            }
        }
        for (var i=0; i < this.disparos.length; i++) {
            this.disparos[i].actualizar();
        }
        for (var i=0; i < this.items.length; i++){
            this.items[i].actualizar();
        }

        // -----------------------------COLISIONES-----------------------------
        // ¡OJO! Durante el tiempo de invencibilidad del jugador no puede ser atacado (invencible=true) (Colisiones 1 y 2.1)
        // 1. Colisiones, jugador - enemigo
        for (var i=0; i < this.enemigos.length; i++){
            if (this.jugador.colisiona(this.enemigos[i]) && !this.jugador.invencible) {
                this.jugador.retrocesoColision(this.enemigos[i]);
                this.marcadorVidasJugador();
            }
        }

        // 2. Colisiones disparos
        for (var i=0; i < this.disparos.length; i++){
            // 2.1. Colisiones, disparoEnemigo - jugador
            if (this.jugador.colisiona(this.disparos[i]) && !this.disparos[i].isDisparoJugador() && !this.jugador.invencible) {
                this.jugador.retrocesoColision(this.disparos[i]);
                this.marcadorVidasJugador();
                this.espacio
                    .eliminarCuerpoDinamico(this.disparos[i]);
                this.disparos.splice(i, 1);
                i--;
            }

            // 2.2. Colisiones, disparoJugador - enemigo
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparos[i] != null &&
                    this.enemigos[j] != null &&
                    this.enemigos[j].estado != estados.muriendo &&
                    this.disparos[i].colisiona(this.enemigos[j]) &&
                    this.disparos[i].isDisparoJugador() ) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparos[i]);
                    this.disparos.splice(i, 1);
                    i--;

                    var item = this.enemigos[j].impactado();

                    // A VECES al morir el enemigo suelta un item (cuando muere)
                    if (item != null) {
                        this.items.push(item);
                        this.espacio.agregarCuerpoDinamico(item);
                    }
                }
            }
        }
        // 3. Colisiones, jugador - item
        for (var i=0; i < this.items.length; i++){
            if (this.jugador.colisiona(this.items[i])) {
                if (this.items[i].isFlecha()) {
                    this.jugador.flechas += 5;
                    this.items.splice(i, 1);
                    i--;
                }
                else if (this.items[i].isRupia()) {
                    this.rupiasObtenidas.valor++;
                    this.items.splice(i, 1);
                    i--;
                }
                else if (this.items[i].isCorazon()) {
                    this.jugador.masVida();
                    this.marcadorVidasJugador();
                    this.items.splice(i, 1);
                    i--;
                }
                else if (this.items[i].isLlave()) {
                    this.llavesObtenidas.valor++;
                    this.abrirPuerta(this.items[i].id);
                    this.items.splice(i, 1);
                    i--;
                }
                else if (this.items[i].isTrifuerza())
                    this.victoria(i);
            }
        }

        // delay para las puertas
        if (this.delayPuerta > 0)
            this.delayPuerta--;

        // actualizar marcador de flechas
        this.flechasDisponibles.valor=this.jugador.flechas;
    }

    /**
     * Consigue la victoria:
     *      1. Animacion encuentra de Jugador
     *      2. Ajustamos la posicion de la trifuerza para que salga encima de link
     *      3. Pausamos el juego
     *      4. Lanzamos el mensaje
     */
    victoria(i){
        this.trifuerzaObtenida=true;
        this.jugador.encuentraTrifuerza();

        // para que salga encima de link
        this.items[i].x = this.jugador.x;
        this.items[i].y = this.jugador.y-25;

        // lanzamos el mensaje
        this.pausa = true;
        this.mensaje =
            new Texto(mensajesTexto.victoria, 480/6, 320/2, "", "white");
    }

    /**
     * Abre las puertas correspondientes a la llave encontrada
     * @param id de la puerta encontrada
     */
    abrirPuerta(id){
        for (var i=0; i < this.puertas.length; i++) {
            if ( i==id ) {
                this.puertas[i][0].abierta = true;
                this.puertas[i][1].abierta = true;
            }
        }
    }

    /**
     * Actualiza el contador de vidas
     */
    marcadorVidasJugador() {
        for(var i = 0; i < this.jugador.vidas; i++) {
            let x = (480*0.10)+(i*20); // separar vidas
            let vida = new Fondo(imagenes.icono_vida, x,320*0.05);
            this.vidas.push(vida);
        }
        for(var i = this.jugador.vidas; i < this.jugador.maxVidas; i++) {
            let x = (480*0.10)+(i*20); // separar vidas
            let vida = new Fondo(imagenes.icono_vida_vacia, x,320*0.05);
            this.vidas.push(vida);
        }
    }

    calcularScroll() {
        // limite superior
        if ( this.jugador.y > 320 * 0.3) {
            if (this.jugador.y - this.scrollY < 320 * 0.3) {
                this.scrollY = this.jugador.y - 320 * 0.3;
            }
        }
        // limite inferior
        if ( this.jugador.y < this.altoMapa - 320 * 0.3 ) {
            if (this.jugador.y - this.scrollY > 320 * 0.7) {
                this.scrollY = this.jugador.y - 320 * 0.7;
            }
        }
        // limite izquierda
        if ( this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }
        // limite derecha
        if ( this.jugador.x < this.anchoMapa - 480 * 0.3 ) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }
    }

    dibujar(){
        this.calcularScroll();
        this.fondo.dibujar();

        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX, this.scrollY);
        }
        if (!saved) // dibujar solo si no ha colisionado con el punto de salvado
            this.savePoint.dibujar(this.scrollX, this.scrollY);

        // Primero que el jugador, si no saldría por detrás de las puertas!!
        // Dibujar solo puertas abiertas
        for (var i=0; i < this.puertas.length; i++) {
            if ( this.puertas[i][0] != null && this.puertas[i][0].abierta )
                this.puertas[i][0].dibujar(this.scrollX, this.scrollY);
            if ( this.puertas[i][1] != null && this.puertas[i][0].abierta )
                this.puertas[i][1].dibujar(this.scrollX, this.scrollY);
        }

        this.jugador.dibujar(this.scrollX, this.scrollY);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i=0; i < this.disparos.length; i++) {
            this.disparos[i].dibujar(this.scrollX, this.scrollY);
        }
        for (var i=0; i < this.items.length; i++) {
            this.items[i].dibujar(this.scrollX, this.scrollY);
        }

        // HUD
        for (var i=0; i < this.vidas.length; i++ ){
            this.vidas[i].dibujar();
        }
        this.iconoRupias.dibujar();
        this.rupiasObtenidas.dibujar();
        this.iconoLlaves.dibujar();
        this.llavesObtenidas.dibujar();
        this.iconoFlechas.dibujar();
        this.flechasDisponibles.dibujar();
        this.marcador1.dibujar();
        this.marcador2.dibujar();
        if(this.jugador.espada)
            this.espadaMarcador.dibujar();
        else if (this.jugador.arco)
            this.arcoMarcador.dibujar();

        if ( this.pausa )
            this.mensaje.dibujar();
    }

    /**
     * Si el Jugador ha sido golpeado, durante el tiempo de retroceso, no se puede controlar a Link.
     * Tampoco si está atacando, hasta que termine la animacion.
     * En pausa no se procesan los controles (solo Enter para comenzar).
     */
    procesarControles() {
        if (controles.continuar) {
            controles.continuar = false;
            this.pausa = false;
        }

        if ( !this.jugador.retroceso && this.jugador.estado != estados.atacando && !this.pausa ) {
            // abrir puerta
            if (controles.abrir && this.delayPuerta == 0){
                for (var i=0; i < this.puertas.length; i++){
                    if ( this.puertas[i][0] != null && this.puertas[i][0].abierta && this.jugador.colisiona(this.puertas[i][0])) {
                        this.jugador.x = this.puertas[i][1].x;
                        this.jugador.y = this.puertas[i][1].y;
                        this.delayPuerta = 5;
                    }
                    else if ( this.puertas[i][1] != null && this.puertas[i][0].abierta && this.jugador.colisiona(this.puertas[i][1])) {
                        this.jugador.x = this.puertas[i][0].x;
                        this.jugador.y = this.puertas[i][0].y;
                        this.delayPuerta = 5;
                    }
                }
            }
            // Eje X
            if ( controles.moverX > 0 ){
                this.jugador.moverX(1);
            }else if ( controles.moverX < 0){
                this.jugador.moverX(-1);

            } else {
                this.jugador.moverX(0);
            }
            // Eje Y
            if ( controles.moverY > 0 ){
                this.jugador.moverY(-1);

            } else if ( controles.moverY < 0 ){
                this.jugador.moverY(1);

            } else {
                this.jugador.moverY(0);
            }

            // CAMBIAR ATAQUE
            if ( controles.cambioAtaque ) {
                if ( controles.espada ) {
                    this.jugador.espada = true;
                    this.jugador.arco = false;
                }
                else if ( controles.arco ) {
                    this.jugador.arco = true;
                    this.jugador.espada = false;
                }
            }

            // DISPARAR
            // tiene que ser el ultimo if, porque al atacar el personaje deja de moverse:
            //      if ( this.jugador.estado != estados.atacando )
            // si estuviera arriba moverX y moverY cambiarian vx y vy, que se habian puesto a 0,
            // y en los siguientes frames los controles estan bloqueados
            // haciendo que se mueva solo en la ultima direccion pulsada
            if (controles.disparo) {
                var nuevoDisparo = this.jugador.atacar();
                if ( nuevoDisparo != null ) {
                    this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                    this.disparos.push(nuevoDisparo);
                }
            }
        }
    }

    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);
        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            var simboloAnterior = "";
            this.anchoMapa = (lineas[0].length-1) * 40;
            this.altoMapa = lineas.length * 38;
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 38 + i * 38; // y de abajo
                    this.cargarObjetoMapa(simboloAnterior, simbolo,x,y);
                    simboloAnterior = linea[j];
                }
            }
        }.bind(this);
        fichero.send(null);
    }

    cargarObjetoMapa(simboloAnterior, simbolo, x, y) {
        switch(simbolo) {
            case "A":
                this.savePoint = new Bloque(imagenes.savePoint, x,y);
                this.savePoint.y = this.savePoint.y - this.savePoint.alto/2;
                this.espacio.agregarCuerpoDinamico(this.savePoint);
                break;
            case "T":
                var tektike = new EnemigoTektike(x,y);
                tektike.y = tektike.y - tektike.alto/2;
                this.enemigos.push(tektike);
                this.espacio.agregarCuerpoDinamico(tektike);
                break;
            case "O":
                var octorok = new EnemigoOctorok(x,y);
                octorok.y = octorok.y - octorok.alto/2;
                this.enemigos.push(octorok);
                this.espacio.agregarCuerpoDinamico(octorok);
                break;
            case "S":
                var enemigoS = new EnemigoSalvaje(x,y);
                enemigoS.y = enemigoS.y - enemigoS.alto/2;
                this.enemigos.push(enemigoS);
                this.espacio.agregarCuerpoDinamico(enemigoS);
                break;
            case "1":
                if (saved) // si ha alcanzado el punto de guardado empieza desde el
                    this.jugador = new Jugador(this.savePoint.x, this.savePoint.y+3);
                    // sumamos 3 por la diferencia de px entre el sprite de jugador y el de la moneda
                else {
                    this.jugador = new Jugador(x, y);
                    this.jugador.y = this.jugador.y - this.jugador.alto/2;
                }
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
            case "B":
                var boss = new EnemigoFinal(x,y);
                boss.y = boss.y - boss.alto/2;
                this.enemigos.push(boss);
                this.espacio.agregarCuerpoDinamico(boss);

                // tile debajo, si no queda un hueco
                var sueloCueva = new Bloque(imagenes.puerta, x,y, false);
                sueloCueva.y = sueloCueva.y - sueloCueva.alto/2;
                // no lo añadimos al espacio porque es un tile del suelo
                this.bloques.push(sueloCueva);
                break;
            case "R":
                var rupia = new ItemAnimado(imagenes.rupia,imagenes.rupia_animacion,x,y);
                rupia.y = rupia.y - rupia.alto/2;
                this.items.push(rupia);
                this.espacio.agregarCuerpoDinamico(rupia);
                break;
            case "F":
                var flechas = new Item(imagenes.flecha_arriba,x,y);
                flechas.y = flechas.y - flechas.alto/2;
                this.items.push(flechas);
                this.espacio.agregarCuerpoDinamico(flechas);
                break;
            case "C":
                var corazon = new ItemAnimado(imagenes.corazon,imagenes.corazon_animado,x,y);
                corazon.y = corazon.y - corazon.alto/2;
                this.items.push(corazon);
                this.espacio.agregarCuerpoDinamico(corazon);
                break;
            case "+":
                var bloque = new Bloque(imagenes.bloque_borde, x,y, false);
                bloque.y = bloque.y - bloque.alto/2;
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
            case "#":
                var bloqueRelleno = new Bloque(imagenes.bloque_relleno, x,y, false);
                bloqueRelleno.y = bloqueRelleno.y - bloqueRelleno.alto/2;
                this.bloques.push(bloqueRelleno);
                this.espacio.agregarCuerpoEstatico(bloqueRelleno);
                break;
            case "-":
                var bloqueCueva = new Bloque(imagenes.bloque_cueva, x,y, false);
                bloqueCueva.y = bloqueCueva.y - bloqueCueva.alto/2;
                this.bloques.push(bloqueCueva);
                this.espacio.agregarCuerpoEstatico(bloqueCueva);
                break;
            case "/":
                var sueloCueva = new Bloque(imagenes.puerta, x,y, false);
                sueloCueva.y = sueloCueva.y - sueloCueva.alto/2;
                // no lo añadimos al espacio porque es un tile del suelo (jugador tiene que poder estar encima)
                this.bloques.push(sueloCueva);
                break;
            case "@":
                var bloqueID = new Bloque(imagenes.bloque_inferior_derecha, x,y, true);
                bloqueID.y = bloqueID.y - bloqueID.alto/2;
                this.bloques.push(bloqueID);
                this.espacio.agregarCuerpoEstatico(bloqueID);
                break;
            case "%":
                var bloqueSD = new Bloque(imagenes.bloque_superior_derecha, x,y, true);
                bloqueSD.y = bloqueSD.y - bloqueSD.alto/2;
                this.bloques.push(bloqueSD);
                this.espacio.agregarCuerpoEstatico(bloqueSD);
                break;
            case "&":
                var bloqueII = new Bloque(imagenes.bloque_inferior_izquierda, x,y, true);
                bloqueII.y = bloqueII.y - bloqueII.alto/2;
                this.bloques.push(bloqueII);
                this.espacio.agregarCuerpoEstatico(bloqueII);
                break;
            case "$":
                var bloqueSI = new Bloque(imagenes.bloque_superior_izquierda, x,y, true);
                bloqueSI.y = bloqueSI.y - bloqueSI.alto/2;
                this.bloques.push(bloqueSI);
                this.espacio.agregarCuerpoEstatico(bloqueSI);
                break;
            case "*":
                var arbol = new Bloque(imagenes.arbol, x,y, true);
                arbol.y = arbol.y - arbol.alto/2;
                this.bloques.push(arbol);
                this.espacio.agregarCuerpoEstatico(arbol);
                break;
            case ",":
                var agua = new Bloque(imagenes.agua, x,y, true);
                agua.y = agua.y - agua.alto/2;
                this.bloques.push(agua);
                this.espacio.agregarCuerpoEstatico(agua);
                break;
            case "9":
                if (simboloAnterior == "L") {
                    var llave9 = new Item(imagenes.llave,x,y);
                    llave9.id = 0;
                    llave9.y = llave9.y - llave9.alto/2;
                    this.items.push(llave9);
                    this.espacio.agregarCuerpoDinamico(llave9);
                } else {
                    var puerta9 = new Puerta(x,y);
                    puerta9.y = puerta9.y - puerta9.alto/2;
                    this.puertas[0].push(puerta9);
                    this.espacio.agregarCuerpoDinamico(puerta9);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
            case "8":
                if (simboloAnterior == "L") {
                    var llave8 = new Item(imagenes.llave,x,y);
                    llave8.id = 1;
                    llave8.y = llave8.y - llave8.alto/2;
                    this.items.push(llave8);
                    this.espacio.agregarCuerpoDinamico(llave8);
                } else {
                    var puerta8 = new Puerta(x,y);
                    puerta8.y = puerta8.y - puerta8.alto/2;
                    this.puertas[1].push(puerta8);
                    this.espacio.agregarCuerpoDinamico(puerta8);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
            case "7":
                if (simboloAnterior == "L") {
                    var llave7 = new Item(imagenes.llave,x,y);
                    llave7.id = 2;
                    llave7.y = llave7.y - llave7.alto/2;
                    this.items.push(llave7);
                    this.espacio.agregarCuerpoDinamico(llave7);
                } else {
                    var puerta7 = new Puerta(x,y);
                    puerta7.y = puerta7.y - puerta7.alto/2;
                    this.puertas[2].push(puerta7);
                    this.espacio.agregarCuerpoDinamico(puerta7);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
            case "6":
                if (simboloAnterior == "L") {
                    var llave6 = new Item(imagenes.llave,x,y);
                    llave6.id = 3;
                    llave6.y = llave6.y - llave6.alto/2;
                    this.items.push(llave6);
                    this.espacio.agregarCuerpoDinamico(llave6);
                } else {
                    var puerta6 = new Puerta(x,y);
                    puerta6.y = puerta6.y - puerta6.alto/2;
                    this.puertas[3].push(puerta6);
                    this.espacio.agregarCuerpoDinamico(puerta6);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
            case "5":
                if (simboloAnterior == "L") {
                    var llave5 = new Item(imagenes.llave,x,y);
                    llave5.id = 4;
                    llave5.y = llave5.y - llave5.alto/2;
                    this.items.push(llave5);
                    this.espacio.agregarCuerpoDinamico(llave5);
                } else {
                    var puerta5 = new Puerta(x,y);
                    puerta5.y = puerta5.y - puerta5.alto/2;
                    this.puertas[4].push(puerta5);
                    this.espacio.agregarCuerpoDinamico(puerta5);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
            case "4":
                if (simboloAnterior == "L") {
                    var llave4 = new Item(imagenes.llave,x,y);
                    llave4.id = 5;
                    llave4.y = llave4.y - llave4.alto/2;
                    this.items.push(llave4);
                    this.espacio.agregarCuerpoDinamico(llave4);
                } else {
                    var puerta4 = new Puerta(x,y);
                    puerta4.y = puerta4.y - puerta4.alto/2;
                    this.puertas[5].push(puerta4);
                    this.espacio.agregarCuerpoDinamico(puerta4);

                    // ocultamos el hueco de la puerta mientras no encuentre la llave
                    var b = new Bloque(imagenes.bloque_relleno, x,y);
                    b.y = b.y - b.alto/2;
                    this.bloques.push(b);
                }
                break;
        }
    }
}