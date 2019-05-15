class Ball {
    constructor() {
        var geometry = new THREE.SphereGeometry(22, 16, 16);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var materialWireframe = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
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
        /* - angle - kąt nachylenia lufy w stosunku do podłoża
        - t - zmienna określająca upływ czasu
        - v - prędkość początkowa
        */
        this.gravity = gravity ? gravity : 9.81
        this.velocity = velocity ? velocity : 9.81
        this.angle = angle
        this.flying = 0

    }
    keepFlying() {
        if (this.flying !== false) {
            this.position.x = 0
            this.position.y = this.velocity * this.flying * Math.sin(this.angle) - ((this.gravity * this.flying * this.flying) / 2)
            this.position.z = this.velocity * this.flying * Math.cos(this.angle)
            this.flying++
            if (this.position.y <= 0) {
                this.flying = false
            }
        }
    }
}