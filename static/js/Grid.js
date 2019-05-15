class Grid {
    constructor(size, color, wireframe) {
        this.color = (color != undefined ? color : 0x000000)
        this.wireframe = (wireframe != undefined ? wireframe : true)
        this.plane = null;
        this.size = size
        this.init()
    }
    init() {
        var floor = new THREE.PlaneGeometry(this.size, this.size, this.size / 100, this.size / 100);
        var materialBlack = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: this.color,
            wireframe: this.wireframe
        })
        this.plane = new THREE.Mesh(floor, materialBlack);
    }
    addTo(scene) {
        scene.add(this.plane);
        this.plane.position.Y = -1
        this.plane.rotation.set(Math.PI / 2, 0, 0)
    }
}