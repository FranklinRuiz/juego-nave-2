var nave;
var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
var bpmText;
var fondoJuego;
var sonido;
var explosion;
var fin;

var Juego = {
    preload: function () {
        juego.load.image('nave', 'assets/image/astronave.png');
        juego.load.image('laser', 'assets/image/laser.png');
        juego.load.image('malo', 'assets/image/meteorito.png');
        juego.load.image('bg', 'assets/image/bg.png');
        juego.load.image('game-over', 'assets/image/game-over.jpg');
        this.load.audio('sonido', 'assets/media/alien_9.mp3');
        this.load.audio('explosion', 'assets/media/explo.mp3');
        this.load.audio('fin', 'assets/media/over.wav');
    },

    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 400, 540, 'bg');
        nave = juego.add.sprite(juego.width / 2, 485, 'nave');
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave, true);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.setBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(50, 'laser');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 0.5);
        balas.setAll('checkWorldBounds', true);
        balas.setAll('outOfBoundsKill', true);

        malos = juego.add.group();
        malos.enableBody = true;
        malos.setBodyType = Phaser.Physics.ARCADE;
        malos.createMultiple(50, 'malo');
        malos.setAll('anchor.x', 0.5);
        malos.setAll('anchor.y', 0.5);
        malos.setAll('checkWorldBounds', true);
        malos.setAll('outOfBoundsKill', true);

        timer = juego.time.events.loop(200, this.crearEnemigo, this);

        puntos = 0;
        juego.add.text(20, 20, 'Puntos: ', { font: '14px Arial', fill: '#FFF' });
        txtPuntos = juego.add.text(80, 20, '0', { font: '14px Arial', fill: '#FFF' });

        vidas = 3;
        juego.add.text(310, 20, 'Vidas: ', { font: '14px Arial', fill: '#FFF' })
        txtVidas = juego.add.text(360, 20, '3', { font: '14px Arial', fill: '#FFF' })

        this.sonido = this.sound.add('sonido');
        this.explosion = this.sound.add('explosion');
        this.fin = this.sound.add('fin');
    },
    update: function () {
        fondoJuego.tilePosition.x -= 1;
        nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI / 2;

        console.log(Math.round(nave.rotation))
        if (Math.round(nave.rotation) == 1) {
            console.log('derecha')
            nave.position.x += 3;
        }

        if (Math.round(nave.rotation) == 5) {
            console.log('izquierda')
            nave.position.x -= 3;
        }


        if (juego.input.activePointer.isDown) {
            this.disparar();
        }

        juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

        malos.forEachAlive(function (m) {
            if (m.position.y > 520 && m.position.y < 521) {
                vidas -= 1;
                txtVidas.text = vidas;
            }
        });

        if (vidas == 0) {
            //juego.state.start('Terminado');
            juego.add.tileSprite(0, 0, 400, 540, 'game-over');
            this.fin.play();
        }

    },
    disparar: function () {
        if (juego.time.now > tiempo && balas.countDead() > 0) {
            this.sonido.play();
            tiempo = juego.time.now + tiempoEntreBalas;
            var bala = balas.getFirstDead();
            bala.anchor.setTo(0.5);
            bala.reset(nave.x, nave.y);
            bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI / 2;
            juego.physics.arcade.moveToPointer(bala, 200);
        }
    },
    crearEnemigo: function () {
        var enem = malos.getFirstDead();
        var num = Math.floor(Math.random() * 10 * 1);
        enem.reset(num * 38, 0);
        enem.anchor.setTo(0.5);
        enem.body.velocity.y = 100;
        enem.checkWorldBonds = true;
        enem.outOfBoundsKill = true;
    },
    colision: function (b, m) {
        this.explosion.play();
        b.kill();
        m.kill();
        puntos++;
        txtPuntos.text = puntos;
    }


};