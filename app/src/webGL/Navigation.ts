import WebglExperience, { TimeTypes } from ".";
import * as THREE from "three";

interface viewType {
    spherical: {
        value: THREE.Spherical,
        smoothed: THREE.Spherical,
        smoothing: number,
    },
    drag: {
        delta: { x: number, y: number },
        previous: { x: number, y: number },
        sensitivity: number,
    },
    zoom: {
        value: number,
        smoothed: number,
        smoothing: number,
        sensitivity: number,
    },
    target: {
        value: THREE.Vector3,
        smoothed: THREE.Vector3,
        smoothing: number,
    },
    onMouseMove: (e: MouseEvent) => void,

}

export default class Navigation {
    experience: WebglExperience;
    camera: THREE.PerspectiveCamera;
    time: TimeTypes;
    view!: viewType;

    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.camera = experience.camera;
        this.time = experience.time

        this.init()

    }

    init() {
        const spherical = new THREE.Spherical(2.8, Math.PI / 2.2, Math.PI * -0.27);
        const target = new THREE.Vector3();

        this.view = {
            spherical: {
                value: spherical.clone(),
                smoothed: spherical.clone(),
                smoothing: 0.000001
            },
            drag: {
                delta: { x: 0, y: 0 },
                previous: { x: 0, y: 0 },
                sensitivity: 5
            },
            zoom: {
                value: 0,
                smoothed: 0,
                smoothing: 0.01,
                sensitivity: 1
            },
            target: {
                value: target.clone(),
                smoothed: target.clone(),
                smoothing: 0.01,
            },
            onMouseMove(e) {

                this.drag.delta.x = e.clientX - this.drag.previous.x;
                this.drag.delta.y = e.clientY - this.drag.previous.y;

                this.drag.previous.x = e.clientX;
                this.drag.previous.y = e.clientY;

                // console.log(this.drag.delta)
            },
        }

        this.view.onMouseMove = this.view.onMouseMove.bind(this.view);
        window.addEventListener("mousemove", this.view.onMouseMove)
    }

    update() {

        // Drags
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3(-1, 0, 0);


        // get where camera is looking at
        up.applyQuaternion(this.camera.quaternion);
        right.applyQuaternion(this.camera.quaternion);

        // reduce value base on the current drag 
        up.multiplyScalar(this.view.drag.delta.y * 0.001);
        right.multiplyScalar(this.view.drag.delta.x * 0.001);

        // offset target value with where camera is looking at
        this.view.target.value.add(up);
        this.view.target.value.add(right);

        // reset drags
        this.view.drag.delta.x = 0;
        this.view.drag.delta.y = 0;

        // Smoothed
        this.view.target.smoothed.x += (this.view.target.value.x - this.view.target.smoothed.x) * this.view.target.smoothing;
        this.view.target.smoothed.y += (this.view.target.value.y - this.view.target.smoothed.y) * this.view.target.smoothing;





        const viewPosition = new THREE.Vector3();
        viewPosition.setFromSpherical(this.view.spherical.smoothed)

        // offset viewposition with current target value
        viewPosition.add(this.view.target.smoothed);

        this.camera.position.copy(viewPosition);
        this.camera.lookAt(this.view.target.smoothed);

    }

    dispose() {
        window.removeEventListener("mousemove", this.view.onMouseMove)
    }
}