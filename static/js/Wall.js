class Wall {
    constructor(width, height, blocksize) {
        this.group = new THREE.Group
        this.width = width
        this.height = height
        this.blocksize = blocksize
        this.blocks = []

        this.makeAmericaGreatAgain()
    }
    makeAmericaGreatAgain() {
        for (let block of this.blocks) {
            this.group.remove(block)
        }
        this.blocks = []

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let cube = new Block(this.blocksize, '#ff0000', i, j)
                this.blocks.push(cube)
                this.group.add(cube)
            }
        }
    }
    addTo(parent) {
        parent.add(this.group)
    }
    get position() {
        return this.group.position
    }
    get rotation() {
        return this.group.rotation
    }
}