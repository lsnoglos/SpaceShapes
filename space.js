const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 750;

const enemyShootSound = new Audio('assets/sounds/EnemyShooting.mp3');
const enemyImpactSound = new Audio('assets/sounds/EnemyImpact.mp3');
const enemyExplodeSound = new Audio('assets/sounds/EnemyExplode.mp3');
const destroyAllEnemiesSound = new Audio('assets/sounds/destroyAllEnemy.mp3');
const gameOverSound = new Audio('assets/sounds/gameOver.mp3');
const newBulletSound = new Audio('assets/sounds/newBullet.mp3');
const lifeSound = new Audio('assets/sounds/up.mp3');

const backgroundMusic = new Audio('assets/sounds/play.mp3');
const winSound = new Audio('assets/sounds/win.mp3');
const newLevelSound = new Audio('assets/sounds/newLevel.mp3');

const basicShoot = 'assets/sounds/basicShoot.mp3';
const orangeShoot = 'assets/sounds/orangeShoot.mp3';
const strongShoot = 'assets/sounds/strongShoot.mp3';
const laserShoot = 'assets/sounds/laserShoot.mp3';
const doubleShoot = 'assets/sounds/doubleShoot.mp3';
const crossShoot = 'assets/sounds/crossShoot.mp3';
const giantEyeMusic = 'assets/sounds/horror.mp3';

const worlds = [
    {
        id: 1,
        name: 'Capricornio',
        colorStart: '#3a0b00',
        colorEnd: '#00210b',
        enemies: [1, 2, 3],
        weapons: [1, 2, 3],
        music: 'assets/sounds/play.mp3'
    },
    {
        id: 2,
        name: 'Virgo',
        colorStart: '#26231e',
        colorEnd: '#c1a68a',
        enemies: [4, 5, 6],
        weapons: [4, 5, 6],
        music: 'assets/sounds/play_2.mp3'
    },
    {
        id: 3,
        name: 'Leo',
        colorStart: '#003e55',
        colorEnd: '#8c4f57',
        enemies: [7, 8],
        weapons: [5, 6],
        music: 'assets/sounds/play_3.mp3'
    },
    {
        id: 4,
        name: 'Andromeda',
        colorStart: '#1b2745',
        colorEnd: '#553311',
        enemies: [9],
        weapons: [5, 6],
        music: 'assets/sounds/play.mp3'
    },
    {
        id: 5,
        name: 'Pegaso',
        colorStart: '#44331b',
        colorEnd: '#111733',
        enemies: [10],
        weapons: [5, 6],
        music: 'assets/sounds/play_2.mp3'
    },
    {
        id: 6,
        name: 'Centauro',
        colorStart: '#102840',
        colorEnd: '#102050',
        enemies: [11],
        weapons: [5, 6],
        music: 'assets/sounds/play_3.mp3'
    }
];

const specialWeapons = [
    { id: 1, name: 'Basic shoot', colorBullet: 'white', sizeBullet: 2.8, enemyDamage: 1, impactSize: 1, speed: 5, frequency: 250, sound: basicShoot, icon: '🚀', isDefault: true },
    { id: 2, name: 'orange shoot', colorBullet: 'white', sizeBullet: 2.8, enemyDamage: 2, impactSize: 1.1, speed: 8, frequency: 200, sound: orangeShoot, icon: '🚀' },
    { id: 3, name: 'strong', colorBullet: 'white', sizeBullet: 3.1, enemyDamage: 3, impactSize: 1.2, speed: 11, frequency: 150, sound: strongShoot, icon: '🚀' },
    { id: 4, name: 'Laser', colorBullet: 'white', sizeBullet: 3.4, enemyDamage: 3, impactSize: 1.3, speed: 14, frequency: 100, sound: laserShoot, icon: '🚀' },
    { id: 5, name: 'double shoot', colorBullet: 'white', sizeBullet: 3.7, enemyDamage: 3, impactSize: 1.4, speed: 11, frequency: 150, sound: doubleShoot, icon: '🚀', doubleShoot: true },
    { id: 6, name: 'cross shoot', colorBullet: 'white', sizeBullet: 4, enemyDamage: 3, impactSize: 1.5, speed: 14, frequency: 200, sound: crossShoot, icon: '🚀', crossShoot: true },
];

