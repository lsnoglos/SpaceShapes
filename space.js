const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 750;

let stars = [];
let planets = [];
let enemyBullets = [];

const enemySpawnRates = [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2, 2.05, 2.1, 2.15, 2.2]; //max 12
const enemySpeeds = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25]; // max 8
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
    { type: 'darkRed', hits: 1, draw: drawMissile, minLevel: 1, createCraters: true },
    { type: 'blue', hits: 1, draw: drawMissile, minLevel: 2, createCraters: true },
    { type: 'white', hits: 1, draw: drawMissile, minLevel: 3, createCraters: true },
    { type: 'orange', hits: 1, draw: drawCometEnemy, minLevel: 4, rotationSpeed: 0.08, createCraters: true },
    { type: 'yellow', hits: 2, draw: drawRotatingEnemy, minLevel: 5, rotationSpeed: 0.15, createCraters: true },
    { type: 'green', hits: 2, draw: drawAsteroid, diagonal: true, minLevel: 6, createCraters: true },
    { type: 'gray', hits: 2, draw: drawZigzagEnemy, zigzag: true, minLevel: 7, zigzagSpeed: 0.2, zigzagHeight: 0.8, createCraters: true },
    { type: 'red', hits: 3, draw: drawMissile, minLevel: 4, followsSpaceship: true, shootsAtLevel: 8, createCraters: true }
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
    drawEnemyBullets();
    updateObstacles();

    context.fillStyle = 'white';
}

function drawSpaceship() {
    context.fillStyle = 'white'; //main
    context.beginPath();
    context.moveTo(spaceship.x, spaceship.y);
    context.lineTo(spaceship.x + 25, spaceship.y + 10); 
    context.lineTo(spaceship.x + 40, spaceship.y);
    context.lineTo(spaceship.x + 25, spaceship.y - 10); 
    context.closePath();
    context.fill();

    context.fillStyle = 'lightgray';
    context.beginPath();
    context.moveTo(spaceship.x + 8, spaceship.y - 4);
    context.lineTo(spaceship.x + 20, spaceship.y - 4);
    context.lineTo(spaceship.x + 20, spaceship.y + 4);
    context.lineTo(spaceship.x + 8, spaceship.y + 4);
    context.closePath();
    context.fill();

    context.fillStyle = 'rgba(0, 200, 255, 0.5)';
    context.beginPath();
    context.moveTo(spaceship.x + 15, spaceship.y - 5);
    context.lineTo(spaceship.x + 30, spaceship.y);
    context.lineTo(spaceship.x + 15, spaceship.y + 5);
    context.closePath();
    context.fill();

    context.fillStyle = 'darkgray';
    context.beginPath();
    context.moveTo(spaceship.x + 8, spaceship.y - 8);
    context.lineTo(spaceship.x, spaceship.y - 16);
    context.lineTo(spaceship.x, spaceship.y + 16);
    context.lineTo(spaceship.x + 8, spaceship.y + 8);
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
    context.shadowColor = 'orange';
    context.beginPath();
    context.moveTo(spaceship.x - 5, spaceship.y - 3);
    context.lineTo(spaceship.x - 10, spaceship.y);
    context.lineTo(spaceship.x - 5, spaceship.y + 3);
    context.closePath();
    context.fill();

    context.strokeStyle = 'gray'; //lines
    context.lineWidth = 0.1;
    context.beginPath();
    context.moveTo(spaceship.x + 10, spaceship.y - 2);
    context.lineTo(spaceship.x + 30, spaceship.y - 2);
    context.moveTo(spaceship.x + 10, spaceship.y + 2);
    context.lineTo(spaceship.x + 30, spaceship.y + 2);
    context.stroke();

    context.shadowBlur = 11;
}

function updateSpaceship() {
    if (spaceship.isMovingUp && spaceship.y - spaceship.speed > 20) {
        spaceship.y -= spaceship.speed;
    } else if (spaceship.isMovingUp) {
        spaceship.y = 20;
    }

    if (spaceship.isMovingDown && spaceship.y + spaceship.speed < canvas.height - 15) {
        spaceship.y += spaceship.speed;
    } else if (spaceship.isMovingDown) {
        spaceship.y = canvas.height - 15;
    }

    if (spaceship.isMovingLeft && spaceship.x - spaceship.speed > 10) {
        spaceship.x -= spaceship.speed;
    } else if (spaceship.isMovingLeft) {
        spaceship.x = 10;
    }

    if (spaceship.isMovingRight && spaceship.x + spaceship.speed < canvas.width - spaceship.width - 10) {
        spaceship.x += spaceship.speed;
    } else if (spaceship.isMovingRight) {
        spaceship.x = canvas.width - spaceship.width - 10;
    }
}

