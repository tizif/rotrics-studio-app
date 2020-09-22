import VM from 'rotrics-scratch-vm';
import defaultProjectJson from "./default_sc_project.json";
import {actions as gcodeSendActions} from './gcodeSend';
import {actions as codeProjectActions} from "./codeProject";
import {getUuid} from '../utils/index.js';
import socketClientManager from "../socket/socketClientManager";
import {GCODE_SENDER_STATUS_CHANGE} from "../constants";
import messageI18n from "../utils/messageI18n";

const INIT_VM = 'code/INIT_VM';
const SET_RUNNING = "code/SET_RUNNING";

const INITIAL_STATE = {
    vm: null,
    running: false
};

export const actions = {
    init: () => (dispatch) => {
        dispatch(actions._init());
        dispatch(actions.loadEmptyProject());
        dispatch(actions._setupListener());
    },
    _init: () => {
        return {
            type: INIT_VM
        };
    },
    _setupListener: () => (dispatch, getState) => {
        const vm = getState().code.vm;
        //参考：scratch-gui/lib/vm-listener-hoc.jsx
        document.addEventListener('keydown', (e) => {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: true
            });
            // Prevent space/arrow key from scrolling the page.
            if (e.keyCode === 32 || // 32=space
                (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            // Always capture up events,
            // even those that have switched to other targets.
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: false
            });
            // E.g., prevent scroll.
            if (e.target !== document && e.target !== document.body) {
                e.preventDefault();
            }
        });
        vm.on(
            'PROJECT_RUN_START',
            () => {
                dispatch(actions._setRunning(true));
            }
        );
        vm.on(
            'PROJECT_RUN_STOP',
            () => {
                dispatch(actions._setRunning(false));
            }
        );
        vm.on(
            'PROJECT_CHANGED',
            () => {
                //TODO: move to codeProject
                dispatch(codeProjectActions.onProjectChanged());
            }
        );
        //自定义block发送消息
        //见: rotrics-scratch-vm/src/blocks/scratch3_motions.js, line-58
        vm.runtime.on(
            'rotrics-async',
            (data) => {
                console.log(JSON.stringify(data, null, 2))
                const {blockName, args, resolve} = data;
                resolve();
                let gcode = null;
                switch (blockName) {
                    case "motion_move_home":
                        gcode = 'M1112';
                        break;
                    case "motion_move_position":
                        const {x, y, z} = args;
                        gcode = `G0 X${x} Y${y} Z${z}`;
                        break;
                    case "motion_move_origin":
                        gcode = "G0 X0 Y0 Z0";
                        break;
                    case "motion_set_work_origin":
                        gcode = "G92 X0 Y0 Z0";
                        break;
                }
                if (gcode) {
                    const taskIdLocal = getUuid();
                    dispatch(gcodeSendActions.startTask(gcode, true, false, taskIdLocal));
                    socketClientManager.addServerListener(GCODE_SENDER_STATUS_CHANGE, ({preStatus, curStatus, taskId}) => {
                        if (preStatus === "started" && curStatus === "idle" && taskId === taskIdLocal) {
                            console.log(`${blockName} resolve`)
                            resolve();
                        }
                    });
                }
            }
        );
    },
    _setRunning: (value) => {
        return {
            type: SET_RUNNING,
            value
        };
    },
    loadEmptyProject: () => (dispatch, getState) => {
        getState().code.vm.loadProject(defaultProjectJson);
        return {type: null};
    }
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case INIT_VM:
            const vm = new VM();
            vm.start();
            // 为了正常使用blocks，至少load一个project，保证至少有一个target
            // 为了方便，直接生成一个默认的项目，json格式，加载即可
            // default_sc_project.json的生成：使用官方的scratch-gui，const json = vm.toJSON();
            return Object.assign({}, state, {vm});
        case SET_RUNNING:
            const {value} = action;
            return Object.assign({}, state, {running: value});
        default:
            return state;
    }
}