const difficulties = [
    {
        difficulty: 'easy',
        params: [
            { worldId: 1, difficultProperties: [generador(25, 0.5, 0.050), generador(25, 0.01, 0.01), generador(25, 5, 0.1)] },
            { worldId: 2, difficultProperties: [generador(25, 1, 0.1), generador(25, 0.1, 0.1), generador(25, 5, 0.2)] },
            { worldId: 3, difficultProperties: [generador(25, 1.5, 0.1), generador(25, 0.2, 0.1), generador(25, 5, 0.3)] },
            { worldId: 4, difficultProperties: [generador(25, 2, 0.1), generador(25, 0.3, 0.1), generador(25, 5, 0.4)] },
            { worldId: 5, difficultProperties: [generador(25, 2.5, 0.1), generador(25, 0.4, 0.1), generador(25, 5, 0.5)] },
            { worldId: 6, difficultProperties: [generador(25, 3, 0.1), generador(25, 0.5, 0.1), generador(25, 5, 0.6)] }
        ]
    },
    {
        difficulty: 'medium',
        params: [
            { worldId: 1, difficultProperties: [generador(25, 1, 0.1), generador(25, 0.5, 0.1), generador(25, 5, 0.3)] },
            { worldId: 2, difficultProperties: [generador(25, 1, 0.2), generador(25, 1, 0.2), generador(25, 5, 0.4)] },
            { worldId: 3, difficultProperties: [generador(25, 1.5, 0.2), generador(25, 1.2, 0.2), generador(25, 5, 0.5)] },
            { worldId: 4, difficultProperties: [generador(25, 2, 0.2), generador(25, 1.4, 0.2), generador(25, 5, 0.6)] },
            { worldId: 5, difficultProperties: [generador(25, 2.5, 0.2), generador(25, 1.6, 0.2), generador(25, 5, 0.7)] },
            { worldId: 6, difficultProperties: [generador(25, 3, 0.2), generador(25, 1.8, 0.2), generador(25, 5, 0.8)] }
        ]
    },
    {
        difficulty: 'hard',
        params: [
            { worldId: 1, difficultProperties: [generador(25, 2, 0.5), generador(25, 1, 0.3), generador(25, 5, 0.4)] },
            { worldId: 2, difficultProperties: [generador(25, 2, 0.7), generador(25, 1, 0.5), generador(25, 5, 0.5)] },
            { worldId: 3, difficultProperties: [generador(25, 2.5, 0.5), generador(25, 1.5, 0.4), generador(25, 5, 0.6)] },
            { worldId: 4, difficultProperties: [generador(25, 3, 0.5), generador(25, 2, 0.4), generador(25, 5, 0.7)] },
            { worldId: 5, difficultProperties: [generador(25, 3.5, 0.5), generador(25, 2.5, 0.4), generador(25, 5, 0.8)] },
            { worldId: 6, difficultProperties: [generador(25, 4, 0.5), generador(25, 3, 0.4), generador(25, 5, 0.9)] }
        ]
    }
];

const enemyTypes = [
    { id: 1, type: 'red', hits: 1, draw: drawMissile, createCraters: true },
    { id: 2, type: 'blue', hits: 1, draw: drawMissile, createCraters: true },
    { id: 3, type: 'white', hits: 1, draw: drawMissile, createCraters: true },
    { id: 4, type: 'orange', hits: 1, draw: drawCometEnemy, rotationSpeed: 0.08, createCraters: true },
    { id: 5, type: 'yellow', hits: 2, draw: drawRotatingEnemy, rotationSpeed: 0.15, createCraters: true },
    { id: 6, type: 'green', hits: 2, draw: drawAsteroid, diagonal: true, createCraters: true },
    { id: 7, type: 'gray', hits: 2, draw: drawZigzagEnemy, zigzag: true, zigzagSpeed: 0.2, zigzagHeight: 0.8, createCraters: true },
    { id: 8, type: 'red', hits: 3, draw: drawMissile, followsSpaceship: true, shootsAtLevel: 8, createCraters: true },
    { id: 9, type: 'purple', hits: 3, draw: drawOctopusEnemy, arms: 6, shootInterval: 2000 },
    { id: 10, type: 'black', hits: 4, draw: drawBlackHoleEnemy, blackhole: true },
    { id: 11, type: 'cyan', hits: 2, draw: drawPhantomEnemy, blinkInterval: 60 }
];

enemyExplodeSound.volume = 0.03;
backgroundMusic.volume = 0.15;
backgroundMusic.loop = true;

let lives = 3;
const lifeInterval = 5 * 60 * 1000;
let isGameOver = false;
let gameOverPlayed = false;
let gameOverHandled = false;
let gamePaused = false;
let isGameWon = false;
let animationFrameId;
let isGameRunning = false;
let intervals = [];

let stars = [];
let planets = [];
let enemyBullets = [];

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

let currentWorld = worlds[0];

let enemies = [];
let enemySpeed = enemySpeeds[0];
let enemySpawnInterval = enemySpawnRates[0];

let specialStar = null;
let showStarIcon = false;
const specialStarInterval = (Math.random() * 120) * 1000;
let lastSpecialStarSpawnTime = 0;
let BonusPointsByStar = 10;
let flashTime = 0;

let score = 0;
let level = 1;

let specialHeart = null;
const specialHeartInterval = 2 * 60 * 1000;
let lastSpecialHeartSpawnTime = 0;

let explosions = [];

let scorePopups = [];

const enemiesToAdvance = { easy: 8, medium: 12, hard: 16 };
let enemiesDestroyed = 0;

let worldTransitionDuration = 3000;

let currentDifficulty = 'easy';

const bigEnemies = [
    {
        id: 'giantEye',
        spawnAfterWorld: 3,
        hitsToExplode: { easy: 50, medium: 100, hard: 200 },
        irritateAfter: { easy: 10, medium: 5, hard: 3 },
        bulletAngles: { easy: 10, medium: 15, hard: 20 },
        damagePerHit: { easy: 1.5, medium: 1, hard: 0.5 },
        closeAfterHits: { easy: 12, medium: 9, hard: 6 },
        score: 100
    }
];

