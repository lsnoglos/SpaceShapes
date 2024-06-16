const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 800;

let stars = [];
let planets = [];

const enemySpawnRates = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]; //max 12
const enemySpeeds = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4]; // max 8
const spaceshipSpeeds = [5, 5.3, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.4, 7.7, 8, 8.4, 8.8, 9.1, 9.4, 9.7, 10, 10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12, 12.3]; //max 12

let enemies = [];
let enemySpeed = enemySpeeds[0];
let enemySpawnInterval = enemySpawnRates[0];

let specialStar = null;
const specialStarInterval = 5 * 1000;
let lastSpecialStarSpawnTime = 0;
let BonusPointsByStar = 10;
let flashTime = 0;

let isGameOver = false;
let score = 0;
let level = 1;
const pointsPerLevel = 30;

let isPaused = false;

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
    { type: 'darkRed', hits: 2, draw: drawMissile },
    { type: 'blue', hits: 2, draw: drawMissile },
    { type: 'white', hits: 1, draw: drawMissile },
    { type: 'darkGray', hits: 5, draw: drawAsteroid, diagonal: true },
    { type: 'blue', hits: 3, draw: drawRotatingEnemy }
];

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (flashTime > 0) {
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        flashTime--;
    }

    drawStars();
    drawPlanets();
    drawSpaceship();
    drawBullets();
    drawEnemies();
    updateObstacles();

    context.fillStyle = 'white'
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
                    updateScore();
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
        directionY: Math.random() > 0.5 ? 1 : -1,
        shrink: false,
        shrinkStep: 0,
        diagonal: type.diagonal || false
    };
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if (enemy.shrink) {
            enemy.width *= 0.9;
            enemy.height *= 0.9;
            context.globalAlpha = Math.max(0, 1 - enemy.shrinkStep);
            context.fillStyle = enemy.color;
            context.shadowColor = 'rgba(255, 255, 255, 1)';
            context.shadowBlur = Math.min(40, enemy.shrinkStep * 80); // ligth effect
            context.beginPath();
            context.arc(enemy.x, enemy.y, Math.max(0, enemy.width / 2), 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = 1;
            context.shadowBlur = 0;
            enemy.shrinkStep += 0.05;
            if (enemy.shrinkStep >= 1) {
                enemies.splice(index, 1);
            }
        } else {
            enemy.draw(enemy);
            enemy.x -= enemy.speed;
            if (enemy.diagonal) {
                enemy.y += enemy.speed * enemy.directionY;
                if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
                    enemy.directionY *= -1;
                }
            }
            if (enemy.x + enemy.width < 0) {
                enemies.splice(index, 1);
                score += 1;
                updateScoreUI();
            }
        }
    });
}

function generateObstacles() {
    if (Math.random() < enemySpawnInterval / 60) {
        enemies.push(createEnemy());
    }
    if (!specialStar && (Date.now() - lastSpecialStarSpawnTime) > specialStarInterval) {
        createSpecialStar();
        lastSpecialStarSpawnTime = Date.now();
    }
}

function updateObstacles() {
    generateObstacles();
    drawEnemies();
    drawSpecialStar();
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

function drawAsteroid(enemy) {
    context.fillStyle = enemy.color;
    context.beginPath();
    context.arc(enemy.x, enemy.y, enemy.width / 2, 0, Math.PI * 2);
    context.fill();
}

function drawRotatingEnemy(enemy) {
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    context.rotate((performance.now() / 1000) * 2 * Math.PI);
    context.fillStyle = enemy.color;
    context.beginPath();
    context.moveTo(-enemy.width / 2, -enemy.height / 2);
    context.lineTo(enemy.width / 2, -enemy.height / 2);
    context.lineTo(0, enemy.height / 2);
    context.closePath();
    context.fill();
    context.restore();
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

function createSpecialStar() {
    specialStar = {
        x: canvas.width,
        y: Math.random() * canvas.height,
        radius: 10,
        speed: 2,
        colors: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 255, 1)', 'rgba(255, 255, 0, 1)', 'rgba(0, 255, 255, 1)', 'rgba(255, 0, 255, 1)'],
        colorIndex: 0,
        originalRadius: 10,
        shrink: false
    };
    setInterval(() => {
        if (specialStar) {
            specialStar.radius = specialStar.originalRadius + Math.sin(performance.now() / 200) * 2;
            specialStar.colorIndex = (specialStar.colorIndex + 1) % specialStar.colors.length;
        }
    }, 100);
}

function drawSpecialStar() {
    if (specialStar) {
        context.save();
        context.fillStyle = specialStar.colors[specialStar.colorIndex];
        context.shadowColor = specialStar.colors[specialStar.colorIndex];
        context.shadowBlur = 20;
        context.beginPath();
        for (let i = 0; i < 5; i++) {
            context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * specialStar.radius + specialStar.x,
                -Math.sin((18 + i * 72) / 180 * Math.PI) * specialStar.radius + specialStar.y);
            context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (specialStar.radius / 2) + specialStar.x,
                -Math.sin((54 + i * 72) / 180 * Math.PI) * (specialStar.radius / 2) + specialStar.y);
        }
        context.closePath();
        context.fill();
        context.restore();
        specialStar.x -= specialStar.speed;
        if (specialStar.x + specialStar.radius < 0) {
            specialStar = null;
        }
    }
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

    if (specialStar &&
        spaceship.x < specialStar.x + specialStar.radius &&
        spaceship.x + spaceship.width > specialStar.x &&
        spaceship.y < specialStar.y + specialStar.radius &&
        spaceship.y + spaceship.height > specialStar.y) {
        score += BonusPointsByStar; // Bonus points
        updateScoreUI();
        specialStar = null;
        enemies.forEach(enemy => {
            enemy.shrink = true;
        });
        flashTime = 30;
    }
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

    updateLevelUI();
}

function update() {
    if (!isGameOver && !isPaused) {
        updateSpaceship();
        updateBullets();
        generateObstacles();
        checkCollisions();
        updateLevel();
    }
    draw();

    if (!isGameOver) {
        animationFrameId = requestAnimationFrame(update);
    } else {
        document.getElementById('game-over').classList.remove('hidden');
        cancelAnimationFrame(animationFrameId);
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

function updateLevelUI() {
    document.getElementById('level').innerText = `Level: ${level}`;
}

function updateScoreUI() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

document.getElementById('pause-button').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-message').classList.toggle('hidden', !isPaused);
    document.getElementById('pause-button').classList.toggle('hidden', isPaused); // Hide pause button when paused
    if (isPaused) {
        cancelAnimationFrame(animationFrameId);
    } else {
        update();
    }
});

document.getElementById('resume-button').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pause-message').classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden'); // Show pause button when resumed
    update();
});

document.getElementById('restart-button').addEventListener('click', () => {
    isGameOver = false;
    score = 0;
    level = 1;
    enemySpeed = enemySpeeds[0];
    enemySpawnInterval = enemySpawnRates[0];
    spaceship.speed = spaceshipSpeeds[0];
    enemies = [];
    spaceship.bullets = [];
    document.getElementById('game-over').classList.add('hidden');
    update();
});

createStars(100);
createPlanets(5);
update();