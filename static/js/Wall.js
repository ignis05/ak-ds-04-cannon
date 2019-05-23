class Wall {
    constructor(width, height, blocksize) {
        this.group = new THREE.Group
        // this.group.add(new THREE.AxesHelper(500))
        this.width = width
        this.height = height
        this.blocksize = blocksize
        this.blocks = []
        this.rotated = false
        this.rotation = 0
    }
    makeAmericaGreatAgain() {
        for (let block of this.blocks) {
            this.group.remove(block)
        }
        this.blocks = []

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let block = new Block(this.blocksize, '#ff0000', i, j)
                block.setPos(this.position)
                this.blocks.push(block)
                this.group.parent.add(block)
            }
        }
    }
    moveBlocks() {
        for (let block of this.blocks) {
            block.setPos(this.position, this.rotated)
        }
    }
    rotate() {
        this.rotation -= Math.PI / 2
        this.rotated = !this.rotated
    }
    addTo(parent) {
        parent.add(this.group)
    }
    triggerHit(col, row, dir, power, followCam) {
        console.log(followCam);
        if (dir == undefined) dir = this.rotation
        if (power == undefined) power = 100

        let hit = this.blocks.find(block => block.col == col && block.row == row)
        hit.fly(dir, power, followCam)
        this.blocks.splice(this.blocks.indexOf(hit), 1)

        for (let block of this.blocks) {
            if (block.col == col && block.row > row) {
                block.fall()
            }
        }
    }
    get position() {
        return this.group.position
    }
}