let giantEye = null;
let bossFight = false;
let giantEyeDefeated = false;
let giantEyeFragments = [];
let eyeExploding = false;

let isPaused = false;

function generador(cantidad, valorInicial, incremento) {
    let arreglo = [];
    for (let i = 0; i < cantidad; i++) {
        arreglo.push(valorInicial + (i * incremento));
    }
    return arreglo;
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    let world = worlds.find(w => w.id === currentWorld.id);
    let difficultySetting = difficulties.find(d => d.difficulty === difficulty);
    if (difficultySetting) {
        let params = difficultySetting.params.find(p => p.worldId === world.id);
        if (params) {
            enemySpawnRates = params.difficultProperties[0];
            enemySpeeds = params.difficultProperties[1];
            spaceshipSpeeds = params.difficultProperties[2];

            spaceship.speed = spaceshipSpeeds[0];
            enemySpeed = enemySpeeds[0];
            enemySpawnInterval = enemySpawnRates[0];
        }
    }
}

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
            shootSound.volume = 0.3;
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

function draw() {
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, currentWorld.colorStart);
    gradient.addColorStop(1, currentWorld.colorEnd);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

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
    drawGiantEye();
    updateGiantEyeFragments();
    drawEnemyBullets();
    drawSpecialWeapon();
    updateObstacles();
    drawExplosions();
    drawScorePopups();

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
                if (enemy.blackhole) {
                    const cx = enemy.x + enemy.width / 2;
                    const cy = enemy.y + enemy.height / 2;
                    const dist = Math.hypot(bullet.x - cx, bullet.y - cy);
                    if (dist < enemy.width * 0.25) {
                        enemy.hits--;
                        bullet.damage--;
                        if (enemy.hits <= 0) {
                            enemy.finalHit = true;
                            enemy.finalHitEffectTimer = 30;
                        }
                        if (bullet.damage <= 0) {
                            spaceship.bullets.splice(bulletIndex, 1);
                        }
                    } else {
                        enemyBullets.push({
                            x: bullet.x,
                            y: bullet.y,
                            width: bullet.width,
                            height: bullet.height,
                            color: bullet.color,
                            vx: -bullet.vx,
                            vy: -bullet.vy
                        });
                        spaceship.bullets.splice(bulletIndex, 1);
                    }
                } else {
                    while (bullet.damage > 0 && enemy.hits > 0) {
                        enemy.hits--;
                        bullet.damage--;
                        enemy.hitEffectTimer = enemy.hitEffectDuration;
                        if (enemy.hits === 0) {
                            enemy.finalHit = true;
                            enemy.finalHitEffectTimer = 30;
                            enemy.impactSize = bullet.impactSize;
                            const points = enemyTypes.find(type => type.id === enemy.id).hits;
                            score += points;
                            updateScoreUI();
                            createScorePopup(enemy.x, enemy.y, `+${points}`);
                            enemiesDestroyed++;
                            enemyExplodeSound.currentTime = 0;
                            enemyExplodeSound.volume = 0.060;
                            enemyExplodeSound.play();
                        } else {
                            enemyImpactSound.currentTime = 0;
                            enemyImpactSound.volume = 1;
                            enemyImpactSound.play();
                        }
                    }
                    if (bullet.damage <= 0) {
                        spaceship.bullets.splice(bulletIndex, 1);
                    }
                }
            }
        });

        if (giantEye && giantEye.state !== 'dying') {
            if (bullet.x < giantEye.x + giantEye.width &&
                bullet.x + bullet.width > giantEye.x &&
                bullet.y < giantEye.y + giantEye.height &&
                bullet.y + bullet.height > giantEye.y) {
                const centerX = giantEye.x + giantEye.width / 2;
                const centerY = giantEye.y + giantEye.height / 2;
                const dist = Math.hypot(bullet.x - centerX, bullet.y - centerY);
                if (dist <= giantEye.width * 0.2) {
                    giantEye.health -= giantEye.damagePerHit;
                    giantEye.hitsSinceIrritate++;
                    giantEye.hitsSinceClose++;
                    giantEye.state = 'active';

                    if (giantEye.hitsSinceIrritate >= giantEye.irritateAfter) {
                        giantEyeShoot();
                        giantEye.hitsSinceIrritate = 0;
                    }
                    if (giantEye.hitsSinceClose >= giantEye.closeAfterHits) {
                        giantEye.blinkDuration = 60;
                        giantEye.blinkTimer = giantEye.blinkDuration;
                        giantEye.hitsSinceClose = 0;
                    } else {
                        giantEye.blinkDuration = 15;
                        giantEye.blinkTimer = giantEye.blinkDuration;
                    }

                    if (giantEye.health <= 0) {
                        giantEye.state = 'dying';
                        createGiantEyeFragments();
                        gamePaused = true;
                        eyeExploding = true;
                    }

                    bullet.damage--;
                }
                if (bullet.damage <= 0) {
                    spaceship.bullets.splice(bulletIndex, 1);
                }
            }
        }
    });
}

