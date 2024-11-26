// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Light blue background
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Disable debug visuals
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let cursors;
let player;
let munitions;
let stars = [];
let graphics;
let shootSound;
let gameOverSound;
let enemies;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
    this.load.image('player', 'assets/player.png'); // Load player sprite
    this.load.image('munition', 'assets/munition.png'); // Load munition sprite
    this.load.image('enemy', 'assets/enemy.png'); // Load enemy sprite
    this.load.audio('shoot', 'assets/sounds/shoot.mp3'); // Load shooting sound
    this.load.audio('gameOverSound', 'assets/sounds/gameover.mp3'); // Load game over sound
}

function create() {
    // Add player sprite
    player = this.physics.add.sprite(400, 500, 'player');
    player.setScale(0.8);
    player.setCollideWorldBounds(true);

    // Create a group for enemies and munitions
    enemies = this.physics.add.group();
    munitions = this.physics.add.group();

    // Add input keys for movement and shooting
    cursors = this.input.keyboard.createCursorKeys();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Initialize graphics for stars
    graphics = this.add.graphics();

    // Generate stars
    for (let i = 0; i < 200; i++) {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        const size = Phaser.Math.Between(1, 3);
        stars.push({ x, y, size });
    }

    // Load sounds
    shootSound = this.sound.add('shoot');
    gameOverSound = this.sound.add('gameOverSound');

    // Display score
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', color: '#ffffff' });

    // Spawn enemies periodically
    this.time.addEvent({
        delay: 2000, // Spawn every 2 seconds
        callback: spawnEnemies,
        callbackScope: this,
        loop: true
    });

    // Handle collisions
    this.physics.add.collider(munitions, enemies, handleMunitionEnemyCollision, null, this);
    this.physics.add.collider(player, enemies, handlePlayerEnemyCollision, null, this);
}

function update() {
    if (gameOver) return;

    // Clear stars and redraw
    graphics.clear();
    graphics.fillStyle(0xffffff, 1);
    for (let star of stars) {
        star.y += 2;
        if (star.y > 600) {
            star.y = 0;
            star.x = Phaser.Math.Between(0, 800);
        }
        graphics.fillCircle(star.x, star.y, star.size);
    }

    // Reset player velocity
    player.setVelocity(0);

    // Player movement
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        player.setVelocityY(300);
    }

    // Shooting
    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
        shootMunition();
    }
}

function shootMunition() {
    shootSound.play(); // Play shooting sound
    const munition = munitions.create(player.x, player.y - 20, 'munition');
    munition.setScale(0.3);
    munition.setVelocityY(-400);
    munition.body.allowGravity = false;
    munition.setCollideWorldBounds(true);
    munition.body.onWorldBounds = true;
    munition.on('worldbounds', () => munition.destroy());
}

function spawnEnemies() {
    const enemyCount = score < 200
        ? Math.min(3 + Math.floor(score / 150), 5) // Slow scaling below 200
        : Math.min(5 + Math.floor((score - 200) / 200), 7); // Slow scaling above 200

    for (let i = 0; i < enemyCount; i++) {
        const x = Phaser.Math.Between(50, 750);
        const enemy = enemies.create(x, Phaser.Math.Between(-50, -300), 'enemy');
        enemy.setScale(0.7);
        enemy.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(30, 100)); // Slow enemies
        enemy.body.setCollideWorldBounds(true);
        enemy.body.onWorldBounds = true;
        enemy.body.bounce.set(1);
    }
}

function handleMunitionEnemyCollision(munition, enemy) {
    munition.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function handlePlayerEnemyCollision(player, enemy) {
    player.destroy();
    gameOverSound.play(); // Play game over sound
    this.add.text(400, 300, 'Game Over\nClick to Restart', { fontSize: '40px', color: '#ff0000', align: 'center' })
        .setOrigin(0.5);

    gameOver = true;

    // Restart on click
    this.input.once('pointerdown', () => {
        this.scene.restart();
        gameOver = false;
        score = 0;
    });
}
