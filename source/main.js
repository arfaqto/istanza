var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions an arc rotate camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90), 5, new BABYLON.Vector3(0, 0, 0), scene);    
    camera.attachControl(canvas, false);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //Creates a new standard material and sets the diffuse color to blue.
    var newMaterial = new BABYLON.StandardMaterial;
    newMaterial.diffuseColor = new BABYLON.Color3.Blue;

    // Let's look at how we can load custome assets.
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    // sphere.material = newMaterial;


    var sphere = BABYLON.SceneLoader.ImportMesh("", "./models/", "box.glb", scene);
    sphere.material = newMaterial;

    // BABYLON.SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/", "shaderBall.glb", scene, function(newMeshes){
    //     var sphere = newMeshes[0].getChildMeshes()[0];
    //     sphere.material = newMaterial;
    // });

    // var sphere = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/", "shaderBall.glb", scene);  
    // var sphere = sphere.meshes[1];
    // sphere.material = newMaterial;

    return scene;

};
window.initFunction = async function() {
    
    var asyncEngineCreation = async function() {
        try {
        return createDefaultEngine();
        } catch(e) {
        console.log("the available createEngine function failed. Creating the default engine instead");
        return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
