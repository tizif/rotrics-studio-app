import fs from 'fs';
import path from 'path';

let CURA_ENGINE_PATH;
const curaEngineBasePath = path.join(__dirname, '..', 'CuraEngine', '4.6.2');
const STATIC_DIR = path.join(__dirname, '..', 'static');
const CACHE_DIR = path.join(__dirname, '..', 'static', 'cache');

const P3D_DIR_CONFIG = path.join(__dirname, '..', 'CuraEngine', 'config');
const P3D_DIR_CONFIG_MATERIAL_SETTINGS = path.join(P3D_DIR_CONFIG, 'material_settings');
const P3D_DIR_CONFIG_PRINT_SETTINGS = path.join(P3D_DIR_CONFIG, 'print_settings');
const P3D_FILE_CONFIG_MACHINE_SETTING = path.join(P3D_DIR_CONFIG, 'machine_setting', 'machine_setting.def.json');

const CODE_DIR_MY_PROJECT = path.join(__dirname, '..', 'static', 'code', 'my_projects');
const CODE_DIR_EXAMPLE_PROJECT = path.join(__dirname, '..', 'static', 'code', 'example_projects');

(() => {
    switch (process.platform) {
        case 'darwin':
            CURA_ENGINE_PATH = path.join(curaEngineBasePath, 'macOS', 'CuraEngine');
            break;
        case 'win32':
            CURA_ENGINE_PATH = path.join(curaEngineBasePath, 'Win-x64', 'CuraEngine.exe');
            break;
        case 'linux':
            CURA_ENGINE_PATH = path.join(curaEngineBasePath, 'Linux-x64', 'CuraEngine');
            break;
    }
    if (!fs.existsSync(CURA_ENGINE_PATH)) {
        console.error(`Cura Engine not found: ${CURA_ENGINE_PATH}`);
    }

    //清除缓存
    if (fs.existsSync(CACHE_DIR)) {
        fs.rmdirSync(CACHE_DIR, {recursive: true})
    }

    fs.mkdirSync(CACHE_DIR, {recursive: true});
    fs.mkdirSync(CODE_DIR_MY_PROJECT, {recursive: true});
    fs.mkdirSync(CODE_DIR_EXAMPLE_PROJECT, {recursive: true});
})();

export {
    CURA_ENGINE_PATH,
    STATIC_DIR,
    CACHE_DIR,
    P3D_DIR_CONFIG_PRINT_SETTINGS,
    P3D_DIR_CONFIG_MATERIAL_SETTINGS,
    P3D_DIR_CONFIG,
    P3D_FILE_CONFIG_MACHINE_SETTING,
    CODE_DIR_MY_PROJECT,
    CODE_DIR_EXAMPLE_PROJECT
};
