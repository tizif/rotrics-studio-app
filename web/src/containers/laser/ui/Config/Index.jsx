import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import FileSaver from 'file-saver';

import styles from './styles.css';
import {Button, Input, Space, Divider} from 'antd';

import "antd/dist/antd.css";

import Transformation from './Transformation.jsx';

import ConfigGreyscale from './ConfigGreyscale.jsx';
import ConfigBW from './ConfigBW.jsx';
import ConfigSvg from './ConfigSvg.jsx';
import ConfigText from './ConfigText.jsx';

import WorkingParameters from './WorkingParameters.jsx';

import Model2D from "../../lib/Model2D";
import {uploadImage, generateSvg} from '../../../../api/index.js';
import config_text from "../../lib/settings/config_text.json";
import Line from '../../../../components/Line/Index.jsx'
import {actions as gcodeSendActions} from "../../../../reducers/gcodeSend";
import {actions as laserActions} from "../../../../reducers/laser";

//Jimp支持的文件格式  https://github.com/oliver-moran/jimp
const getAccept = (fileType) => {
    let accept = '';
    switch (fileType) {
        case "bw":
        case "greyscale":
            //TODO: .tiff读取报错
            // Error: read ECONNRESET
            //       at TCP.onStreamRead (internal/stream_base_commons.js:205:27)
            // accept = '.bmp, .gif, .jpeg, .jpg, .png, .tiff';
            accept = '.bmp, .gif, .jpeg, .jpg, .png';
            break;
        case "svg":
        case "text":
            accept = '.svg';
            break;
    }
    return accept;
};

class Index extends React.Component {
    fileInput = React.createRef();
    state = {
        fileType: '', // bw, greyscale, vector
        accept: '',
    };

    actions = {
        onChangeFile: async (event) => {
            //bw, greyscale, svg
            const file = event.target.files[0];
            const fileType = this.state.fileType;
            const response = await uploadImage(file);
            const {url, width, height} = response;
            console.log("response: " + JSON.stringify(response))

            const model = new Model2D(fileType);
            model.loadImg(url, width, height);

            this.props.addModel(model);
        },
        onClickToUpload: async (fileType) => {
            if (fileType === "text") {
                const config = _.cloneDeep(config_text);
                const svg = await generateSvg(config.config_text);

                const filename = "text.svg";
                const blob = new Blob([svg], {type: 'text/plain'});
                const file = new File([blob], filename);

                const response = await uploadImage(file);

                const {url, width, height} = response;
                console.log("response: " + JSON.stringify(response))

                const model = new Model2D(fileType);
                model.loadImg(url, width, height);

                //增加数据config_text
                model.userData = {config_text: config.config_text};

                this.props.addModel(model);
                return;
            }

            this.setState({
                fileType,
                accept: getAccept(fileType)
            }, () => {
                this.fileInput.current.value = null;
                this.fileInput.current.click();
            });
        },
        generateGcode: () => {
            this.props.generateGcode();
        },
        exportGcode: () => {
            const gcode = this.props.gcode;
            const blob = new Blob([gcode], {type: 'text/plain;charset=utf-8'});
            const fileName = "be.gcode";
            FileSaver.saveAs(blob, fileName, true);
        },
        startSendGcode: () => {
            const gcode = this.props.gcode;
            this.props.startSendGcode(gcode);
        },
        stopSendGcode: () => {
            this.props.stopSendGcode();
        },
    };

    render() {
        const {accept} = this.state;
        const {fileTypeSelected} = this.props;
        const actions = this.actions;
        return (
            <div style={{
                width: "100%",
                height: "100%"
            }}>
                <Space direction={"vertical"} style={{width: "100%", padding: "5px"}}>
                    <Button
                        block
                        onClick={actions.generateGcode}
                    >
                        {"Generate G-code"}
                    </Button>
                    <Button
                        block
                        onClick={actions.exportGcode}
                    >
                        {"Export G-code"}
                    </Button>
                    <Button
                        block
                        onClick={actions.startSendGcode}
                    >
                        {"Start Send"}
                    </Button>
                    <Button
                        block
                        onClick={actions.stopSendGcode}
                    >
                        {"Stop Send"}
                    </Button>
                </Space>
                <Line/>
                <h4>{"current image type: " + fileTypeSelected}</h4>
                <input
                    ref={this.fileInput}
                    type="file"
                    accept={accept}
                    style={{display: 'none'}}
                    multiple={false}
                    onChange={actions.onChangeFile}
                />
                <Space direction={"horizontal"} style={{width: "100%", paddingLeft: "6px"}} size={5}>
                    <button
                        className={styles.btn_bw}
                        onClick={() => actions.onClickToUpload('bw')}
                    />
                    <button
                        className={styles.btn_greyscale}
                        onClick={() => actions.onClickToUpload('greyscale')}
                    />
                    <button
                        className={styles.btn_svg}
                        onClick={() => actions.onClickToUpload('svg')}
                    />
                    <button
                        className={styles.btn_text}
                        onClick={() => actions.onClickToUpload('text')}
                    />
                </Space>
                <Transformation/>
                <ConfigGreyscale/>
                <ConfigBW/>
                <ConfigSvg/>
                <ConfigText/>
                <WorkingParameters/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {status} = state.serialPort;
    const {gcode, model, isAllPreviewed} = state.laser;
    let fileTypeSelected = model ? model.fileType : "";
    return {
        serialPortStatus: status,
        gcode,
        fileTypeSelected,
        isAllPreviewed
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        startSendGcode: (gcode) => dispatch(gcodeSendActions.start(gcode)),
        stopSendGcode: () => dispatch(gcodeSendActions.stop()),
        //model
        addModel: (model) => dispatch(laserActions.addModel(model)),
        generateGcode: () => dispatch(laserActions.generateGcode()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
