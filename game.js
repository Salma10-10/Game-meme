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
let shootSound; // Variable for the shooting sound
let enemies;

function preload() {
    // Load assets
    this.load.image('player', 'assets/player.png'); // Load player sprite
    this.load.image('munition', 'assets/munition.png'); // Load munition sprite
    this.load.audio('shoot', 'assets/sounds/shoot.mp3'); // Load shooting sound
    this.load.image('enemy', 'assets/enemy.png'); // Load enemy sprite
}

function create() {
    // Add player sprite
    player = this.physics.add.sprite(400, 500, 'player');
    player.setScale(0.8);
    player.setCollideWorldBounds(true); // Prevent player from leaving screen
    enemies = this.physics.add.group(); // Add enemies group

    // Create a group for munitions
    munitions = this.physics.add.group();

    // Add input keys for movement
    cursors = this.input.keyboard.createCursorKeys();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Create a graphics object for stars
    graphics = this.add.graphics();

    // Generate stars
    for (let i = 0; i < 200; i++) {
        const x = Phaser.Math.Between(0, 800); // Random x position
        const y = Phaser.Math.Between(0, 600); // Random y position
        const size = Phaser.Math.Between(1, 3); // Random star size
        stars.push({ x, y, size }); // Store star data
    }

    // Preload shooting sound
    shootSound = this.sound.add('shoot'); // Load the sound into the game

    // Spawn enemies periodically
    this.time.addEvent({
        delay: 1000, // Spawn every 1 second
        callback: spawnEnemy,
        callbackScope: this,
        loop: true,
    });

    // Handle collisions between munition and enemies
    this.physics.add.collider(munitions, enemies, destroyEnemy, null, this);
}

function update() {
    // Clear the previous frame's stars
    graphics.clear();

    // Set the color for the stars
    graphics.fillStyle(0xffffff, 1);

    // Move and redraw stars
    for (let star of stars) {
        star.y += 2; // Move stars downward

        // Reset position if stars move off the screen
        if (star.y > 600) {
            star.y = 0;
            star.x = Phaser.Math.Between(0, 800);
        }

        // Draw the star
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

    // Make enemies move toward the player
    enemies.children.iterate(function (enemy) {
        moveEnemyTowardsPlayer(enemy);
    });
}

function shootMunition() {
    // Play the shooting sound
    shootSound.play(); // Play the sound

    // Create a munition just above the player
    const munition = munitions.create(player.x, player.y - 20, 'munition');
    munition.setScale(0.3); // Scale down the munition
    munition.setVelocityY(-400); // Move upward
    munition.body.allowGravity = false; // Prevent gravity effects
    munition.setCollideWorldBounds(true); // Enable world bounds collision
    munition.body.onWorldBounds = true; // Enable event for world bounds

    // Destroy the munition when it goes off-screen
    munition.on('worldbounds', () => munition.destroy());
}

// Function to spawn enemies
function spawnEnemy() {
    let x = Phaser.Math.Between(50, 750); // Random X position within screen bounds
    let enemy = enemies.create(x, 0, 'enemy'); // Spawn at the top
    enemy.setScale(0.8);
    enemy.setCollideWorldBounds(true); // Enable world bounds collision
    enemy.body.allowGravity = false; // Prevent gravity effects
}

// Function to make an enemy move toward the player
function moveEnemyTowardsPlayer(enemy) {
    if (!enemy.active) return; // Skip if the enemy is not active
    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y); // Calculate angle
    const speed = 100; // Set speed
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    enemy.setVelocity(velocityX, velocityY); // Set velocity toward the player
}

// Function to destroy an enemy when hit by a munition
function destroyEnemy(munition, enemy) {
    enemy.destroy(); // Remove enemy
    munition.destroy(); // Remove munition
    console.log('Enemy destroyed!');
}