function drawEnemyBullets() {
    enemyBullets.forEach((bullet) => {
        context.save();
        context.fillStyle = bullet.color;
        if (bullet.glow) {
            context.shadowColor = bullet.color;
            context.shadowBlur = 15;
        }
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        context.restore();
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

function createEnemyFromType(type) {
    const size = 20 + Math.random() * 30;
    return {
        id: type.id,
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
        arms: type.arms,
        shootInterval: type.shootInterval,
        blackhole: type.blackhole || false,
        blinkInterval: type.blinkInterval || 0,
        blinkCounter: 0,
        visible: true,
    };
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if (enemy.shrink) {
            enemy.width *= 0.97;
            enemy.height *= 0.97;
            enemy.y += enemy.fallSpeed || 1;
            enemy.x += enemy.fallSide || 0;
            enemy.rotation = (enemy.rotation || 0) + (enemy.rotationSpeedFall || 0.05);
            context.save();
            context.translate(enemy.x, enemy.y);
            context.rotate(enemy.rotation);
            context.globalAlpha = Math.max(0, 1 - enemy.shrinkStep);
            context.fillStyle = enemy.color;
            context.shadowColor = 'rgba(255, 255, 255, 1)';
            context.shadowBlur = Math.min(40, enemy.shrinkStep * 80);
            context.beginPath();
            context.arc(0, 0, Math.max(0, enemy.width / 2), 0, Math.PI * 2);
            context.fill();
            context.restore();
            enemy.shrinkStep += 0.05;
            if (enemy.shrinkStep >= 1 || enemy.y - enemy.height > canvas.height) {
                enemies.splice(index, 1);
            }
        } else if (enemy.finalHit) {
            context.save();
            context.shadowColor = enemy.color;
            context.shadowBlur = 40;
            context.globalAlpha = 1;
            enemy.width *= enemy.impactSize;
            enemy.height *= enemy.impactSize;
            if (enemy.blinkInterval) {
                enemy.blinkCounter++;
                if (enemy.blinkCounter >= enemy.blinkInterval) {
                    enemy.blinkCounter = 0;
                    enemy.visible = !enemy.visible;
                }
            }
            if (enemy.visible) {
                enemy.draw(enemy);
            }
            context.restore();
            enemy.finalHitEffectTimer -= 20;
            if (enemy.finalHitEffectTimer <= 0) {
                enemy.shrink = true;
                enemy.fallSpeed = 1 + Math.random();
                enemy.fallSide = (Math.random() - 0.5) * 0.5;
                enemy.rotationSpeedFall = 0.05 + Math.random() * 0.05;
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
            }
        }
    });
}

function createSpecialWeaponFromType(type) {
    return {
        id: type.id,
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: 30,
        height: 30,
        speed: 2,
        color: type.colorBullet,
        damage: type.enemyDamage,
        icon: type.icon,
        name: type.name,
        rotation: 0,
        rotationSpeed: 0.05,
        originalSize: 28,
        animationType: 'breathing' // 'breathing' o 'rotation'
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
    if (isGameOver || gamePaused || !isGameRunning) return;

    if (bossFight) return;

    if (Math.random() < enemySpawnInterval / 100) {
        const enemyIndex = (level - 1) % currentWorld.enemies.length;
        const enemyId = currentWorld.enemies[enemyIndex];
        const enemyType = enemyTypes.find(type => type.id === enemyId);
        if (enemyType) {
            enemies.push(createEnemyFromType(enemyType));
        }
    }

    if (!specialStar && (Date.now() - lastSpecialStarSpawnTime) > specialStarInterval) {
        createSpecialStar();
        lastSpecialStarSpawnTime = Date.now();
    }

    if (!specialWeapon && (Date.now() - lastSpecialWeaponSpawnTime) > specialWeaponInterval) {
        const weaponIndex = (level - 1) % currentWorld.weapons.length;
        const weaponId = currentWorld.weapons[weaponIndex];
        const weaponType = specialWeapons.find(weapon => weapon.id === weaponId);
        if (weaponType && !capturedSpecialWeapons.has(weaponType.name)) {
            specialWeapon = createSpecialWeaponFromType(weaponType);
            if (specialWeapon) {
                lastSpecialWeaponSpawnTime = Date.now();
            }
        }
    }

    if (!specialHeart && (Date.now() - lastSpecialHeartSpawnTime) > specialHeartInterval) {
        createSpecialHeart();
        lastSpecialHeartSpawnTime = Date.now();
    }
}

function updateObstacles() {
    generateObstacles();
    drawEnemies();
    drawSpecialStar();
    drawSpecialHeart();
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
    drawEnemyShape(enemy, 6);
}

function drawRotatingEnemy(enemy) {
    drawRotatingShape(enemy, drawRotatingEnemyShape);
}

function drawCometEnemyShape(enemy) {
    drawEnemyShape(enemy, 16);
}

function drawCometEnemy(enemy) {
    drawRotatingShape(enemy, drawCometEnemyShape);
}

function drawOctopusEnemy(enemy) {
    const arms = enemy.arms || 4;
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    context.fillStyle = 'purple';
    context.beginPath();
    context.arc(0, 0, enemy.width / 3, 0, Math.PI * 2);
    context.fill();
    for (let i = 0; i < arms; i++) {
        const angle = (performance.now() / 500) + (i / arms) * Math.PI * 2;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(Math.cos(angle) * enemy.width / 2, Math.sin(angle) * enemy.height / 2);
        context.strokeStyle = 'purple';
        context.stroke();

        if (!enemy.lastShotTime) enemy.lastShotTime = Date.now();
        if (Date.now() - enemy.lastShotTime > (enemy.shootInterval || 2000)) {
            enemy.lastShotTime = Date.now();
            enemyBullets.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                width: 6,
                height: 6,
                color: '#ff66ff',
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                glow: true
            });
            enemyShootSound.currentTime = 0;
            enemyShootSound.play();
        }
    }
    context.restore();
}

