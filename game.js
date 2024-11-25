// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000', // Set your background color or image
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load images into the game
    this.load.image('player', 'assets/player (1).png');
    this.load.image('background', 'assets/backgroun.png');
}

function create() {
    // Add background image
    this.add.image(400, 300, 'background');

    // Add the player sprite
    this.player = this.physics.add.sprite(400, 500, 'player');
}

function update() {
    // Update game logic (movement, etc.)
}
