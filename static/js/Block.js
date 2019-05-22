class Block extends THREE.Mesh {
    static TIME = 0.1
    constructor(size, color, col, row) {
        var geometry = new THREE.BoxGeometry(size, size, size);
        var material = new THREE.MeshBasicMaterial({ color: color });
        var _material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });

        super(geometry, material)

        this.geometry = geometry
        this.material = material
        this._material = _material
        this.size = size
        this.color = color
        this.col = col
        this.row = row

        this.add(new THREE.Mesh(this.geometry, this._material))
    }
    setPos(wallPos) {
        this.position.set(wallPos.x + (this.col * this.size), wallPos.y + (this.row * this.size), wallPos.z)
    }
    fly(dir, vel) {
        console.log('flying');
        var startVel = vel != undefined ? vel : 100
        var a = 50
        var startposY = this.position.y
        var startposX = this.position.x
        var startposZ = this.position.z

        let t = 0 //time
        let render = () => {
            if (this.position.y - 25 > 0) {
                this.position.y = startposY - (9.81 * t * t / 2)
            }
            this.position.x = /* startposX + */ (Math.sin(dir) * startVel * t - (a * t * t / 2))
            this.position.z = /* startposZ + */ (Math.cos(dir) * startVel * t - (a * t * t / 2))
            t += Block.TIME
            console.log(this.position);
            requestAnimationFrame(render);
        }
        render()
    }
    fall() {
        var startpos = this.position.y
        this.row = this.row - 1
        let t = 0 //time
        let render = () => {
            if (this.position.y - 25 > this.row * this.size) {
                this.position.y = startpos - (9.81 * t * t / 2)
                t += Block.TIME
                requestAnimationFrame(render);
            }
        }
        render()
    }
}