function drawBlackHoleEnemy(enemy) {
    context.save();
    context.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    const grd = context.createRadialGradient(0, 0, enemy.width * 0.2, 0, 0, enemy.width / 2);
    grd.addColorStop(0, 'black');
    grd.addColorStop(1, 'gray');
    context.fillStyle = grd;
    context.beginPath();
    context.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
}

function drawPhantomEnemy(enemy) {
    if (!enemy.visible) return;
    context.save();
    context.fillStyle = 'cyan';
    context.beginPath();
    context.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
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
        shrink: false,
        icon: showStarIcon ? null : '☢️'
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
        context.shadowColor = specialStar.colors[specialStar.colorIndex];
        context.shadowBlur = 20;
        if (specialStar.icon) {
            context.font = `${specialStar.radius * 2}px Arial`;
            context.fillStyle = specialStar.colors[specialStar.colorIndex];
            context.fillText(specialStar.icon, specialStar.x, specialStar.y + specialStar.radius);
        } else {
            context.fillStyle = specialStar.colors[specialStar.colorIndex];
            context.beginPath();
            for (let i = 0; i < 5; i++) {
                context.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * specialStar.radius + specialStar.x,
                    -Math.sin((18 + i * 72) / 180 * Math.PI) * specialStar.radius + specialStar.y);
                context.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (specialStar.radius / 2) + specialStar.x,
                    -Math.sin((54 + i * 72) / 180 * Math.PI) * (specialStar.radius / 2) + specialStar.y);
            }
            context.closePath();
            context.fill();
        }
        context.restore();
        specialStar.x -= specialStar.speed;
        if (specialStar.x + specialStar.radius < 0) {
            specialStar = null;
        }
    }
}

function createSpecialHeart() {
    specialHeart = {
        x: canvas.width,
        y: Math.random() * canvas.height,
        radius: 10,
        speed: 2,
        color: 'red',
        icon: '❤️'
    };
}

function drawSpecialHeart() {
    if (specialHeart) {
        context.save();
        context.shadowColor = specialHeart.color;
        context.shadowBlur = 20;
        context.font = `${specialHeart.radius * 2}px Arial`;
        context.fillStyle = specialHeart.color;
        context.fillText(specialHeart.icon, specialHeart.x, specialHeart.y + specialHeart.radius);
        context.restore();
        specialHeart.x -= specialHeart.speed;
        if (specialHeart.x + specialHeart.radius < 0) {
            specialHeart = null;
        }
    }
}

function createExplosion(x, y, size, color) {
    explosions.push({ x, y, size, color, life: 10 });
}

function createGiantEyeFragments() {
    giantEyeFragments = [];
    const pieces = 8;
    const cx = giantEye.x + giantEye.width / 2;
    const cy = giantEye.y + giantEye.height / 2;
    for (let i = 0; i < pieces; i++) {
        const angle = (i / pieces) * Math.PI * 2;
        giantEyeFragments.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            size: 10,
            life: 60
        });
    }
}

function updateGiantEyeFragments() {
    giantEyeFragments.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
        if (p.life <= 0) {
            giantEyeFragments.splice(idx, 1);
        }
    });
}

function createScorePopup(x, y, text) {
    scorePopups.push({ x, y, text, alpha: 1 });
}

function drawScorePopups() {
    scorePopups.forEach((popup, index) => {
        context.save();
        context.fillStyle = 'yellow';
        context.font = '18px Arial';
        context.globalAlpha = popup.alpha;
        context.fillText(popup.text, popup.x, popup.y);
        context.restore();
        popup.y -= 0.5;
        popup.alpha -= 0.02;
        if (popup.alpha <= 0) {
            scorePopups.splice(index, 1);
        }
    });
}

function spawnGiantEye() {
    const type = bigEnemies[0];
    showWorldTransition('Alerta - Ojo Gigante');
    giantEye = {
        x: canvas.width + 100,
        y: canvas.height / 2 - 60,
        width: 120,
        height: 120,
        speed: 1,
        health: type.hitsToExplode[currentDifficulty],
        maxHealth: type.hitsToExplode[currentDifficulty],
        hitsSinceIrritate: 0,
        hitsSinceClose: 0,
        irritateAfter: type.irritateAfter[currentDifficulty],
        bulletAngles: type.bulletAngles[currentDifficulty],
        damagePerHit: type.damagePerHit[currentDifficulty],
        closeAfterHits: type.closeAfterHits[currentDifficulty],
        state: 'entering',
        shrinkStep: 0,
        blinkTimer: 0,
        blinkDuration: 0
    };
    bossFight = true;
    enemies = [];
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic.src = giantEyeMusic;
    backgroundMusic.play();
}

