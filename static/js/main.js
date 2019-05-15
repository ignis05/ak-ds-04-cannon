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
    $('#controls-cannon-rotation').on('input', function () {
        let val = $(this).val()
        cannon.rotateCannon(val)
        $('#controls-cannon-rotation-input').val(val)
    })
    $('#controls-cannon-rotation-input').on('input', function () {
        let val = $(this).val()
        cannon.rotateCannon(val)
        $('#controls-cannon-rotation').val(val)
    })
    $('#controls-barrel-rotation').on('input', function () {
        let val = $(this).val()
        cannon.rotateBarrel(val)
        $('#controls-barrel-rotation-input').val(val)
    })
    $('#controls-barrel-rotation-input').on('input', function () {
        let val = $(this).val()
        cannon.rotateBarrel(val)
        $('#controls-barrel-rotation').val(val)
    })
    $('#controls-fire').click(function () {
        if (cannon.ball) {
            cannon.fire()
            $(this).html('Reload')
        }
        else {
            cannon.load()
            $(this).html('FIRE!')
        }
    })
    function updateBallDespawnSettings() {
        let on = $('#controls-ball-despawn').is(':checked')
        if (!on) {
            Cannonball.DESPAWNTIME = false
            return
        }
        let time = ~~($('#controls-ball-despawn-time').val()) // '~~' returns 0 if isNaN()
        Cannonball.DESPAWNTIME = time
    }
    $('#controls-ball-despawn').click(updateBallDespawnSettings)
    $('#controls-ball-despawn-time').on('input', updateBallDespawnSettings)
    // #endregion listeneres


    function render() {

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    } render()
})