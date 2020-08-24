// 左侧tap
export const TAP_LASER = "TAP_LASER";
export const TAP_P3D = "TAP_P3D";
export const TAP_CODE = "TAP_CODE";
export const TAP_SETTINGS = "TAP_SETTINGS";
export const TAP_BASIC = "TAP_BASIC";
export const TAB_WRITE_AND_DRAW = "TAB_WRITE_AND_DRAW";

// tool path渲染方式，line or point
// default line
// 添加在gcode的第一行
export const TOOL_PATH_RENDER_METHOD_LINE = ';TOOL_PATH_RENDER_METHOD_LINE';
export const TOOL_PATH_RENDER_METHOD_POINT = ';TOOL_PATH_RENDER_METHOD_POINT';

// p3d
export const P3D_SLICE_START = 'P3D_SLICE_START';
export const P3D_SLICE_STATUS = 'P3D_SLICE_STATUS';

// serial port
export const SERIAL_PORT_PATH_UPDATE = 'SERIAL_PORT_PATH_UPDATE'
export const SERIAL_PORT_GET_OPENED = 'SERIAL_PORT_GET_OPE';  //获取opened的串口
export const SERIAL_PORT_OPEN = 'SERIAL_PORT_OPEN';
export const SERIAL_PORT_CLOSE = 'SERIAL_PORT_CLOSE';
export const SERIAL_PORT_ERROR = 'SERIAL_PORT_ERROR';
export const SERIAL_PORT_DATA = 'SERIAL_PORT_DATA';
export const SERIAL_PORT_WRITE = 'SERIAL_PORT_WRITE'; //通过serial port发送数据，比如：固件升级相关数据，单条gcode等

// gcode sender
export const GCODE_SENDER_STATUS_CHANGE = 'GCODE_SENDER_STATUS_CHANGE'; //idle/started/stopping/paused
export const GCODE_SENDER_ACTION_REFUSE = 'GCODE_SENDER_ACTION_REFUSE'; //操作不合法，被拒绝ß

export const GCODE_SENDER_START = 'GCODE_SENDER_START';
export const GCODE_SENDER_STOP_TASK = 'GCODE_SENDER_STOP_TASK';
export const GCODE_SENDER_PAUSE_TASK = 'GCODE_SENDER_PAUSE_TASK';
export const GCODE_SENDER_RESUME_TASK = 'GCODE_SENDER_RESUME_TASK';

// tool path
export const TOOL_PATH_GENERATE_LASER = 'TOOL_PATH_GENERATE_LASER';
export const TOOL_PATH_GENERATE_WRITE_AND_DRAW = 'TOOL_PATH_GENERATE_WRITE_AND_DRAW';

// p3d material
export const P3D_MATERIAL_FETCH = 'P3D_MATERIAL_FETCH';
export const P3D_MATERIAL_UPDATE = 'P3D_MATERIAL_UPDATE';
export const P3D_MATERIAL_DELETE = 'P3D_MATERIAL_DELETE';
export const P3D_MATERIAL_CLONE = 'P3D_MATERIAL_CLONE';

// p3d setting
export const P3D_SETTING_FETCH = 'P3D_SETTING_FETCH';
export const P3D_SETTING_UPDATE = 'P3D_SETTING_UPDATE';
export const P3D_SETTING_DELETE = 'P3D_SETTING_DELETE';
export const P3D_SETTING_CLONE = 'P3D_SETTING_CLONE';

//message
export const MSG_SERIAL_PORT_CLOSE_TOAST = 'Please connect DexArm first';

//firmware upgrade
export const FIRMWARE_UPGRADE_START = 'FIRMWARE_UPGRADE_START';
export const FIRMWARE_UPGRADE_STEP_CHANGE = 'FIRMWARE_UPGRADE_STEP_CHANGE';

// front end position
export const FRONT_END_POSITION_MONITOR = 'FRONT_END_POSITION_MONITOR';