function updateGiantEye() {
    if (!giantEye) return;

    if (giantEye.state === 'entering') {
        giantEye.x -= giantEye.speed;
        if (giantEye.x <= canvas.width - giantEye.width - 40) {
            giantEye.state = 'active';
        }
    } else if (giantEye.state === 'active') {
        const centerY = giantEye.y + giantEye.height / 2;
        giantEye.y += (spaceship.y - centerY) * 0.02;
        if (giantEye.blinkTimer > 0) {
            giantEye.blinkTimer--;
        }
    } else if (giantEye.state === 'dying') {
        giantEye.width *= 0.97;
        giantEye.height *= 0.97;
        giantEye.y += 1;
        giantEye.shrinkStep += 0.05;
        if (giantEyeFragments.length === 0 && giantEye.shrinkStep > 0.1) {
            createGiantEyeFragments();
        }
        updateGiantEyeFragments();
        if (giantEye.shrinkStep >= 1) {
            score += bigEnemies[0].score;
            updateScoreUI();
            createScorePopup(spaceship.x, spaceship.y, `+${bigEnemies[0].score}`);
            enemiesDestroyed++;

            giantEye = null;
            bossFight = false;
            giantEyeDefeated = true;
            eyeExploding = false;

            const idx = worlds.findIndex(w => w.id === currentWorld.id);
            if (idx + 1 < worlds.length) {
                const nextWorld = worlds[idx + 1];
                showWorldTransition(`${nextWorld.name} - ${nextWorld.id}`, `Enemigos destruidos: ${enemiesDestroyed}`);
                enemiesDestroyed = 0;
                currentWorld = nextWorld;
                level = 1;
            }

            gamePaused = false;
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.src = currentWorld.music;
            backgroundMusic.play();
            updateHeaderUI();
        }
    }
}

function drawGiantEye() {
    if (!giantEye) return;
    context.save();
    const centerX = giantEye.x + giantEye.width / 2;
    const centerY = giantEye.y + giantEye.height / 2;
    context.translate(centerX, centerY);
    context.globalAlpha = 1 - giantEye.shrinkStep;
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(0, 0, giantEye.width / 2, 0, Math.PI * 2);
    context.fill();
  
    const irritation = giantEye.hitsSinceIrritate / giantEye.irritateAfter;
    context.strokeStyle = `rgba(255,0,0,${irritation})`;
    for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.moveTo(0, 0);
        const angle = Math.random() * Math.PI * 2;
        context.lineTo(Math.cos(angle) * giantEye.width / 2, Math.sin(angle) * giantEye.height / 2);
        context.stroke();
    }

    const blinkProgress = giantEye.blinkTimer > 0 ? 1 - Math.abs((giantEye.blinkTimer / giantEye.blinkDuration) * 2 - 1) : 0;
    const irisScale = 1 - blinkProgress;
    const offsetX = (spaceship.x - centerX) * 0.05;
    const offsetY = (spaceship.y - centerY) * 0.05;

    const irisColor = irritation > 0.5 ? 'red' : '#3b2210';
    const pupilColor = irritation > 0.5 ? 'white' : 'black';

    context.save();
    context.scale(1, irisScale);
    context.fillStyle = irisColor;
    context.beginPath();
    context.arc(offsetX, offsetY, giantEye.width * 0.35, 0, Math.PI * 2);
    context.fill();
    context.restore();

    context.save();
    context.scale(1, 1 - blinkProgress);
    context.fillStyle = pupilColor;

    context.beginPath();
    context.arc(offsetX, offsetY, giantEye.width * 0.2, 0, Math.PI * 2);
    context.fill();
    context.restore();

    const barWidth = giantEye.width;
    const healthRatio = giantEye.health / giantEye.maxHealth;
    context.fillStyle = 'red';
    context.fillRect(-barWidth / 2, giantEye.height / 2 + 10, barWidth, 5);
    context.fillStyle = 'green';
    context.fillRect(-barWidth / 2, giantEye.height / 2 + 10, barWidth * healthRatio, 5);
    context.restore();
}

function giantEyeShoot() {
    if (!giantEye) return;
    const bullets = giantEye.bulletAngles;

    const cx = giantEye.x + giantEye.width / 2;
    const cy = giantEye.y + giantEye.height / 2;
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < bullets; i++) {
        const angle = offset + (i / bullets) * Math.PI * 2;
        enemyBullets.push({
            x: cx,
            y: cy,
            width: 5,
            height: 5,
            color: 'red',
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2
        });
    }
}

function drawExplosions() {
    explosions.forEach((explosion, index) => {
        context.save();
        context.fillStyle = explosion.color;
        context.shadowColor = explosion.color;
        context.shadowBlur = 15;
        context.globalAlpha = 0.6;
        context.beginPath();
        context.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        context.fill();
        context.restore();

        explosion.life -= 1;
        if (explosion.life <= 0) {
            explosions.splice(index, 1);
        }
    });
}