function drawBullets() {
    spaceship.bullets.forEach((bullet, index) => {
        context.fillStyle = 'yellow';
        context.shadowColor = 'yellow';
        context.shadowBlur = 10;
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
                    updateScoreUI();
                }
            }
        });
    });
}

function updateEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            enemyBullets.splice(index, 1);
        }
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function createEnemy() {
    const availableTypes = enemyTypes.filter(type => type.minLevel <= level);
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const size = 20 + Math.random() * 30;
    return {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: size,
        height: size,
        speed: enemySpeed + Math.random() * 2,
        color: type.type,
        hits: type.hits,
        draw: type.draw,
        directionY: Math.random() > 0.5 ? 1 : -1,
        shrink: false,
        shrinkStep: 0,
        diagonal: type.diagonal || false,
        zigzag: type.zigzag || false,
        zigzagCounter: 0,
        zigzagSpeed: type.zigzagSpeed || 1,
        zigzagHeight: type.zigzagHeight || 1,
        rotationSpeed: type.rotationSpeed || 0.1,
        createCraters: type.createCraters || false,
        followsSpaceship: type.followsSpaceship || false,
        shootsAtLevel: type.shootsAtLevel || false
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
            if (enemy.zigzag) {
                enemy.zigzagCounter = (enemy.zigzagCounter + 1) % (60 / enemy.zigzagSpeed);
                let zigzagAmplitude = canvas.height / 8 * enemy.zigzagHeight;
                if (enemy.zigzagCounter < (30 / enemy.zigzagSpeed)) {
                    enemy.y += enemy.zigzagSpeed * zigzagAmplitude / 30;
                } else {
                    enemy.y -= enemy.zigzagSpeed * zigzagAmplitude / 30;
                }
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

function drawEnemyShape(enemy, points) {
    context.beginPath();
    const radius = enemy.width / 2;
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * (Math.PI * 2);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }
    context.closePath();
    context.fill();

}

function addCraters(enemy, craterCount = 5) {
    if (!enemy.craters) {
        enemy.craters = [];
        for (let i = 0; i < craterCount; i++) {
            const craterX = Math.random() * enemy.width - enemy.width / 2;
            const craterY = Math.random() * enemy.height - enemy.height / 2;
            const craterRadius = Math.random() * 5.5;
            enemy.craters.push({ x: craterX, y: craterY, r: craterRadius });
        }
    }
}

function drawCraters(enemy) {
    context.fillStyle = 'rgba(0, 0, 0, 0.9)';
    enemy.craters.forEach(crater => {
        context.beginPath();
        context.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        context.fill();
    });
}

function drawRotatingShape(enemy, drawShape) {
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    if (enemy.rotationSpeed) {
        context.rotate((performance.now() / 1000) * 2 * Math.PI * enemy.rotationSpeed);
    }
    context.fillStyle = enemy.color;
    drawShape(enemy);

    if (enemy.createCraters) {
        addCraters(enemy, 10);
        drawCraters(enemy);
    }

    context.restore();
}

function drawMissile(enemy) {
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    if (enemy.followsSpaceship) {
        const dx = spaceship.x - enemy.x;
        const dy = spaceship.y - enemy.y;
        const angle = Math.atan2(dy, dx);
        context.rotate(angle);
    } else {
        context.rotate(Math.PI);
    }
    context.fillStyle = enemy.color;
    context.beginPath();
    context.moveTo(-enemy.width / 2, -enemy.height / 2);
    context.lineTo(enemy.width / 2, 0);
    context.lineTo(-enemy.width / 2, enemy.height / 2);
    context.closePath();
    context.fill();

    if (enemy.createCraters) {
        addCraters(enemy, 12);
        drawCraters(enemy);
    }

    context.restore();

    if (enemy.shootsAtLevel && level >= enemy.shootsAtLevel) {
        if (!enemy.lastShotTime) {
            enemy.lastShotTime = Date.now();
        }
        if (Date.now() - enemy.lastShotTime > 2000) {
            enemy.lastShotTime = Date.now();
            const dx = spaceship.x - enemy.x;
            const dy = spaceship.y - enemy.y;
            const angle = Math.atan2(dy, dx);
            enemyBullets.push({
                x: enemy.x,
                y: enemy.y,
                width: 7,
                height: 7,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                color: 'red'
            });
        }
    }
}

function drawAsteroid(enemy) {
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    context.fillStyle = enemy.color;
    context.beginPath();
    context.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
    context.fill();

    if (enemy.createCraters) {
        addCraters(enemy, 10);
        drawCraters(enemy);
    }

    context.restore();
}

function drawZigzagEnemyShape(enemy) {
    context.beginPath();
    for (let i = 0; i < 12; i++) {
        let angle = i * Math.PI / 6;
        let radius = i % 2 === 0 ? enemy.width / 2 : enemy.width / 4;
        context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    context.closePath();
    context.fill();

    if (enemy.createCraters) {
        addCraters(enemy, 5);
        drawCraters(enemy);
    }
}

function drawZigzagEnemy(enemy) {
    drawRotatingShape(enemy, drawZigzagEnemyShape);
}

function drawRotatingEnemyShape(enemy) {
    drawEnemyShape(enemy, 6, true);
}

function drawRotatingEnemy(enemy) {
    drawRotatingShape(enemy, drawRotatingEnemyShape);
}

function drawCometEnemyShape(enemy) {
    drawEnemyShape(enemy, 16, true);
}

function drawCometEnemy(enemy) {
    drawRotatingShape(enemy, drawCometEnemyShape);
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

    const collisionBox = {
        x: spaceship.x,
        y: spaceship.y - 10,
        width: 40,
        height: 20
    };

    enemies.forEach((enemy, index) => {
        if (collisionBox.x < enemy.x + enemy.width &&
            collisionBox.x + collisionBox.width > enemy.x &&
            collisionBox.y < enemy.y + enemy.height &&
            collisionBox.y + collisionBox.height > enemy.y) {
            isGameOver = true;
        }
    });

    enemyBullets.forEach((bullet, index) => {
        if (collisionBox.x < bullet.x + bullet.width &&
            collisionBox.x + collisionBox.width > bullet.x &&
            collisionBox.y < bullet.y + bullet.height &&
            collisionBox.y + collisionBox.height > bullet.y) {
            isGameOver = true;
        }
    });

    if (specialStar &&
        collisionBox.x < specialStar.x + specialStar.radius &&
        collisionBox.x + collisionBox.width > specialStar.x &&
        collisionBox.y < specialStar.y + specialStar.radius &&
        collisionBox.y + collisionBox.height > specialStar.y) {
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
        updateEnemyBullets();
        generateObstacles();
        checkCollisions();
        updateLevel();
    }
    draw();

    if (!isGameOver) {
        animationFrameId = requestAnimationFrame(update);
    } else {
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('pause-button').classList.add('hidden');
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
    if (event.code === 'ArrowLeft') {
        spaceship.isMovingLeft = true;
    }
    if (event.code === 'ArrowRight') {
        spaceship.isMovingRight = true;
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
    if (event.code === 'ArrowLeft') {
        spaceship.isMovingLeft = false;
    }
    if (event.code === 'ArrowRight') {
        spaceship.isMovingRight = false;
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
    document.getElementById('pause-button').classList.remove('hidden');
    update();
});

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('up-button').classList.add('hidden');
    document.getElementById('down-button').classList.add('hidden');
    document.getElementById('left-button').classList.add('hidden');
    document.getElementById('right-button').classList.add('hidden');
    document.getElementById('shoot-button').classList.add('hidden');

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('info-container').classList.remove('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    update();
});

document.getElementById('start-button').addEventListener('touchstart', () => {
    document.getElementById('up-button').classList.remove('hidden');
    document.getElementById('down-button').classList.remove('hidden');
    document.getElementById('left-button').classList.remove('hidden');
    document.getElementById('right-button').classList.remove('hidden');
    document.getElementById('shoot-button').classList.remove('hidden');

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('info-container').classList.remove('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    update();
});

document.getElementById('up-button').addEventListener('touchstart', () => {
    spaceship.isMovingUp = true;
});
document.getElementById('up-button').addEventListener('touchend', () => {
    spaceship.isMovingUp = false;
});

document.getElementById('down-button').addEventListener('touchstart', () => {
    spaceship.isMovingDown = true;
});
document.getElementById('down-button').addEventListener('touchend', () => {
    spaceship.isMovingDown = false;
});

document.getElementById('left-button').addEventListener('touchstart', () => {
    spaceship.isMovingLeft = true;
});
document.getElementById('left-button').addEventListener('touchend', () => {
    spaceship.isMovingLeft = false;
});

document.getElementById('right-button').addEventListener('touchstart', () => {
    spaceship.isMovingRight = true;
});
document.getElementById('right-button').addEventListener('touchend', () => {
    spaceship.isMovingRight = false;
});

document.getElementById('shoot-button').addEventListener('touchstart', () => {
    spaceship.shoot();
});

function animateStartScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlanets();
    drawSpaceship();
    requestAnimationFrame(animateStartScreen);
}

createStars(100);
createPlanets(5);
animateStartScreen();
