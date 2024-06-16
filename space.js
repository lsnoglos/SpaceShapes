const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

let stars = [];
let planets = [];

let enemies = [];
let enemySpeed = 1;
let enemySpawnInterval = 1;

let isGameOver = false;

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

const enemyTypes = [
    { type: 'red', draw: drawMissile }
];

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlanets();
    drawSpaceship();
    drawBullets();
    drawEnemies();
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

function updateBullets() { }

function createEnemy() {
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const size = 20 + Math.random() * 30;
    return {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: size,
        height: size,
        speed: enemySpeed + Math.random() * 3,
        color: type.type,
        draw: type.draw,
        directionY: Math.random() > 0.5 ? 1 : -1
    };
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.draw(enemy);
        enemy.x -= enemy.speed;

        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        }
    });
}

function generateObstacles() {
    if (Math.random() < enemySpawnInterval / 60) {
        enemies.push(createEnemy());
    }
}

function drawMissile(enemy) {
    context.fillStyle = enemy.color;
    context.beginPath();
    context.moveTo(enemy.x, enemy.y);
    context.lineTo(enemy.x, enemy.y + enemy.height);
    context.lineTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
    context.closePath();
    context.fill();
}


function createStars(count) {
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function drawStars() {
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    stars.forEach(star => {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
        star.x -= star.speed;
        if (star.x < 0) star.x = canvas.width;
    });
}

function createPlanets(count) {
    for (let i = 0; i < count; i++) {
        planets.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 20 + 10,
            speed: Math.random() * 0.2 + 0.1,
            color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.1)`
        });
    }
}

function drawPlanets() {
    planets.forEach(planet => {
        context.fillStyle = planet.color;
        context.beginPath();
        context.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        context.fill();
        planet.x -= planet.speed;
        if (planet.x < 0) planet.x = canvas.width;
    });
}

function checkCollisions() {
    enemies.forEach((enemy, index) => {
        if (spaceship.x < enemy.x + enemy.width &&
            spaceship.x + spaceship.width > enemy.x &&
            spaceship.y < enemy.y + enemy.height &&
            spaceship.y + spaceship.height > enemy.y) {
            isGameOver = true;
        }
    });
}

function update() {
    if (!isGameOver) {
        updateSpaceship();
        updateBullets();
        generateObstacles();
        checkCollisions();
    }
    draw();

    if (!isGameOver) {
        setTimeout(update, 1000 / 60);
    } else {
        context.fillStyle = 'white';
        context.fillText('GAME OVER', canvas.width / 2 - 50, canvas.height / 2);
    }
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

createStars(100);
createPlanets(5);
update();