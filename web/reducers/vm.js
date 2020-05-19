import VM from 'rotrics-scratch-vm';
import defaultProjectJson from "./default_sc_project.json";

const INIT_VM = 'INIT_VM';
const SET_RUNNING = "SET_RUNNING";

const INITIAL_STATE = {
    vm: null,
    running: false
};

export const actions = {
    init: () => (dispatch, getState) => {
        dispatch(actions._init());
        dispatch(actions._setupListener());
    },
    _init: () => {
        return {
            type: INIT_VM
        };
    },
    _setupListener: () => (dispatch, getState) => {
        const vm = getState().vm.vm;

        //参考：scratch-gui/lib/vm-listener-hoc.jsx
        document.addEventListener('keydown', (e) => {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;
            console.log("@@@")
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
        //自定义block发送消息
        //见: virtual-machine.js, line-167
        vm.on(
            'rotrics',
            (data) => {
                const {blockName, args} = data;
                console.log("blockName: " + JSON.stringify(blockName))
                console.log("args: " + JSON.stringify(args))
            }
        );
    },
    _setRunning: (value) => {
        return {
            type: SET_RUNNING,
            value
        };
    },
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case INIT_VM:
            const vm = new VM();
            vm.start();
            // 为了正常使用blocks，至少load一个project，保证至少有一个target
            // 为了方便，直接生成一个默认的项目，json格式，加载即可
            // default_sc_project.json的生成：使用官方的scratch-gui，const json = vm.toJSON();
            vm.loadProject(defaultProjectJson);
            return Object.assign({}, state, {vm});
        case SET_RUNNING:
            const {value} = action;
            return Object.assign({}, state, {running: value});
        default:
            return state;
    }
}
