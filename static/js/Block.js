class Block extends THREE.Mesh {
    static TIME = 1
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

        this.position.set(col * size, row * size, 0)
    }
    fly(direction) {
        console.log('im flying!');
        //placeholder
        this.parent.remove(this)
    }
    fall() {
        console.log('im falling');
        var startpos = this.position.y
        this.row = this.row - 1
        let t = 0 //time
        function render() {
            if (this.position > row * size) {
                this.position.y = startpos - (9.81 * t * t / 2)
                t += Block.TIME
                requestAnimationFrame(render);
            }
        } render()
    }
}