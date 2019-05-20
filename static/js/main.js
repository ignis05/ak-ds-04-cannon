var scene;
var renderer;
var π = Math.PI //xd

$(document).ready(() => {

    // #region initial
    $(window).on("resize", () => {
        camera.aspect = $(window).width() / $(window).height()
        camera.updateProjectionMatrix()
        renderer.setSize($(window).width(), $(window).height())
    })

    scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        45,    // kąt patrzenia kamery (FOV - field of view)
        $(window).width() / $(window).height(),   // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
        0.1,    // minimalna renderowana odległość
        50000    // maxymalna renderowana odległość od kamery 
    );
    camera.position.set(600, 400, 600)
    camera.lookAt(scene.position)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff);
    renderer.setSize($(window).width(), $(window).height());
    //shadows
    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    $("#root").append(renderer.domElement);
    // #endregion initial

    let grid = new Grid(10000)
    grid.addTo(scene)

    var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.addEventListener('change', function () {
        renderer.render(scene, camera)
    });

    var axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);

    var cannon = new Cannon()
    cannon.addTo(scene)
    cannon.rotateBarrel(45)
    cannon.load()





    // #region listeneres
    // rotation
    $('#controls-cannon-rotation').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 360) val = 360
        cannon.rotateCannon(val)
        $('#controls-cannon-rotation-input').val(val)
        cannon.displayAimAssist()
    })
    $('#controls-cannon-rotation-input').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 360) val = 360
        cannon.rotateCannon(90 - val)
        $('#controls-cannon-rotation').val(val)
        cannon.displayAimAssist()
    })

    // angle
    $('#controls-barrel-rotation').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 90) val = 90
        cannon.rotateBarrel(90 - val)
        $('#controls-barrel-rotation-input').val(val)
        cannon.displayAimAssist()
    })
    $('#controls-barrel-rotation-input').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 90) val = 90
        cannon.rotateBarrel(val)
        $('#controls-barrel-rotation').val(val)
        cannon.displayAimAssist()
    })

    // power
    $('#controls-cannon-power').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 1000) val = 1000
        cannon.power = val
        $('#controls-cannon-power-input').val(val)
        cannon.displayAimAssist()
    })
    $('#controls-cannon-power-input').on('input', function () {
        let val = parseInt($(this).val())
        if (val < 0) val = 0
        if (val > 1000) val = 1000
        cannon.power = val
        $('#controls-cannon-power').val(val)
        cannon.displayAimAssist()
    })

    //gravity
    $('#controls-gravity').on('input', function () {
        let val = parseFloat($(this).val())
        if (val < 0) val = 0
        if (val > 100) val = 100
        cannon.cannonball_weight = val
        $('#controls-gravity-input').val(val)
        cannon.displayAimAssist()
    })
    $('#controls-gravity-input').on('input', function () {
        let val = parseFloat($(this).val())
        if (val < 0) val = 0
        if (val > 100) val = 100
        cannon.cannonball_weight = val
        $('#controls-gravity').val(val)
        cannon.displayAimAssist()
    })

    //fire
    $('#controls-fire').click(function () {
        if (cannon.ball) {
            cannon.fire()
            if (!cannon.autoreload) $(this).html('Reload')
        }
        else {
            if (!cannon.autoreload) {
                cannon.load()
                $(this).html('FIRE!')
            }
        }
    })

    //aim
    $('#controls-aim').change(function () {
        let on = $(this).is(':checked')
        cannon.aimAssistEnabled = on
        cannon.displayAimAssist()
    })

    //despawn
    function updateBallDespawnSettings() {
        let on = $('#controls-ball-despawn').is(':checked')
        if (!on) {
            Cannonball.DESPAWNTIME = false
            return
        }
        let time = ~~($('#controls-ball-despawn-time').val()) // '~~' returns 0 if isNaN()
        Cannonball.DESPAWNTIME = time

        console.log(Cannonball.SPAWNED_CANNONBALLS);
        for (let ball of Cannonball.SPAWNED_CANNONBALLS) {
            console.log(ball);
            ball.mesh.parent.remove(ball.mesh)
        }
        Cannonball.SPAWNED_CANNONBALLS = []

    }
    $('#controls-ball-despawn').click(updateBallDespawnSettings)
    $('#controls-ball-despawn-time').on('input', updateBallDespawnSettings)

    $('#controls-cannon-autoreload').change(function () {
        let on = $(this).is(':checked')
        if (on) {
            if (!cannon.ball) {
                $('#controls-fire').html('FIRE!')
                cannon.load() // load if cannon is empty
            }
            cannon.autoreload = true
        }
        else {
            cannon.autoreload = false
        }
    })

    $('#controls-time').on('input', function () {
        let val = parseFloat($(this).val())
        if (val < 0) val = 0
        if (val > 3) val = 3
        Cannonball.TIME = val
        $('#controls-time-input').val(val)
        cannon.displayAimAssist()
    })
    $('#controls-time-input').on('input', function () {
        let val = parseFloat($(this).val())
        if (val < 0) val = 0
        if (val > 3) val = 3
        Cannonball.TIME = val / 2
        $('#controls-time').val(val)
        cannon.displayAimAssist()
    })
    // #endregion listeneres

    // #region keyboard listeners
    $(window).on('keydown', () => {
        // console.log(event.code);
        if (event.code == 'KeyA') {
            let val = parseInt($('#controls-cannon-rotation').val()) + 1
            if (val < 0) val = 0
            if (val > 360) val = 360
            cannon.rotateCannon(val)
            $('#controls-cannon-rotation-input').val(val)
            $('#controls-cannon-rotation').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyD') {
            let val = parseInt($('#controls-cannon-rotation').val()) - 1
            if (val < 0) val = 0
            if (val > 360) val = 360
            cannon.rotateCannon(val)
            $('#controls-cannon-rotation-input').val(val)
            $('#controls-cannon-rotation').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyW') {
            let val = parseInt($(`#controls-barrel-rotation`).val()) + 1
            if (val < 0) val = 0
            if (val > 90) val = 90
            cannon.rotateBarrel(90 - val)
            $('#controls-barrel-rotation-input').val(val)
            $('#controls-barrel-rotation').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyS') {
            let val = parseInt($(`#controls-barrel-rotation`).val()) - 1
            if (val < 0) val = 0
            if (val > 90) val = 90
            cannon.rotateBarrel(90 - val)
            $('#controls-barrel-rotation-input').val(val)
            $('#controls-barrel-rotation').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyQ') {
            let val = parseInt($('#controls-cannon-power').val()) + 1
            if (val < 0) val = 0
            if (val > 1000) val = 1000
            cannon.power = val
            $('#controls-cannon-power-input').val(val)
            $('#controls-cannon-power').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyE') {
            let val = parseInt($('#controls-cannon-power').val()) - 1
            if (val < 0) val = 0
            if (val > 1000) val = 1000
            cannon.power = val
            $('#controls-cannon-power-input').val(val)
            $('#controls-cannon-power').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyZ') {
            let val = parseFloat($('#controls-gravity').val()) + 0.5
            if (val < 0) val = 0
            if (val > 100) val = 100
            cannon.cannonball_weight = val
            $('#controls-gravity-input').val(val)
            $('#controls-gravity').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'KeyC') {
            let val = parseFloat($('#controls-gravity').val()) - 0.5
            if (val < 0) val = 0
            if (val > 100) val = 100
            cannon.cannonball_weight = val
            $('#controls-gravity-input').val(val)
            $('#controls-gravity').val(val)
            cannon.displayAimAssist()
        }
        if (event.code == 'Space') {
            $('#controls-fire').click()
        }
    })
    // #endregion keyboard listeners

    function render() {

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    } render()
})