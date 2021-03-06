import * as THREE from 'three';
import noop from 'lodash/noop';
import GcodeToObjPrint3d from './GcodeToObjPrint3d';
import ObjToBufferGeometryPrint3d from './ObjToBufferGeometryPrint3d';

const gcodeToBufferGeometry = async (fileUrl, onProgress = noop, onError = noop) => {
    const gcodeFilepath = fileUrl;
    let result = null;
    try {
        const gcode = await readFile(gcodeFilepath);
        const gcodeObj = await gcodeToObjPrint3d(
            gcode,
            (progress) => {
                onProgress(progress / 2);
            }
        );
        const {bufferGeometry, layerCount} = await objToBufferGeometryPrint3d(
            gcodeObj,
            (progress) => {
                onProgress(progress / 2 + 0.5);
            }
        );
        const {bounds} = gcodeObj;
        result = {
            bufferGeometry,
            layerCount,
            bounds
        };
    } catch (err) {
        onError(err);
    }
    return result;
};

const readFile = (path) => {
    return new Promise((resolve, reject) => {
        new THREE.FileLoader().load(
            path,
            (data) => {
                resolve(data);
            },
            (progress) => {
            },
            (err) => {
                reject(err);
            },
        );
    });
};

// print3d
const gcodeToObjPrint3d = (gcode, onProgress = noop) => {
    return new Promise((resolve, reject) => {
        new GcodeToObjPrint3d().parse(
            gcode,
            (gcodeObj) => {
                resolve(gcodeObj);
            },
            (progress) => {
                onProgress(progress);
            },
            (err) => {
                reject(err);
            }
        );
    });
};

const objToBufferGeometryPrint3d = (gcodeObj, onProgress = noop) => {
    return new Promise((resolve, reject) => {
        new ObjToBufferGeometryPrint3d().parse(
            gcodeObj,
            (bufferGeometry, layerCount) => {
                resolve({bufferGeometry, layerCount});
            },
            (progress) => {
                onProgress(progress);
            },
            (err) => {
                reject(err);
            }
        );
    });
};

export {
    gcodeToBufferGeometry
};
