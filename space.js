const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 750;

const enemyShootSound = new Audio('assets/sounds/EnemyShooting.mp3');
const enemyImpactSound = new Audio('assets/sounds/EnemyImpact.mp3');
const enemyExplodeSound = new Audio('assets/sounds/EnemyExploit.mp3');
const destroyAllEnemiesSound = new Audio('assets/sounds/destroyAllEnemy.mp3');
const gameOverSound = new Audio('assets/sounds/gameOver.mp3');
const newBulletSound = new Audio('assets/sounds/newBullet.mp3');
const backgroundMusic = new Audio('assets/sounds/play.mp3');

enemyExplodeSound.volume = 0.03;
backgroundMusic.volume = 0.15;

backgroundMusic.loop = true;

let stars = [];
let planets = [];
let enemyBullets = [];

function generador(cantidad, valorInicial, incremento) {
    let arreglo = [];
    for (let i = 0; i < cantidad; i++) {
        arreglo.push(valorInicial + (i * incremento));
    }
    return arreglo;
}

function setDifficulty(difficulty) {
    if (difficulty === "easy") {
        enemySpawnRates = generador(25, 1, 0.01);
        enemySpeeds = generador(25, 0.01, 0.01);
        spaceshipSpeeds = generador(25, 5, 0.1);
    } else if (difficulty === "medium") {
        enemySpawnRates = generador(25, 1, 0.1);
        enemySpeeds = generador(25, 0.5, 0.1);
        spaceshipSpeeds = generador(25, 5, 0.3);
    } else if (difficulty === "hard") {
        enemySpawnRates = generador(25, 2, 0.5);
        enemySpeeds = generador(25, 1, 0.3);
        spaceshipSpeeds = generador(25, 5, 0.4);
    }
}

let enemySpawnRates = [];
let enemySpeeds = [];
let spaceshipSpeeds = [];

let shootingInterval = null;
let specialWeapon = null;
const specialWeaponInterval = 10 * 1000;
let lastSpecialWeaponSpawnTime = 0;
let specialWeaponQueue = [];
let lastShotTime = 0;
let capturedSpecialWeapons = new Set();