function checkCollisions() {
    if (gamePaused) return;

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
            createExplosion((enemy.x + spaceship.x) / 2, (enemy.y + spaceship.y) / 2, 20, 'red');
            isGameOver = true;
            stopGame();
        }
    });

    enemyBullets.forEach((bullet, index) => {
        if (collisionBox.x < bullet.x + bullet.width &&
            collisionBox.x + collisionBox.width > bullet.x &&
            collisionBox.y < bullet.y + bullet.height &&
            collisionBox.y + collisionBox.height > bullet.y) {
            createExplosion((bullet.x + spaceship.x) / 2, (bullet.y + spaceship.y) / 2, 20, 'orange');
            isGameOver = true;
            stopGame();
        }
    });

    if (giantEye && giantEye.state !== 'dying') {
        if (collisionBox.x < giantEye.x + giantEye.width &&
            collisionBox.x + collisionBox.width > giantEye.x &&
            collisionBox.y < giantEye.y + giantEye.height &&
            collisionBox.y + collisionBox.height > giantEye.y) {
            createExplosion((giantEye.x + spaceship.x) / 2, (giantEye.y + spaceship.y) / 2, 20, 'red');
            isGameOver = true;
            stopGame();
        }
    }

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
        newBulletSound.volume = 0.5;
        newBulletSound.play();

        spaceship.currentWeapon = specialWeapons.find(weapon => weapon.name === specialWeapon.name);
        capturedSpecialWeapons.add(specialWeapon.name);
        specialWeapon = null;
    }

    if (specialHeart &&
        collisionBox.x < specialHeart.x + specialHeart.radius &&
        collisionBox.x + collisionBox.width > specialHeart.x &&
        collisionBox.y < specialHeart.y + specialHeart.radius &&
        collisionBox.y + collisionBox.height > specialHeart.y) {

        lifeSound.currentTime = 0;
        lifeSound.volume = 0.5;
        lifeSound.play();

        lives += 1;
        updateLivesUI();
        specialHeart = null;
    }

    if (isGameOver && !gameOverHandled) {
        handleGameOver();
    }
}

function updateLevel() {
    const currentWorldIndex = worlds.findIndex(world => world.id === currentWorld.id);
    const levelsPerWorld = currentWorld.enemies.length;

    let previousWorldEnemies = 0;
    for (let i = 0; i < currentWorldIndex; i++) {
        previousWorldEnemies += enemiesToAdvance[currentDifficulty] * worlds[i].enemies.length;
    }

    let newLevel = Math.floor((enemiesDestroyed - previousWorldEnemies) / enemiesToAdvance[currentDifficulty]) + 1;

    if (!giantEyeDefeated && currentWorld.id === bigEnemies[0].spawnAfterWorld && newLevel > levelsPerWorld) {
        newLevel = levelsPerWorld;

        if (!bossFight) {
            spawnGiantEye();
        }
    }

    if (newLevel > levelsPerWorld) {
        if (currentWorldIndex + 1 < worlds.length) {
            const nextWorld = worlds[currentWorldIndex + 1];
            showWorldTransition(`${nextWorld.name} - ${nextWorld.id}`, `Enemigos destruidos: ${enemiesDestroyed}`);
            enemiesDestroyed = 0;
            currentWorld = nextWorld;
            newLevel = 1;

            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.src = currentWorld.music;
            backgroundMusic.play();

            newLevelSound.currentTime = 0;
            newLevelSound.play();
        } else {
            showCongratulationsScreen();
            return;
        }
    }

    level = newLevel;
    const enemyIndex = (level - 1) % currentWorld.enemies.length;
    enemySpawnInterval = enemySpawnRates[enemyIndex];
    enemySpeed = enemySpeeds[enemyIndex];
    spaceship.speed = spaceshipSpeeds[enemyIndex];

    updateHeaderUI();
}

function update() {
    if (isGameRunning) {
        if (!isGameOver && !isPaused && !gamePaused && !isGameWon) {
            updateSpaceship();
            updateBullets();
            updateEnemyBullets();
            updateGiantEye();
            generateObstacles();
            checkCollisions();
            updateLevel();
        }
        if (gamePaused && eyeExploding && giantEye) {
            updateGiantEye();
            if (Math.random() < 0.3) {
                flashTime = 3;
            }
        }
        draw();

        if (isGameRunning) {
            animationFrameId = requestAnimationFrame(update);
        }
    }
}

function updateScoreUI() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function updateHeaderUI() {
    const header = document.getElementById('header');
    header.innerText = `${currentWorld.name} - Level ${level}`;
}

function updateLivesUI() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += '❤️';
    }
}

function incrementLives() {
    lives += 1;
    updateLivesUI();
}

function showLifeLostDialog() {
    const lifeLostDialog = document.getElementById('life-lost-dialog');
    const lifeLostMessage = document.getElementById('life-lost-message');
    lifeLostMessage.innerHTML = `🚀 x ${lives} ❤️`;
    lifeLostDialog.classList.remove('hidden');

    setTimeout(() => {
        lifeLostDialog.classList.add('hidden');
        resetPlayerPosition();
        isGameOver = false;
        gameOverPlayed = false;
        gameOverHandled = false;
        gamePaused = false;
        isGameRunning = true;
        
        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }
        
        update();
    }, 3000);
}


