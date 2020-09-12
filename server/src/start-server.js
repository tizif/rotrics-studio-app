import fs from 'fs';
import path from 'path';
import http from "http";
import _ from 'lodash';
import SocketIoServer from 'socket.io';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import serve from 'koa-static';
import isElectron from 'is-electron';
import {getImageSize, getUniqueFilename} from './utils/index.js';
import serialPortManager from './serialPortManager.js';
import generateToolPathLines from './toolPath/generateToolPathLines.js';
import gcodeSender from './gcode/gcodeSender.js';
import frontEndPositionMonitor from "./frontEndPositionMonitor";
import p3dStartSlice from './p3dStartSlice.js';
import {
    SERIAL_PORT_PATH_UPDATE,
    SERIAL_PORT_GET_OPENED,
    SERIAL_PORT_OPEN,
    SERIAL_PORT_CLOSE,
    SERIAL_PORT_ERROR,
    SERIAL_PORT_DATA,
    SERIAL_PORT_WRITE,
    TOOL_PATH_GENERATE_LASER,
    TOOL_PATH_GENERATE_WRITE_AND_DRAW,

    GCODE_SENDER_STATUS_CHANGE,
    GCODE_SENDER_START,
    GCODE_SENDER_STOP_TASK,
    GCODE_SENDER_PAUSE_TASK,
    GCODE_SENDER_RESUME_TASK,
    GCODE_SENDER_ACTION_REFUSE,
    P3D_CONFIG_MATERIAL_SETTINGS_FETCH,
    P3D_CONFIG_MATERIAL_SETTING_UPDATE,
    P3D_CONFIG_MATERIAL_SETTING_DELETE,
    P3D_CONFIG_MATERIAL_SETTING_CLONE,
    P3D_CONFIG_PRINT_SETTINGS_FETCH,
    P3D_CONFIG_PRINT_SETTING_UPDATE,
    P3D_SLICE_START,
    P3D_SLICE_STATUS,
    FIRMWARE_UPGRADE_START,
    FIRMWARE_UPGRADE_STEP_CHANGE,
    FRONT_END_POSITION_MONITOR,
} from "./constants.js"
import firmwareUpgradeManager from "./firmwareUpgradeManager.js";
import {STATIC_DIR, CACHE_DIR, P3D_DIR_CONFIG_PRINT_SETTINGS, P3D_DIR_CONFIG_MATERIAL_SETTINGS} from './init.js';
import SVGParser from './SVGParser/index.js';
import {CODE_DIR_EXAMPLE_PROJECT, CODE_DIR_MY_PROJECT} from "./init";

let serverCacheAddress; //获取端口后，再初始化
//socket.io conjunction with koa: https://github.com/socketio/socket.io
let app = new Koa();
let router = new Router();
let httpServer = http.createServer(app.callback());
let socketIoServer = new SocketIoServer(httpServer);

/**
 * 保存file到，静态文件夹下的cache
 * @param file: ctx.request.files.file
 * @returns {filePath: *, url: *}
 */
const saveFileToCacheDir = (file) => {
    const reader = fs.createReadStream(file.path);
    const filename = getUniqueFilename(file.name);
    let filePath = path.join(CACHE_DIR, filename);
    const upStream = fs.createWriteStream(filePath);
    reader.pipe(upStream);
    return {url: serverCacheAddress + filename, filePath};
};

const getFilename = (filePath) => {
    return path.basename(filePath, path.extname(filePath));
};

