// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 590,
    backgroundColor: '#87CEEB', // Black background for space effect
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

let stars = []; // Array to store star data
let graphics; // Graphics object for drawing

function preload() {
    // Load player sprite
    this.load.image('player', 'assets/player.png');
}

function create() {
    // Add the player sprite
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setScale(0.8);

    // Create a graphics object
    graphics = this.add.graphics();

    // Generate stars
    for (let i = 0; i < 200; i++) {
        let x = Phaser.Math.Between(0, 800); // Random x position
        let y = Phaser.Math.Between(0, 600); // Random y position
        let size = Phaser.Math.Between(1, 3); // Random star size
        stars.push({ x, y, size }); // Store star data in the array
    }
    // Prevent the player from moving out of the screen
    this.player.setCollideWorldBounds(true);

    // Create cursors for movement
    cursors = this.input.keyboard.createCursorKeys();



}

function update() {
    // Clear the previous frame's stars
    graphics.clear();

    // Set the color for the stars
    graphics.fillStyle(0xffffff, 1); // Purple color

    // Move and redraw stars
    for (let star of stars) {
        star.y += 2; // Move star downward

        // Reset position to top if it moves off the bottom
        if (star.y > 600) {
            star.y = 0;
            star.x = Phaser.Math.Between(0, 800);
        }

        // Draw the star
        graphics.fillCircle(star.x, star.y, star.size);
    }

    // Reset velocity (stop movement when no key is pressed)
    this.player.setVelocity(0);
    // Move based on arrow keys
    if (cursors.left.isDown) {
        this.player.setVelocityX(-200); // Move left
    } else if (cursors.right.isDown) {
        this.player.setVelocityX(200); // Move right
    }
    if (cursors.up.isDown) {
        this.player.setVelocityY(-200); // Move up
    } else if (cursors.down.isDown) {
        this.player.setVelocityY(200); // Move down
    }

}
