const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

const spaceship = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 20,
    color: 'white',
    speed: 5,
    bullets: [],
    shoot() {
    this.bullets.push({ x: this.x + this.width, y: this.y, width: 5, height: 2, speed: 5 });

    }
};

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawBullets();
}

function drawSpaceship() {
    context.fillStyle = 'white';

    context.beginPath(); //main
    context.moveTo(spaceship.x, spaceship.y);
    context.lineTo(spaceship.x + 30, spaceship.y + 15);
    context.lineTo(spaceship.x + 50, spaceship.y);
    context.lineTo(spaceship.x + 30, spaceship.y - 15);
    context.closePath();
    context.fill();

    context.fillStyle = 'lightgray'; //cabin
    context.beginPath();
    context.moveTo(spaceship.x + 10, spaceship.y - 5);
    context.lineTo(spaceship.x + 25, spaceship.y - 5);
    context.lineTo(spaceship.x + 25, spaceship.y + 5);
    context.lineTo(spaceship.x + 10, spaceship.y + 5);
    context.closePath();
    context.fill();

    context.fillStyle = 'white'; //wing
    context.beginPath();
    context.moveTo(spaceship.x + 10, spaceship.y - 10);
    context.lineTo(spaceship.x, spaceship.y - 20);
    context.lineTo(spaceship.x, spaceship.y + 20);
    context.lineTo(spaceship.x + 10, spaceship.y + 10);
    context.closePath();
    context.fill();

    context.fillStyle = 'gray'; //motor
    context.beginPath();
    context.moveTo(spaceship.x, spaceship.y - 5);
    context.lineTo(spaceship.x - 5, spaceship.y - 5);
    context.lineTo(spaceship.x - 5, spaceship.y + 5);
    context.lineTo(spaceship.x, spaceship.y + 5);
    context.closePath();
    context.fill();

    context.fillStyle = 'orange'; //fire
    context.beginPath();
    context.moveTo(spaceship.x - 5, spaceship.y - 3);
    context.lineTo(spaceship.x - 10, spaceship.y);
    context.lineTo(spaceship.x - 5, spaceship.y + 3);
    context.closePath();
    context.fill();
}

function updateSpaceship() {
    if (spaceship.isMovingUp && spaceship.y > 0) {
        spaceship.y -= spaceship.speed;
    }
    if (spaceship.isMovingDown && spaceship.y + spaceship.height < canvas.height) {
        spaceship.y += spaceship.speed;
    }
}

function drawBullets() {
    spaceship.bullets.forEach((bullet, index) => {
        context.fillStyle = 'yellow';
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) {
            spaceship.bullets.splice(index, 1);
        }
    });
}

function updateBullets(){}

function update() {
        updateSpaceship();
        updateBullets();
        draw();
        requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowUp') {
        spaceship.isMovingUp = true;
    }
    if (event.code === 'ArrowDown') {
        spaceship.isMovingDown = true;
    }
    if (event.code === 'Space') {
        spaceship.shoot();
    }
});

document.addEventListener('keyup', event => {
    if (event.code === 'ArrowUp') {
        spaceship.isMovingUp = false;
    }
    if (event.code === 'ArrowDown') {
        spaceship.isMovingDown = false;
    }
});

update();