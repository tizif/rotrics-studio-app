import {combineReducers} from 'redux';
import gcodeSend from "./gcodeSend";
import hotKeys from "./hotKeys";
import laser from "./laser";
import laserText from "./laserText";
import p3dGcode from "./p3dGcode";
import p3dMaterial from "./p3dMaterial";
import p3dModel from "./p3dModel";
import p3dSetting from "./p3dSetting";
import serialPort from "./serialPort";
import socket from "./socket";
import taps from "./taps";
import vm from "./vm";

export default combineReducers({
    gcodeSend,
    hotKeys,
    laser,
    laserText,
    p3dGcode,
    p3dMaterial,
    p3dModel,
    p3dSetting,
    serialPort,
    socket,
    taps,
    vm,
});