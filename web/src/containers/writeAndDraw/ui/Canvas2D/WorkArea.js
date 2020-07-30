import colornames from 'colornames';
import * as THREE from 'three';

class WorkArea {
    group = new THREE.Object3D();

    constructor() {
        const red = colornames('red');
        const green = colornames('green');


        const curve1 = new THREE.EllipseCurve(
            0, 0 - 300,            // ax, aY
            70.9 + 92.6, 70.9 + 92.6,           // xRadius, yRadius
            0, Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        )
        const points1 = curve1.getPoints(50);
        const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
        const material1 = new THREE.LineBasicMaterial({color: red});
        const ellipse1 = new THREE.Line(geometry1, material1);
        this.group.add(ellipse1);

        const curve2 = new THREE.EllipseCurve(
            0, 0 - 300,            // ax, aY
            300 + 92.6, 300 + 92.6,           // xRadius, yRadius
            0, Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        )
        const points2 = curve2.getPoints(50);
        const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        const material2 = new THREE.LineBasicMaterial({color: red});
        const ellipse2 = new THREE.Line(geometry2, material2);
        this.group.add(ellipse2);

        return this.group;
    }
}

export default WorkArea;