const setupHttpServer = () => {
    //file: {"size":684,"path":"/var/folders/r6/w_gtq1gd0rbg6d6ry_h8t6wc0000gn/T/upload_bac2aa9af7e18da65c7535e1d44f4250","name":"cube_bin.stl","type":"application/octet-stream","mtime":"2020-04-17T04:21:17.843Z"}
    router.post('/uploadFile', async (ctx) => {
        const file = ctx.request.files.file;
        const {url} = saveFileToCacheDir(file);
        console.log("upload file ok: " + file.name + " -> " + url)
        return ctx.body = {url};
    });

    router.post('/uploadImage', async (ctx) => {
        const file = ctx.request.files.file;
        const {url, filePath} = saveFileToCacheDir(file);
        let width = 0, height = 0;
        //bug-fix: getImageSize获取svg size有时候不准确
        //TODO: 读取文件，file.path ok，filePath就不行。why？
        if (filePath.endsWith(".svg") || filePath.endsWith(".SVG")) {
            const svgParser = new SVGParser();
            const result = await svgParser.parseFile(file.path);
            width = result.width;
            height = result.height;
        } else {
            const result = getImageSize(file.path);
            width = result.width;
            height = result.height;
        }
        console.log("upload image ok: " + file.name + " size: " + width + 'x' + height + " -> " + url);
        return ctx.body = {url, width, height};
    });

    // code project
    router
        .get('/code/project/fetch/infos/my', async (ctx) => {
            const data = [];
            const filenames = fs.readdirSync(CODE_DIR_MY_PROJECT);
            filenames.forEach((filename) => {
                const filePath = path.join(CODE_DIR_MY_PROJECT, filename);
                const {ctimeMs, mtimeMs} = fs.statSync(filePath);
                const info = {
                    name: getFilename(filePath),
                    filePath,
                    location: "my",
                    created: ctimeMs,
                    modified: mtimeMs
                };
                data.push(info)
            });
            return ctx.body = {status: "ok", data};
        })
        .get('/code/project/fetch/infos/example', async (ctx) => {
            const data = [];
            const filenames = fs.readdirSync(CODE_DIR_EXAMPLE_PROJECT);
            filenames.forEach((filename) => {
                const filePath = path.join(CODE_DIR_EXAMPLE_PROJECT, filename);
                const {ctimeMs, mtimeMs} = fs.statSync(filePath);
                const info = {
                    name: getFilename(filePath),
                    filePath,
                    location: "example",
                    created: ctimeMs,
                    modified: mtimeMs
                };
                data.push(info)
            });
            return ctx.body = {status: "ok", data};
        })
        .post('/code/project/fetch/content', async (ctx) => {
            const {projectInfo} = JSON.parse(ctx.request.body);
            const {filePath} = projectInfo;
            const content = fs.readFileSync(filePath, 'utf8');
            return ctx.body = {status: "ok", data: content};
        })
        .post('/code/project/rename', async (ctx) => {
            const {projectInfo, name, extension} = JSON.parse(ctx.request.body);
            const {filePath: oldPath} = projectInfo;
            const newPath = path.join(CODE_DIR_MY_PROJECT, `${name}${extension}`);
            fs.renameSync(oldPath, newPath);
            return ctx.body = {status: "ok"};
        })
        .post('/code/project/delete', async (ctx) => {
            const {projectInfo} = JSON.parse(ctx.request.body);
            const {filePath} = projectInfo;
            fs.unlinkSync(filePath);
            return ctx.body = {status: "ok"};
        })
        .post('/code/project/save', async (ctx) => {
            const {projectInfo, content} = JSON.parse(ctx.request.body);
            console.log(JSON.stringify(projectInfo, null, 2))
            let {filePath, name, extension} = projectInfo;
            if (!filePath) {
                filePath = path.join(CODE_DIR_MY_PROJECT, `${name}${extension}`);
            }
            fs.writeFileSync(filePath, content);
            return ctx.body = {status: "ok"};
        })
        .post('/code/project/save-as', async (ctx) => {
            const {content, name, extension} = JSON.parse(ctx.request.body);
            const filePath = path.join(CODE_DIR_MY_PROJECT, `${name}${extension}`);
            fs.writeFileSync(filePath, content);
            return ctx.body = {status: "ok"};
        })
    ;

    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    });
    app.use(async (ctx, next) => {
        console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
        await next(); // 调用下一个middleware
    });
    app.use(koaBody({multipart: true}));
    app.use(serve(STATIC_DIR));
    app.use(router.routes());
    app.use(router.allowedMethods());
};

