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
        speed_x : {
            current_speed : 0,
            max_speed : 2,
            acceleration : 0.2,
        },
        speed_y : {
            current_speed : 0,
            max_speed : 3.8,
            acceleration : 0,
        }
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
        mov.RIGHT = 1;

        setInterval( loop, 1000/60 );
    }

    function loop() {
        // fpsCount();
        // console.log( fps.result );

        //console.log( mov );
        update();
        draw();
    }

    function update() {
        ballMovement();
    }

    function draw() {
        context.clearRect( 0, 0, canvas.width, canvas.height );
        context.fillStyle = "#000";
        context.fillRect( 0, 0, canvas.width, canvas.height );
        context.fillStyle = "#fff";
        context.fillRect( ball.x, ball.y, ball.width, ball.height );
    }

    function createCanvas( id, width, height ) {
        var canvas = document.createElement( 'canvas' );
        canvas.setAttribute( 'width', width );
        canvas.setAttribute( 'height', height );
        canvas.setAttribute( 'id', id );

        return canvas;
    }

    function ballMovement() {
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

        // if( mov.LEFT ) {
        //     if( ball.x > 0 ) {
        //         ball.x -= ball.speed_x.current_speed;
        //     } else {
        //         mov.LEFT = 0;
        //         mov.RIGHT = 1;
        //     }
        // }
        //
        // if( mov.RIGHT ) {
        //     if( ball.x < canvas.width - ball.width ) {
        //         ball.x += ball.speed_x.current_speed;
        //     } else {
        //         mov.LEFT = 1;
        //         mov.RIGHT = 0;
        //     }
        // }
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