function handleGameOver() {
    gameOverHandled = true;

    if (!gameOverPlayed) {
        gameOverSound.currentTime = 0;
        gameOverSound.play();
        gameOverPlayed = true;
    }

    lives--;
    updateLivesUI();
    gamePaused = true;

    enemies = [];
    enemyBullets = [];

    if (lives > 0) {
        setTimeout(() => {
            showLifeLostDialog();
        }, 0);
    } else {
        backgroundMusic.pause();
        setTimeout(() => {
            const gameOverDialog = document.getElementById('game-over');
            gameOverDialog.classList.remove('hidden');
            document.getElementById('pause-button').classList.add('hidden');
            document.getElementById('restart-button').removeEventListener('click', handleRestartClick);
            document.getElementById('restart-button').addEventListener('click', handleRestartClick);
        }, 0);
    }
}

function handleRestartClick() {
    const gameOverDialog = document.getElementById('game-over');
    document.getElementById('congratulations').classList.add('hidden');
    document.getElementById('info-container').classList.remove('hidden');
    document.getElementById('game').classList.remove('hidden');
    gameOverDialog.classList.add('hidden');
    document.getElementById('pause-button').classList.remove('hidden');
    resetGame();
}

function showCongratulationsScreen() {
    isGameWon = true;
    stopGame();

    winSound.currentTime = 0;
    winSound.play();

    document.getElementById('info-container').classList.add('hidden');
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');

    document.getElementById('congratulations').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');

    document.getElementById('restart-game').removeEventListener('click', handleRestartClick); 
    document.getElementById('restart-game').addEventListener('click', handleRestartClick);

    animateStartScreen();
}

function showWorldTransition(text, extra = '') {
    const overlay = document.getElementById('world-transition');
    const txt = document.getElementById('world-transition-text');
    const extraTxt = document.getElementById('world-transition-extra');
    txt.innerText = text;
    extraTxt.innerText = extra;
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, worldTransitionDuration);
}

function stopGame() {
    isGameRunning = false;
    cancelAnimationFrame(animationFrameId);
    backgroundMusic.pause();
    clearAllIntervals();
}

function initializeEventListeners() {
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

    document.getElementById('restart-button').addEventListener('click', handleRestartClick);
    document.getElementById('restart-button').addEventListener('touchstart', handleRestartClick);

    document.getElementById('start-button').addEventListener('click', () => startGame(false));
    document.getElementById('start-button').addEventListener('touchstart', () => startGame(true));

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
            intervals.push(shootingInterval);
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
                intervals.push(shootingInterval);
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
}

function startGame(clickType) {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    setDifficulty(selectedDifficulty);

    backgroundMusic.src = currentWorld.music;

    setTimeout(() => {
        const promise = backgroundMusic.play();
        if (promise !== undefined) {
            promise.then(_ => {
            }).catch(error => {
                console.log('Autoplay was prevented.');
            });
        }
    }, 4000);

    updateHeaderUI();
    updateScoreUI();

    startStatusButtons(clickType);

    giantEye = null;
    bossFight = false;
    giantEyeDefeated = false;
    eyeExploding = false;

    intervals.push(setInterval(incrementLives, lifeInterval));

    isGameRunning = true;
    animationFrameId = requestAnimationFrame(update);
}

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

function resetPlayerPosition() {
    spaceship.x = 50;
    spaceship.y = canvas.height / 2;
    enemies = [];
    enemyBullets = [];
}

function resetGame() {
    stopGame();

    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    setDifficulty(selectedDifficulty);

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
    gameOverPlayed = false;
    gameOverHandled = false;
    gamePaused = false;
    isGameWon = false;
    score = 0;
    level = 1;
    currentWorld = worlds[0];

    giantEye = null;
    bossFight = false;
    giantEyeDefeated = false;
    eyeExploding = false;

    spaceship.x = 50;
    spaceship.y = canvas.height / 2;
    spaceship.bullets = [];
    enemies = [];
    enemyBullets = [];
    lives = 3;

    enemySpeed = enemySpeeds[0];
    enemySpawnInterval = enemySpawnRates[0];
    spaceship.speed = spaceshipSpeeds[0];
    spaceship.currentWeapon = specialWeapons.find(weapon => weapon.isDefault);

    updateScoreUI();
    updateHeaderUI();
    updateLivesUI();

    backgroundMusic.currentTime = 0;
    backgroundMusic.src = currentWorld.music;
    backgroundMusic.play();

    intervals.push(setInterval(incrementLives, lifeInterval));

    isGameRunning = true;
    update();
}

function nextWorld() {
    const currentWorldIndex = worlds.findIndex(world => world.id === currentWorld.id);
    if (currentWorldIndex + 1 < worlds.length) {
        currentWorld = worlds[currentWorldIndex + 1];
        level = 1;
        
        const newLevelSound = new Audio('assets/sounds/newLevel.mp3');
        newLevelSound.currentTime = 0;
        newLevelSound.play();
    } else {
        showCongratulationsScreen();
        return;
    }
    updateHeaderUI();

    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic.src = currentWorld.music;
    backgroundMusic.play();

    resetGame();
    update();
}

function clearAllIntervals() {
    for (const interval of intervals) {
        clearInterval(interval);
    }
    intervals = [];
}

initializeEventListeners();

createStars(100);
createPlanets(5);
animateStartScreen();
