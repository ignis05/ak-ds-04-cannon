class Ball {
    constructor() {
        var geometry = new THREE.SphereGeometry(22, 8, 8);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var materialWireframe = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, material)

        this.mesh.add(new THREE.Mesh(geometry, materialWireframe))

        this.flying = false
    }
    addTo(parent) {
        parent.add(this.mesh)
    }
    get position() {
        return this.mesh.position
    }
    fly(angle, gravity, velocity) {
        return new Promise(res => {

            console.log('starting flight');
            /* - angle - kąt nachylenia lufy w stosunku do podłoża
            - t - zmienna określająca upływ czasu
            - v - prędkość początkowa
            */
            this.gravity = gravity ? gravity : 9.81
            this.velocity = velocity ? velocity : 100
            this.angle = angle
            this.flying = 1
            console.log(this);

            this.startPos = this.position.clone()

            var keepFlying = () => {
                if (this.flying !== false) {
                    this.position.x = this.startPos.x
                    this.position.y = this.startPos.y + this.velocity * this.flying * Math.sin(this.angle) - ((this.gravity * this.flying * this.flying) / 2)
                    this.position.z = this.startPos.z + this.velocity * this.flying * Math.cos(this.angle)
                    this.flying += 0.1
                    if (this.position.y <= 22) {
                        this.flying = false
                    }
                    requestAnimationFrame(keepFlying)
                }
                else {
                    res(this.position)
                    setTimeout(() => {
                        this.mesh.parent.remove(this.mesh)
                    }, 3000)
                }
            }
            keepFlying()
        })
    }

}