const specialWeapons = [
    { name: 'Basic shoot', colorBullet: 'white', sizeBullet: 2.8, level: 1, enemyDamage: 1, impactSize: 1, speed: 5, frequency: 250, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀', isDefault: true },
    { name: 'orange shoot', colorBullet: 'white', sizeBullet: 2.8, level: 2, enemyDamage: 2, impactSize: 1.1, speed: 8, frequency: 200, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀' },
    { name: 'strong', colorBullet: 'white', sizeBullet: 3.1, level: 3, enemyDamage: 3, impactSize: 1.2, speed: 11, frequency: 150, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀' },
    { name: 'Laser', colorBullet: 'white', sizeBullet: 3.4, level: 4, enemyDamage: 4, impactSize: 1.3, speed: 14, frequency: 100, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀' },
    { name: 'double shoot', colorBullet: 'white', sizeBullet: 3.7, level: 5, enemyDamage: 2, impactSize: 1.4, speed: 11, frequency: 150, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀', doubleShoot: true },
    { name: 'cross shoot', colorBullet: 'white', sizeBullet: 4, level: 6, enemyDamage: 2, impactSize: 1.5, speed: 14, frequency: 200, sound: 'assets/sounds/basicShoot.mp3', icon: '🚀', crossShoot: true },
];

let enemies = [];
let enemySpeed = enemySpeeds[0];
let enemySpawnInterval = enemySpawnRates[0];

let specialStar = null;
const specialStarInterval = (Math.random() * 30) * 1000;
let lastSpecialStarSpawnTime = 0;
let BonusPointsByStar = 10;
let flashTime = 0;

let isGameOver = false;
let score = 0;
let level = 1;
const pointsPerLevel = 50;

let isPaused = false;

const spaceship = {
    x: 50,
    y: canvas.height / 2,
    width: 40,
    height: 20,
    color: 'white',
    speed: spaceshipSpeeds[0],
    bullets: [],
    currentWeapon: specialWeapons.find(weapon => weapon.isDefault),
    shoot() {
        const now = Date.now();
        const weapon = this.currentWeapon;
        if (now - lastShotTime >= weapon.frequency) {
            lastShotTime = now;
            const bulletSpeed = weapon.speed;
            const bulletColor = weapon.colorBullet;
            const bulletDamage = weapon.enemyDamage;
            const bulletWidth = weapon.sizeBullet;
            const bulletHeight = weapon.sizeBullet;

            const shootSound = new Audio(weapon.sound);
            shootSound.volume = 0.15;
            shootSound.play();

            if (weapon.crossShoot) {
                this.bullets.push(createBullet(this.x + this.width, this.y, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, bulletSpeed, 0, weapon.impactSize));
                this.bullets.push(createBullet(this.x - bulletWidth, this.y, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, -bulletSpeed, 0, weapon.impactSize));
                this.bullets.push(createBullet(this.x, this.y + bulletHeight, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, 0, bulletSpeed, weapon.impactSize));
                this.bullets.push(createBullet(this.x, this.y - bulletHeight, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, 0, -bulletSpeed, weapon.impactSize));
            } else if (weapon.doubleShoot) {
                this.bullets.push(createBullet(this.x + this.width, this.y - bulletHeight / 0.4, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, bulletSpeed, 0, weapon.impactSize));
                this.bullets.push(createBullet(this.x + this.width, this.y + bulletHeight / 0.4, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, bulletSpeed, 0, weapon.impactSize));
            } else {
                this.bullets.push(createBullet(this.x + this.width, this.y, bulletWidth, bulletHeight, bulletSpeed, bulletColor, bulletDamage, bulletSpeed, 0, weapon.impactSize));
            }

            context.save();
            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            context.shadowBlur = 20;
            context.shadowColor = 'yellow';
            context.shadowOffsetX = 10;
            context.beginPath();
            context.arc(this.x + this.width, this.y, 15, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }
    }
};

const enemyTypes = [
    { type: 'red', hits: 1, draw: drawMissile, minLevel: 1, createCraters: true },
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
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        flashTime--;
    }

    drawStars();
    drawPlanets();
    drawSpaceship();
    drawBullets();
    drawEnemies();
    drawEnemyBullets();
    drawSpecialWeapon();
    updateObstacles();

    context.fillStyle = 'white';
}

function drawSpaceship() {
    context.save();
    context.beginPath();
    context.fillStyle = 'white'; //main
    context.moveTo(spaceship.x, spaceship.y);
    context.lineTo(spaceship.x + 25, spaceship.y + 10);
    context.lineTo(spaceship.x + 40, spaceship.y);
    context.lineTo(spaceship.x + 25, spaceship.y - 10);
    context.closePath();
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = 'lightgray';
    context.moveTo(spaceship.x + 8, spaceship.y - 4);
    context.lineTo(spaceship.x + 20, spaceship.y - 4);
    context.lineTo(spaceship.x + 20, spaceship.y + 4);
    context.lineTo(spaceship.x + 8, spaceship.y + 4);
    context.closePath();
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = 'rgba(0, 200, 255, 0.5)';
    context.moveTo(spaceship.x + 15, spaceship.y - 5);
    context.lineTo(spaceship.x + 30, spaceship.y);
    context.lineTo(spaceship.x + 15, spaceship.y + 5);
    context.closePath();
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = 'darkgray';
    context.moveTo(spaceship.x + 8, spaceship.y - 8);
    context.lineTo(spaceship.x, spaceship.y - 16);
    context.lineTo(spaceship.x, spaceship.y + 16);
    context.lineTo(spaceship.x + 8, spaceship.y + 8);
    context.closePath();
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.fillStyle = 'gray'; //motor
    context.moveTo(spaceship.x, spaceship.y - 5);
    context.lineTo(spaceship.x - 5, spaceship.y - 5);
    context.lineTo(spaceship.x - 5, spaceship.y + 5);
    context.lineTo(spaceship.x, spaceship.y + 5);
    context.closePath();
    context.fill();
    context.restore();

    // Drawing the flame
    context.save();
    context.beginPath();
    context.fillStyle = 'orange';
    context.shadowColor = 'orange';
    context.shadowBlur = 30;
    context.moveTo(spaceship.x - 5, spaceship.y - 3);
    context.lineTo(spaceship.x - 10, spaceship.y - 6);
    context.lineTo(spaceship.x - 15, spaceship.y - 3);
    context.lineTo(spaceship.x - 20, spaceship.y);
    context.lineTo(spaceship.x - 15, spaceship.y + 3);
    context.lineTo(spaceship.x - 10, spaceship.y + 6);
    context.lineTo(spaceship.x - 5, spaceship.y + 3);
    context.closePath();
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.strokeStyle = 'gray'; //lines
    context.lineWidth = 0.1;
    context.moveTo(spaceship.x + 10, spaceship.y - 2);
    context.lineTo(spaceship.x + 30, spaceship.y - 2);
    context.moveTo(spaceship.x + 10, spaceship.y + 2);
    context.lineTo(spaceship.x + 30, spaceship.y + 2);
    context.stroke();
    context.restore();
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

function createBullet(x, y, width, height, speed, color, damage, vx, vy, impactSize) {
    return {
        x, y, width, height, speed, color, damage, vx, vy, impactSize,
        draw() {
            context.save();
            context.fillStyle = this.color;
            context.shadowColor = 'lightBlue';
            context.shadowBlur = 7;

            if (vx > 0) {
                context.shadowOffsetX = -6;
                context.shadowOffsetY = 0;
            } else if (vx < 0) {
                context.shadowOffsetX = 6;
                context.shadowOffsetY = 0;
            } else if (vy > 0) {
                context.shadowOffsetX = 0;
                context.shadowOffsetY = -6;
            } else if (vy < 0) {
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 6;
            }

            context.beginPath();
            context.ellipse(this.x, this.y, this.width, this.height * 1.2, 0, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }
    };
}

function drawBullets() {
    spaceship.bullets.forEach((bullet, index) => {
        bullet.draw();
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        if (bullet.x > canvas.width || bullet.x < 0 || bullet.y > canvas.height || bullet.y < 0) {
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
                while (bullet.damage > 0 && enemy.hits > 0) {
                    enemy.hits--;
                    bullet.damage--;
                    enemy.hitEffectTimer = enemy.hitEffectDuration;
                    if (enemy.hits === 0) {
                        enemy.finalHit = true;
                        enemy.finalHitEffectTimer = 30;
                        enemy.impactSize = bullet.impactSize;
                        score += enemyTypes.find(type => type.type === enemy.color).hits;
                        updateScoreUI();
                        enemyExplodeSound.currentTime = 0;
                        enemyExplodeSound.play();
                    } else {
                        enemyImpactSound.currentTime = 0;
                        enemyImpactSound.play();
                    }
                }
                if (bullet.damage <= 0) {
                    spaceship.bullets.splice(bulletIndex, 1);
                }
            }
        });
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach((bullet, index) => {
        context.fillStyle = bullet.color;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
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

function createEnemy() {
    const availableTypes = enemyTypes.filter(type => type.minLevel <= level);
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const size = 20 + Math.random() * 30;
    return {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: size,
        height: size,
        speed: enemySpeed + Math.random() * 0.9,
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
        shootsAtLevel: type.shootsAtLevel || false,
        hitEffectDuration: 30,
        hitEffectTimer: 0,
        finalHit: false,
        finalHitEffectTimer: 0,
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
            context.shadowBlur = Math.min(40, enemy.shrinkStep * 80); // light effect
            context.beginPath();
            context.arc(enemy.x, enemy.y, Math.max(0, enemy.width / 2), 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = 1;
            context.shadowBlur = 0;
            enemy.shrinkStep += 0.05;
            if (enemy.shrinkStep >= 1) {
                enemies.splice(index, 1);
            }
        } else if (enemy.finalHit) {
            context.save();
            context.shadowColor = enemy.color;
            context.shadowBlur = 40;
            context.globalAlpha = 1;
            enemy.width *= enemy.impactSize;
            enemy.height *= enemy.impactSize;
            enemy.draw(enemy);
            context.restore();
            enemy.finalHitEffectTimer -= 20;
            if (enemy.finalHitEffectTimer <= 0) {
                enemy.shrink = true;
            }
        } else {
            context.save();
            context.shadowColor = enemy.color;
            if (enemy.hitEffectTimer > 0) {
                context.shadowBlur = 30;
                enemy.hitEffectTimer -= 20;
            } else {
                context.shadowBlur = 20;
            }
            enemy.draw(enemy);
            context.restore();

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

function createSpecialWeapon() {
    const availableWeapons = specialWeapons.filter(weapon => weapon.level === level && !capturedSpecialWeapons.has(weapon.name) && weapon.name !== spaceship.currentWeapon.name);

    if (availableWeapons.length === 0) return null;

    const weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
    return {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: 30,
        height: 30,
        speed: 2,
        color: weapon.colorBullet,
        damage: weapon.enemyDamage,
        icon: weapon.icon,
        name: weapon.name,
        rotation: 0,
        rotationSpeed: 0.05,
        originalSize: 28,
        animationType: 'breathing' //breathing or rotation
    };
}

function drawSpecialWeapon() {
    if (specialWeapon) {
        const now = Date.now();
        const blink = Math.floor(now / 500) % 2 === 0;
        context.save();
        context.fillStyle = specialWeapon.color;
        context.shadowColor = specialWeapon.color;

        if (specialWeapon.animationType === 'rotation') {
            context.shadowBlur = blink ? 25 : 0;
            specialWeapon.rotation += specialWeapon.rotationSpeed;
            context.translate(specialWeapon.x + specialWeapon.width / 2, specialWeapon.y + specialWeapon.height / 2);
            context.rotate(specialWeapon.rotation);
            context.font = '25px Arial';
            context.fillText(specialWeapon.icon, -specialWeapon.width / 2, specialWeapon.height / 2);
        } else if (specialWeapon.animationType === 'breathing') {
            context.shadowBlur = 25;
            const scale = 1 + 0.1 * Math.sin(now / 250);
            context.translate(specialWeapon.x, specialWeapon.y);
            context.scale(scale, scale);
            context.font = `${specialWeapon.originalSize * scale}px Arial`;
            context.fillText(specialWeapon.icon, 0, specialWeapon.height);
        }

        context.restore();

        specialWeapon.x -= specialWeapon.speed;
        if (specialWeapon.x + specialWeapon.width < 0) {
            specialWeapon = null;
        }
    }
}

function generateObstacles() {
    if (Math.random() < enemySpawnInterval / 100) {
        enemies.push(createEnemy());
    }
    if (!specialStar && (Date.now() - lastSpecialStarSpawnTime) > specialStarInterval) {
        createSpecialStar();
        lastSpecialStarSpawnTime = Date.now();
    }
    if (!specialWeapon && (Date.now() - lastSpecialWeaponSpawnTime) > specialWeaponInterval) {
        const currentLevelWeapon = specialWeapons.find(weapon => weapon.level === level && weapon.name !== spaceship.currentWeapon.name);
        if (currentLevelWeapon && !capturedSpecialWeapons.has(currentLevelWeapon.name)) {
            specialWeapon = createSpecialWeapon();
            if (specialWeapon) {
                lastSpecialWeaponSpawnTime = Date.now();
            }
        }
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

            enemyShootSound.currentTime = 0;
            enemyShootSound.play();
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
        destroyAllEnemiesSound.currentTime = 0;
        destroyAllEnemiesSound.play();

        enemies.forEach(enemy => {
            enemy.shrink = true;
        });
        enemyBullets = [];
        flashTime = 30;
    }

    if (specialWeapon &&
        collisionBox.x < specialWeapon.x + specialWeapon.width &&
        collisionBox.x + collisionBox.width > specialWeapon.x &&
        collisionBox.y < specialWeapon.y + specialWeapon.height &&
        collisionBox.y + collisionBox.height > specialWeapon.y) {

        newBulletSound.currentTime = 0;
        newBulletSound.play();

        spaceship.currentWeapon = specialWeapons.find(weapon => weapon.name === specialWeapon.name);
        capturedSpecialWeapons.add(specialWeapon.name);
        specialWeapon = null;
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
    if (specialWeapon && specialWeapon.level <= level) {
        specialWeaponQueue.push(specialWeapon);
        specialWeapon = null;
    }
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

        gameOverSound.currentTime = 0;
        gameOverSound.play();

        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('pause-button').classList.add('hidden');
        cancelAnimationFrame(animationFrameId);

        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

function updateLevelUI() {
    document.getElementById('level').innerText = `Level: ${level}`;
}

function updateScoreUI() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

document.getElementById('pause-button').addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-message').classList.toggle('hidden', !isPaused);
    document.getElementById('pause-button').classList.toggle('hidden', isPaused);
    if (isPaused) {
        cancelAnimationFrame(animationFrameId);
    } else {
        update();
    }
});

document.getElementById('resume-button').addEventListener('click', () => {
    isPaused = false;
    document.getElementById('pause-message').classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    update();
});

document.getElementById('restart-button').addEventListener('click', () => {
    resetGame();
    backgroundMusic.play();
    update();
});
document.getElementById('restart-button').addEventListener('touchstart', () => {
    resetGame();
    backgroundMusic.play();
    update();
});

document.getElementById('start-button').addEventListener('click', () => {
    startStatusButtons(false);
    backgroundMusic.play();
    update();
});
document.getElementById('start-button').addEventListener('touchstart', () => {
    startStatusButtons(true);
    backgroundMusic.play();
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
    if (!shootingInterval) {
        shootingInterval = setInterval(() => spaceship.shoot(), spaceship.currentWeapon.frequency);
    }
});

document.getElementById('shoot-button').addEventListener('touchend', () => {
    clearInterval(shootingInterval);
    shootingInterval = null;
});

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
        if (!shootingInterval) {
            shootingInterval = setInterval(() => spaceship.shoot(), spaceship.currentWeapon.frequency);
        }
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
    if (event.code === 'Space') {
        clearInterval(shootingInterval);
        shootingInterval = null;
    }
});

function startStatusButtons(showButtons) {
    const show = showButtons ? 'remove' : 'add';
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    setDifficulty(selectedDifficulty);

    document.getElementById('up-button').classList[show]('hidden');
    document.getElementById('down-button').classList[show]('hidden');
    document.getElementById('left-button').classList[show]('hidden');
    document.getElementById('right-button').classList[show]('hidden');
    document.getElementById('shoot-button').classList[show]('hidden');

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('info-container').classList.remove('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
}

function animateStartScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlanets();
    drawSpaceship();
    requestAnimationFrame(animateStartScreen);
}

function resetGame() {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    setDifficulty(selectedDifficulty);

    shootingInterval = null;
    specialWeapon = null;
    lastSpecialWeaponSpawnTime = 0;
    specialWeaponQueue = [];
    lastShotTime = 0;
    capturedSpecialWeapons = new Set();

    specialStar = null;
    lastSpecialStarSpawnTime = 0;
    BonusPointsByStar = 10;
    flashTime = 0;

    isGameOver = false;
    score = 0;
    level = 1;
    enemySpeed = enemySpeeds[0];
    enemySpawnInterval = enemySpawnRates[0];
    spaceship.speed = spaceshipSpeeds[0];
    spaceship.currentWeapon = specialWeapons.find(weapon => weapon.isDefault);
    enemies = [];
    spaceship.bullets = [];
    enemyBullets = [];
    clearInterval(shootingInterval);
    shootingInterval = null;
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden');

    updateScoreUI();
    updateLevelUI();
}

createStars(100);
createPlanets(5);
animateStartScreen();
