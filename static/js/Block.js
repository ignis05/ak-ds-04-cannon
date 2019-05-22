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
    setPos(wallPos, boolean) {
        if (!boolean) {
            this.position.set(wallPos.x + (this.col * this.size), wallPos.y + (this.row * this.size), wallPos.z)
        }
        else {
            this.position.set(wallPos.z, wallPos.y + (this.row * this.size), wallPos.x + (this.col * this.size))
        }
    }
    fly(dir, vel) {
        var startVel = vel != undefined ? vel : 100
        var a = 10 // braking force
        var startposY = this.position.y
        var startposX = this.position.x
        var startposZ = this.position.z

        var braking = false

        let t = 0.1 //time
        let render = () => {
            if (this.position.y - 25 > 0 && !braking) {
                this.position.y = startposY - (9.81 * t * t / 2)

                // no braking while in air
                this.position.x = Math.sin(dir) * startVel * t + startposX
                this.position.z = Math.cos(dir) * startVel * t + startposZ
            }
            else if (!braking) { // start braking - delayed movement
                startposX = this.position.x
                startposZ = this.position.z
                t = 0.1
                braking = true
            }
            else if (startVel - (a * t) > 0) { // brake
                this.position.x = Math.sin(dir) * (startVel * t - (a * t * t / 2)) + startposX
                this.position.z = Math.cos(dir) * (startVel * t - (a * t * t / 2)) + startposZ
            }
            else { // remove renderer
                return
            }
            t += Block.TIME
            // console.log(this.position);
            requestAnimationFrame(render);
        }
        render()
    }
    fall() {
        var startpos = this.position.y
        this.row = this.row - 1
        let t = 0.1 //time
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