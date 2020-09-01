const ACTION_UPDATE_STATE = 'PERSISTENT_DATA/ACTION_UPDATE_STATE';
export const WORK_HEIGHT = {
    P3D: 'WORK_HEIGHT_P3D',
    LASER: 'WORK_HEIGHT_LASER',
    PEN: 'WORK_HEIGHT_PEN'
};
export const WORK_HEIGHT_PLACE_HOLDER = 'WORK_HEIGHT_PLACE_HOLDER';
const IS_TOOLTIP_DISPLAYED = "IS_TOOLTIP_DISPLAYED";

export const persistents = {
    getFloat: (key) => {

        const value = localStorage.getItem(key)
        console.log(value);
        return parseFloat(localStorage.getItem(key));
    },
    get: (key) => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value)
};

if (persistents.get(IS_TOOLTIP_DISPLAYED) === null) {
    persistents.set(IS_TOOLTIP_DISPLAYED, true);
}
if (persistents.get(WORK_HEIGHT.P3D) === null) {
    persistents.set(WORK_HEIGHT.P3D, -90);
}
if (persistents.get(WORK_HEIGHT.PEN) === null) {
    persistents.set(WORK_HEIGHT.PEN, -90);
}
if (persistents.get(WORK_HEIGHT.LASER) === null) {
    persistents.set(WORK_HEIGHT.LASER, 0);
}

const INITIAL_STATE = {
    workHeightP3d: persistents.getFloat(WORK_HEIGHT.P3D),
    workHeightPen: persistents.getFloat(WORK_HEIGHT.PEN),
    workHeightLaser: persistents.getFloat(WORK_HEIGHT.LASER),
    isTooltipDisplayed: persistents.get(IS_TOOLTIP_DISPLAYED),
};

export const actions = {
    _updateState: (state) => {
        return {
            type: ACTION_UPDATE_STATE,
            state
        };
    },
    setWorkHeightP3d: (value) => (dispatch, getState) => {
        // const key = WORK_HEIGHT.P3D;
        dispatch(actions._updateState({workHeightP3d: value}));
        // persistents.set(key, value);
    },
    setWorkHeightPen: (value) => (dispatch, getState) => {
        // const key = WORK_HEIGHT.PEN;
        dispatch(actions._updateState({workHeightPen: value}));
        // persistents.set(key, value);
    },
    setWorkHeightLaser: (value) => (dispatch, getState) => {
        // const key = WORK_HEIGHT.LASER;
        dispatch(actions._updateState({workHeightLaser: value}));
        // persistents.set(key, value);
    },
    setIsTooltipDisplayed: (value) => (dispatch) => {
        const key = IS_TOOLTIP_DISPLAYED;
        dispatch(actions._updateState({isTooltipDisplayed: value}));
        persistents.set(key, value);
    }
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ACTION_UPDATE_STATE:
            return Object.assign({}, state, action.state);
        default:
            return state;
    }
}