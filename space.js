const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

let stars = [];
let planets = [];

const enemySpawnRates = [2, 2.3, 2.6, 2.9, 3.2, 3.5, 3.8, 4.1, 4.4, 4.7, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
const enemySpeeds = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 7, 8];
const spaceshipSpeeds = [5, 5.3, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.4, 7.7, 8, 8.4, 8.8, 9.1, 9.4, 9.7, 10, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12, 12.3];

let enemies = [];
let enemySpeed = enemySpeeds[0];
let enemySpawnInterval = enemySpawnRates[0];

let isGameOver = false;
let score = 0;
let level = 1;
const pointsPerLevel = 30;

const spaceship = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 20,
    color: 'white',
    speed: spaceshipSpeeds[0],
    bullets: [],
    shoot() {
        this.bullets.push({ x: this.x + this.width, y: this.y, width: 5, height: 2, speed: 5 });

    }
};

const enemyTypes = [
    { type: 'red', hits: 2, draw: drawMissile }
];

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlanets();
    drawSpaceship();
    drawBullets();
    drawEnemies();

    context.fillStyle = 'white'
    context.fillText(`Score: ${score}`, 10, 20);
    context.fillText(`Level: ${level}`, 10, 40);
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

function updateBullets() {
    spaceship.bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemy.hits--;
                spaceship.bullets.splice(bulletIndex, 1);
                if (enemy.hits === 0) {
                    enemies.splice(enemyIndex, 1);
                    score += enemyTypes.find(type => type.type === enemy.color).hits;
                }
            }
        });
    });
}

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
        hits: type.hits,
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
            score += 1;
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

function updateLevel() {
    level = Math.floor(score / pointsPerLevel) + 1;

    if (level <= enemySpawnRates.length) {
        enemySpawnInterval = enemySpawnRates[level - 1];
        enemySpeed = enemySpeeds[level - 1];
        spaceship.speed = spaceshipSpeeds[level - 1];
    } else {
        enemySpawnInterval = enemySpawnRates[enemySpawnRates.length - 1];
        enemySpeed = enemySpeeds[enemySpeeds.length - 1];
        spaceship.speed = spaceshipSpeeds[spaceshipSpeeds.length - 1];
    }
}

function update() {
    if (!isGameOver) {
        updateSpaceship();
        updateBullets();
        generateObstacles();
        checkCollisions();
        updateLevel();
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