const readP3dConfigMaterialSettingsSync = () => {
    const contents = [];
    const filenames = fs.readdirSync(P3D_DIR_CONFIG_MATERIAL_SETTINGS);
    filenames.forEach((filename) => {
        const filePath = path.join(P3D_DIR_CONFIG_MATERIAL_SETTINGS, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        contents.push(JSON.parse(content))
    });
    return contents;
};

const readP3dConfigPrintSettingsSync = () => {
    const contents = [];
    const filenames = fs.readdirSync(P3D_DIR_CONFIG_PRINT_SETTINGS);
    filenames.forEach((filename) => {
        const filePath = path.join(P3D_DIR_CONFIG_PRINT_SETTINGS, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        contents.push(JSON.parse(content))
    });
    return contents;
};

const setupSocket = () => {
    socketIoServer.on(
        'connection',
        socket => {
            console.log('socket io server -> connect');

            socket.on('disconnect', () => {
                console.log('socket io server -> disconnect');
                //必须remove all，否则多次触发event，且内存泄漏
                socket.removeAllListeners();
                serialPortManager.removeAllListeners();
                gcodeSender.removeAllListeners();
                frontEndPositionMonitor.removeAllListeners();
            });

            //注意：最好都使用箭头函数，否则this可能指向其他对象
            //serial port
            serialPortManager.on(SERIAL_PORT_PATH_UPDATE, (paths) => {
                socket.emit(SERIAL_PORT_PATH_UPDATE, paths);
            });
            frontEndPositionMonitor.on(FRONT_END_POSITION_MONITOR, (position) => {
                socket.emit(FRONT_END_POSITION_MONITOR, position);
            });
            socket.on(SERIAL_PORT_GET_OPENED, () => {
                const path = serialPortManager.getOpened();
                socket.emit(SERIAL_PORT_GET_OPENED, path);
            });

            socket.on(SERIAL_PORT_OPEN, path => serialPortManager.open(path));
            socket.on(SERIAL_PORT_CLOSE, () => serialPortManager.close());
            socket.on(SERIAL_PORT_WRITE, data => serialPortManager.write(data));

            serialPortManager.on(SERIAL_PORT_OPEN, (path) => {
                socket.emit(SERIAL_PORT_OPEN, path);
            });
            serialPortManager.on(SERIAL_PORT_CLOSE, (path) => {
                socket.emit(SERIAL_PORT_CLOSE, path);
            });
            serialPortManager.on(SERIAL_PORT_ERROR, (error) => {
                socket.emit(SERIAL_PORT_ERROR, error);
            });
            serialPortManager.on(SERIAL_PORT_DATA, (data) => {
                socket.emit(SERIAL_PORT_DATA, data);
                gcodeSender.onSerialPortData(data)
            });

            //gcode sender
            socket.on(GCODE_SENDER_START, (data) => {
                const {gcode, isTask, isLaser} = data;
                gcodeSender.start(gcode, isTask, isLaser)
            });
            socket.on(GCODE_SENDER_STOP_TASK, () => gcodeSender.stopTask());
            socket.on(GCODE_SENDER_PAUSE_TASK, () => gcodeSender.pauseTask());
            socket.on(GCODE_SENDER_RESUME_TASK, () => gcodeSender.resumeTask());
            gcodeSender.on(GCODE_SENDER_STATUS_CHANGE, (data) => {
                socket.emit(GCODE_SENDER_STATUS_CHANGE, data);
            });
            gcodeSender.on(GCODE_SENDER_ACTION_REFUSE, (data) => {
                socket.emit(GCODE_SENDER_ACTION_REFUSE, data);
            });

            //laser
            socket.on(
                TOOL_PATH_GENERATE_LASER,
                async (data) => {
                    console.log(TOOL_PATH_GENERATE_LASER)
                    const {url, settings, toolPathId, fileType} = data;
                    const toolPathLines = await generateToolPathLines(fileType, url, settings);
                    socket.emit(TOOL_PATH_GENERATE_LASER, {toolPathLines, toolPathId});
                }
            );
            socket.on(
                TOOL_PATH_GENERATE_WRITE_AND_DRAW,
                async (data) => {
                    console.log(TOOL_PATH_GENERATE_WRITE_AND_DRAW)
                    const {url, settings, toolPathId, fileType} = data;
                    const toolPathLines = await generateToolPathLines(fileType, url, settings);
                    socket.emit(TOOL_PATH_GENERATE_WRITE_AND_DRAW, {toolPathLines, toolPathId});
                }
            );

            // p3d config: material settings
            socket.on(P3D_CONFIG_MATERIAL_SETTINGS_FETCH, () => {
                const contents = readP3dConfigMaterialSettingsSync();
                socket.emit(P3D_CONFIG_MATERIAL_SETTINGS_FETCH, contents);
            });
            socket.on(P3D_CONFIG_MATERIAL_SETTING_UPDATE, (data) => {
                const {filename, keyChain, value} = data;
                const filePath = path.join(P3D_DIR_CONFIG_MATERIAL_SETTINGS, filename);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                _.set(content, keyChain, value);
                //写回去
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                //全部读出来
                //TODO
                const contentNew = readP3dConfigMaterialSettingsSync();
                socket.emit(P3D_CONFIG_MATERIAL_SETTINGS_FETCH, contentNew);
            });

            // p3d config: print settings
            socket.on(P3D_CONFIG_PRINT_SETTINGS_FETCH, () => {
                const contents = readP3dConfigPrintSettingsSync();
                socket.emit(P3D_CONFIG_PRINT_SETTINGS_FETCH, contents);
            });
            socket.on(P3D_CONFIG_PRINT_SETTING_UPDATE, (data) => {
                const {filename, keyChain, value} = data;
                const filePath = path.join(P3D_DIR_CONFIG_PRINT_SETTINGS, filename);
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                _.set(content, keyChain, value);
                //写回去
                fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                //全部读出来
                const contentNew = readP3dConfigPrintSettingsSync();
                socket.emit(P3D_CONFIG_PRINT_SETTINGS_FETCH, contentNew);
            });

            // p3d slice
            socket.on(P3D_SLICE_START, (data) => {
                //data: {stlUrl, materialSettingFilename, printSettingFilename, id}
                const {id} = data;
                p3dStartSlice(
                    data,
                    (progress) => {
                        socket.emit(P3D_SLICE_STATUS, {progress, id});
                    },
                    (result) => {
                        socket.emit(P3D_SLICE_STATUS, {result, id});
                    },
                    (err) => {
                        socket.emit(P3D_SLICE_STATUS, {err, id});
                    }
                );
            });

            socket.on(FIRMWARE_UPGRADE_START, (data) => {
                const {isInBootLoader} = data;
                firmwareUpgradeManager.start(CACHE_DIR, isInBootLoader, (current, status, description) => {
                    socket.emit(FIRMWARE_UPGRADE_STEP_CHANGE, {current, status, description});
                })
            });
        }
    );
};

const startListen = () => {
    //electron环境下: 动态获取可用端口
    //dev环境下：http://localhost:9000
    if (isElectron()) {
        httpServer.on('listening', () => {
            //http://nodejs.cn/api/net.html#net_class_net_server
            const {port, address} = httpServer.address();
            serverCacheAddress = `http://localhost:${port}/cache/`;
            window.serverAddress = `http://localhost:${port}`;
            window.serverCacheAddress = `http://localhost:${port}/cache/`;
            window.serverFontsAddress = `http://localhost:${port}/fonts/`;
            console.log('server address: ' + window.serverAddress);
            console.log('server cache address: ' + window.serverCacheAddress);
            console.log('server fonts address: ' + window.serverFontsAddress);
        });
        httpServer.listen(0);
    } else {
        const port = 9000;
        httpServer.listen(port);
        serverCacheAddress = `http://localhost:${port}/cache/`;
        console.log('server address: ' + `http://localhost:${port}`);
        console.log('server cache address: ' + `http://localhost:${port}/cache/`);
        console.log('server fonts address: ' + `http://localhost:${port}/fonts/`);
    }
};

const startServer = () => {
    setupHttpServer();
    setupSocket();
    startListen();
};

export default startServer;
