import * as THREE from "three"
import WebglExperience, { DebugUiTypes } from "./index"
import VertexShader from "./shaders/terrainBackground/vertex.glsl"
import fragmentShader from "./shaders/terrainBackground/fragment.glsl";
import gsap from "gsap"


interface TextureType {
    width: number,
    height: number,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    instance: THREE.CanvasTexture,
    lineCount: number,
    bigLineWidth: number,
    smallLineWidth: number,
    update: () => void,
}

export default class TerrainBackground {
    experience: WebglExperience;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    texture!: TextureType;
    debugUI: DebugUiTypes;
    gsapTweenLoop!: gsap.core.Tween[]
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.camera = experience.camera;
        this.debugUI = experience.debugUI;
        this.gsapTweenLoop = []
        console.log("init")
        this.init()
    }

    init() {

        // Texture
        this.texture = {} as any
        this.texture.width = 32;
        this.texture.height = 128;
        this.texture.lineCount = 5;
        this.texture.bigLineWidth = 0.04
        this.texture.smallLineWidth = 0.01
        this.texture.canvas = document.createElement("canvas");
        this.texture.canvas.width = this.texture.width;
        this.texture.canvas.height = this.texture.height;
        this.texture.canvas.style.position = "fixed";
        this.texture.canvas.style.top = "20px";
        this.texture.canvas.style.left = "0px";
        this.texture.canvas.style.zIndex = "10";
        this.texture.ctx = this.texture.canvas.getContext("2d")!


        this.texture.instance = new THREE.CanvasTexture(this.texture.canvas);
        this.texture.instance.wrapS = THREE.RepeatWrapping
        this.texture.instance.wrapT = THREE.RepeatWrapping
        this.texture.instance.magFilter = THREE.NearestFilter

        this.texture.update = () => {
            this.texture.ctx.clearRect(0, 0, this.texture.width, this.texture.height);

            this.texture.ctx.fillStyle = "red";

            // Big Lines
            const actualBigLineWidth = Math.round(this.texture.height * this.texture.bigLineWidth)
            this.texture.ctx.globalAlpha = 1
            this.texture.ctx.fillRect(
                0,
                0,
                this.texture.width,
                actualBigLineWidth
            );

            // Small lines
            const actualSmallLineWidth = Math.round(this.texture.height * this.texture.smallLineWidth)
            const smallLinesCount = this.texture.lineCount - 1

            for (let i = 0; i < smallLinesCount; i++) {
                this.texture.ctx.save()
                this.texture.ctx.fillStyle = "green";
                this.texture.ctx.globalAlpha = 0.7;

                this.texture.ctx.fillRect(
                    0,
                    actualBigLineWidth + Math.round((this.texture.height - actualBigLineWidth) / this.texture.lineCount) * (i + 1),
                    this.texture.width,
                    actualSmallLineWidth
                );
                this.texture.ctx.restore()
            }
        }
        this.texture.update()





        // mesh
        const geometry = new THREE.PlaneGeometry(1, 1, 1000, 1000);
        const material = new THREE.ShaderMaterial({
            vertexShader: VertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            uniforms: {
                uTexture: { value: this.texture.instance },
                uElevation: { value: 4.0 },
                uTime: { value: 1.0 },
            }
        })

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -(Math.PI * 0.5)
        this.mesh.scale.set(15, 15, 15);
        this.mesh.position.y = -1;
        this.camera.lookAt(this.mesh.position)
        this.scene.add(this.mesh)

        // this.gsapTweenLoop.push(
        //     gsap.to(this.mesh.material.uniforms["uTime"], {
        //         value: 2.0,
        //         duration: 10,
        //         yoyo: true,
        //         yoyoEase: true,
        //         repeatDelay: 0.1,
        //         repeat: -1
        //     })
        // )

        this.addDebugUI()
    }

    rotate() {

    }

    addDebugUI() {
        const PARAMS = {
            elevation: this.mesh.material.uniforms["uElevation"].value
        }
        if (this.debugUI.isActive && this.debugUI.ui) {
            const terrainFolder = this.debugUI.ui.addFolder({
                title: "Terrain",
                expanded: true
            })

            terrainFolder.addInput(PARAMS, "elevation", { min: 0.1, max: 10.0, step: 0.00001 }).on("change", () => {
                this.mesh.material.uniforms["uElevation"].value = PARAMS.elevation
            })
        }
    }

    update() {

        this.mesh.material.uniforms["uTime"].value = this.experience.time.elaspedTime;
    }

    dispose() {
        console.log("dispose Terrain")
        this.gsapTweenLoop.forEach(ani => {
            ani.kill()
        })
    }
}