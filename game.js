// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // Solid background color (sky blue)
    physics: {
        default: 'arcade', // Enable physics
        arcade: {
            debug: true // Optional: shows hitboxes for debugging
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load images into the game
    this.load.image('player', 'assets/player.png'); // Ensure the player image exists and is named correctly
}

function create() {
    // Add the player sprite with physics
    this.player = this.physics.add.sprite(400, 500, 'player'); // Place the player in the middle-bottom of the screen
}

function update() {
    // Update game logic (movement, etc.)
}
