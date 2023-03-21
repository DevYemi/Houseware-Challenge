import WebglExperience, { DebugUiTypes } from ".";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"

export default class Composer {
    experience: WebglExperience;
    renderer: THREE.WebGLRenderer;
    effectComposer!: EffectComposer;
    bokehPass!: BokehPass;
    renderPass!: RenderPass;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera
    debugUI: DebugUiTypes;
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.camera = experience.camera;
        this.renderer = experience.renderer;
        this.debugUI = experience.debugUI;

        this.init()
    }

    init() {
        // effect Composer
        this.effectComposer = new EffectComposer(this.renderer)

        // Passes
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.bokehPass = new BokehPass(this.scene, this.camera, {
            focus: 0.78,
            aperture: 0.00184,
            maxblur: 0.01
        })


        this.effectComposer.addPass(this.renderPass)
        this.effectComposer.addPass(this.bokehPass)

        this.addDebugUI()
    }

    addDebugUI() {
        if (this.debugUI.isActive && this.debugUI.ui) {
            const PARAMS = {
                focus: (this.bokehPass.uniforms as any)['focus'].value,
                aperture: (this.bokehPass.uniforms as any)['aperture'].value,
                maxBlur: (this.bokehPass.uniforms as any)['maxblur'].value,
            }
            const dofFolder = this.debugUI.ui.addFolder({
                title: "Depth Of Field",
                expanded: true
            })

            dofFolder.addInput(PARAMS, "focus", { min: -30, max: 30, step: 0.0001 }).on("change", () => {
                (this.bokehPass.uniforms as any)['focus'].value = PARAMS.focus;
            })
            dofFolder.addInput(PARAMS, "aperture", { min: 0, max: 10, step: 0.0001 }).on("change", () => {
                const value = PARAMS.aperture * 0.00001;
                (this.bokehPass.uniforms as any)['aperture'].value = value;
            })
            dofFolder.addInput(PARAMS, "maxBlur", { step: 0.000001, min: 0.0, max: 0.5 }).on("change", () => {
                (this.bokehPass.uniforms as any)['maxblur'].value = PARAMS.maxBlur;
            })

            dofFolder.addButton({
                label: "Bokeh Effect",
                title: "Toggle"
            }).on("click", () => {
                this.bokehPass.enabled = !this.bokehPass.enabled;
            })
        }
    }

    resize() {
        this.effectComposer.setSize(this.experience.sizes.width, this.experience.sizes.height);
        this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    update() {
        this.effectComposer.render()
    }
}