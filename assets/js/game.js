(function() {
    // Canvas
    var canvas;
    var context;

    // World
    var gravity = 0.1;

    // Ball
    var ball = {
        x : 0,
        y : 0,
        width : 10,
        height : 10,
        color : '#ff9944',
        speed_x : {
            current_speed : 1,
            max_speed : 2,
            acceleration : 0.2,
        },
        speed_y : {
            current_speed : 0,
            max_speed : 3.2,
            acceleration : 0,
        },
        owner : 0,
    };

    // Player
    var player = {
        x : 0,
        y : 0,
        width : 15,
        height : 80,
        anchor : {
            x : 0 + 20
        },
        color : '#44ff88',
        controls : {
            LEFT : 0,
            RIGHT : 0,
            LAUNCH : 0,
            TACKLE : 0,
        },
        dir : 1,
    };

    // Player
    var player2 = {
        x : 0,
        y : 0,
        width : 15,
        height : 80,
        anchor : {
            x : 0
        },
        color : '#4477DD',
        controls : {
            LEFT : 0,
            RIGHT : 0,
            LAUNCH : 0,
            TACKLE : 0,
        },
        dir : -1,
    };

    // Floor
    var floor = {
        x : 300
    }

    var mov = {
        UP : 0,
        DOWN : 0,
        LEFT : 0,
        RIGHT : 0,
        LAUNCH : 0,
    }

    // General
    var height_limit = floor.x - 100;

    // FPS
    var fps = {
        startTime : 0,
        frameNumber : 0,
        result : 0
    };

    function init() {
        canvas = createCanvas( 'game', 540, 360 );
        document.body.appendChild( canvas );
        context = canvas.getContext( '2d' );

        //Ball
        ball.x = canvas.width/2 - ball.width/2;
        ball.y = height_limit;
        mov.DOWN = 1;
        mov.RIGHT = 0;
        ball.owner = 'p2';

        //Player
        player.x = canvas.width/2 - ball.width/2 - player.width;
        player.anchor.x = player.x + player.width;
        player.y = floor.x - player.height;

        //Player2
        player2.x = canvas.width/2 + ball.width/2;
        player2.anchor.x = player2.x - ball.width;
        player2.y = floor.x - player2.height;

        //Controls
        document.addEventListener( 'keydown', controlActive );
        document.addEventListener( 'keyup', controlRelease );

        setInterval( loop, 1000/60 );
    }

    function controlActive( e ) {
        switch( e.keyCode ) {
            case 37: player.controls.LEFT = 1;
            break;
            case 39: player.controls.RIGHT = 1;
            break;
            case 38: if( ball.owner == 'p1' ) player.controls.LAUNCH = 1;
            break;
            case 40: if( ball.owner != 'p1' ) player.controls.TACKLE = 1;
            break;
            case 65: player2.controls.LEFT = 1;
            break;
            case 68: player2.controls.RIGHT = 1;
            break;
            case 87: if( ball.owner == 'p2' ) player2.controls.LAUNCH = 1;
            break;
            case 83: if( ball.owner != 'p2' ) player2.controls.TACKLE = 1;
            break;
        }
    }

    function controlRelease( e ) {
        switch( e.keyCode ) {
            case 37: player.controls.LEFT = 0; player.controls.FLIP = 1;
            break;
            case 39: player.controls.RIGHT = 0; player.controls.FLIP = 1;
            break;
            case 65: player2.controls.LEFT = 0; player2.controls.FLIP = 1;
            break;
            case 68: player2.controls.RIGHT = 0; player2.controls.FLIP = 1;
            break;
        }
    }

    function loop() {
        // fpsCount();
        // console.log( fps.result );

        update();
        draw();
    }

    function update() {
        ballMovement();

        // Launch
        if( ( player.controls.LAUNCH || player2.controls.LAUNCH ) && ball.owner !== null ) {
            if( ball.owner == 'p1' ) {
                launch( player );
            }
            if( ball.owner == 'p2' ) {
                launch( player2 );
            }
        }

        // Tackle
        if( player.controls.TACKLE && ball.owner != 'p1' ) {
            tackle( player );
        }
        if( player2.controls.TACKLE && ball.owner != 'p2' ) {
            tackle( player2 );
        }

        // Ball Owner
        if( ball.owner === null && mov.LAUNCH == 0 ) {
            var collide_p1 = boxCollision( player.x, player.y, player.width, player.height, ball.x, ball.y, ball.width, ball.height );
            var collide_p2 = boxCollision( player2.x, player2.y, player2.width, player2.height, ball.x, ball.y, ball.width, ball.height );

            if( collide_p1 ) {
                ball.owner = 'p1';
            } else if( collide_p2 ) {
                ball.owner = 'p2';
            }
        }

        // Ball Snap
        if( ball.owner !== 0 ) {
            if( ball.owner == 'p1' ) {
                ball.x = player.anchor.x;
            }
            if( ball.owner == 'p2' ) {
                ball.x = player2.anchor.x;
            }
        }

        // Controls
        playerMovement( player );
        playerMovement( player2 );
    }

    function tackle( player ) {
        player.controls.TACKLE = 0;
        var collide = boxCollision( player.x, player.y, player.width, player.height, ball.x, ball.y, ball.width, ball.height );

        if( collide === true ) {
            switchOwner();
        }
    }

    function switchOwner() {
        if( ball.owner == 'p1' ) {
            ball.owner = 'p2';
        } else if( ball.owner == 'p2' ) {
            ball.owner = 'p1';
        }
    }

    function boxCollision( x, y, width, height, x2, y2, width2, height2 ) {
        if( x + width < x2 || x > x2 + width2 || y + height < y2 || y > y2 + width2 ) {
            return false;
        } else {
            return true;
        }
    }

    function playerMovement( player ) {
        if( player.controls.FLIP ) {
            playerFlip( player );
        }

        if( player.controls.LEFT ) {
            player.x -= 2;
            player.anchor.x -= 2;
        }

        if( player.controls.RIGHT ) {
            player.x += 2;
            player.anchor.x += 2;
        }
    }

    function launch( player ) {
        ball.owner = null;

        if( player.dir == 1 ) {
            mov.RIGHT = 1;
        }

        if( player.dir == -1 ) {
            mov.LEFT = -1;
        }

        ball.y = player.y - ball.height;
        ball.speed_y.max_speed = 4;
        ball.speed_y.current_speed = 4;
        mov.UP = 0;
        mov.DOWN = 0;
        mov.LAUNCH = 1;
        player.controls.LAUNCH = 0;
    }

    function playerFlip( player ) {
        if( player.controls.LEFT ) {
            player.anchor.x = player.x - ball.width;
            player.controls.FLIP = 0;
            player.dir = -1;
        }

        if( player.controls.RIGHT ) {
            player.anchor.x = player.x + player.width;
            player.controls.FLIP = 0;
            player.dir = 1;
        }
    }

    function draw() {
        context.clearRect( 0, 0, canvas.width, canvas.height );
        //Background
        context.fillStyle = "#000";
        context.fillRect( 0, 0, canvas.width, canvas.height );
        //Ball
        context.fillStyle = ball.color;
        context.fillRect( ball.x, ball.y, ball.width, ball.height );
        //Player1
        context.fillStyle = player.color;
        context.fillRect( player.x, player.y, player.width, player.height );
        //Player2
        context.fillStyle = player2.color;
        context.fillRect( player2.x, player2.y, player2.width, player2.height );
    }

    function createCanvas( id, width, height ) {
        var canvas = document.createElement( 'canvas' );
        canvas.setAttribute( 'width', width );
        canvas.setAttribute( 'height', height );
        canvas.setAttribute( 'id', id );

        return canvas;
    }

    function ballMovement() {
        if( mov.LAUNCH ) {
            if( ball.speed_y.current_speed > 0 ) {
                ball.speed_y.current_speed = ball.speed_y.current_speed - gravity;
                ball.y -= ball.speed_y.current_speed;
            } else {
                mov.LAUNCH = 0;
                mov.DOWN = 1;
                ball.speed_y.acceleration = 0;
            }
        }

        if( mov.UP ) {
            if( ball.speed_y.current_speed > 0 ) {
                ball.speed_y.current_speed = ball.speed_y.current_speed - gravity;
                ball.y -= ball.speed_y.current_speed;
            } else {
                mov.UP = 0;
                mov.DOWN = 1;
                ball.speed_y.acceleration = 0;
            }
        }

        if( mov.DOWN ) {
            if( ( ball.y + ball.height ) < floor.x ) {
                ball.speed_y.acceleration = ball.speed_y.acceleration + gravity;
                ball.speed_y.current_speed = ball.speed_y.current_speed + ball.speed_y.acceleration;

                if( ball.speed_y.current_speed > ball.speed_y.max_speed ) {
                    ball.speed_y.current_speed = ball.speed_y.max_speed;
                }

                ball.y += ball.speed_y.current_speed;
            } else {
                mov.DOWN = 0;
                mov.UP = 1;
                ball.speed_y.acceleration = 0;
            }
        }

        if( mov.LEFT ) {
            if( ball.x > 0 ) {
                ball.x -= ball.speed_x.current_speed;
            } else {
                mov.LEFT = 0;
                mov.RIGHT = 1;
            }
        }

        if( mov.RIGHT ) {
            if( ball.x < canvas.width - ball.width ) {
                ball.x += ball.speed_x.current_speed;
            } else {
                mov.LEFT = 1;
                mov.RIGHT = 0;
            }
        }
    }

    function floorCollision( y, height ) {
        if( y + height < floor.x ) {
            return false;
        } else {
            return true;
        }
    }

    function fpsCount() {
        fps.frameNumber++;
        var d = new Date().getTime();
        currentTime = ( d - fps.startTime )/1000;
        result = Math.floor( ( fps.frameNumber / currentTime ) );

        if( currentTime > 1 ){
            fps.startTime = new Date().getTime();
            fps.frameNumber = 0;
            fps.result = result;
        }
    }

    window.onload = init();
})();
