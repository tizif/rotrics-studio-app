import React, {PureComponent} from 'react';
import {Checkbox, Select, Input, Row, Col} from 'antd';
import {toFixed} from '../../../../utils/index.js';
import styles from './styles.css';
import {actions as laserTextActions} from '../../../../reducers/laserText';
import NumberInput from '../../../../components/NumberInput/Index.jsx';
import _ from 'lodash';
import Line from '../../../../components/Line/Index.jsx'
import {actions as laserActions} from "../../../../reducers/laser";
import {connect} from 'react-redux';

class ConfigText extends PureComponent {
    actions = {
        //config text
        setText: (e) => {
            if (e.target.value.trim().length > 0) {
                this.props.updateConfigText("text", e.target.value.trim())
            }
        },
        setFont: (value) => {
            this.props.updateConfigText("font", value)
        },
        setFontSize: (value) => {
            this.props.updateConfigText("font_size", value)
        },
        //config
        setOptimizePath: (e) => {
            this.props.updateConfig("optimize_path", e.target.checked)
        },
        setFill: (e) => {
            this.props.updateConfig("fill", e.target.checked)
        },
        setFillDensity: (value) => {
            this.props.updateConfig("fill.fill_density", value)
        },
    };

    render() {
        const {model, config_text, config} = this.props;
        if (!model || model.fileType !== "text" || !config_text || !config || config.type !== "svg") {
            return null;
        }
        const actions = this.actions;

        const {text, font, font_size} = config_text.children;

        const fontOptions = [];
        Object.keys(font.options).forEach((key) => {
            const option = font.options[key];
            fontOptions.push(<Select.Option key={key} value={option}>{key}</Select.Option>)
        });

        const {optimize_path, fill} = config.children;
        const {fill_density} = fill.children;

        return (
            <React.Fragment>
                <Line/>
                <h4>{config.label}</h4>
                <Row>
                    <Col span={11}>
                        <span>{text.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <Input.TextArea value={text.default_value} autoSize={{minRows: 1, maxRows: 1}}
                                        onChange={actions.setText}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <span>{font.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <Select value={font.default_value} style={{width: 150}}
                                onChange={actions.setFont}>
                            {fontOptions}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <span>{font_size.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <NumberInput min={font_size.minimum_value} max={font_size.maximum_value}
                                     value={toFixed(font_size.default_value, 0)}
                                     onChange={actions.setFontSize}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <span>{optimize_path.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <Checkbox checked={optimize_path.default_value} onChange={actions.setOptimizePath}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <span>{fill.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <Checkbox checked={fill.default_value} onChange={actions.setFill}/>
                    </Col>
                </Row>
                {fill.default_value &&
                <Row>
                    <Col span={11} push={2}>
                        <span>{fill_density.label}</span>
                    </Col>
                    <Col span={8} push={5}>
                        <NumberInput min={fill_density.minimum_value} max={fill_density.maximum_value}
                                     value={toFixed(fill_density.default_value, 0)}
                                     onChange={actions.setFillDensity}/>
                    </Col>
                </Row>
                }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {model, config} = state.laser;
    const {config_text} = state.laserText;
    return {
        model,
        config,
        config_text
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateConfigText: (key, value) => dispatch(laserTextActions.updateConfigText(key, value)),
        updateConfig: (key, value) => dispatch(laserActions.updateConfig(key, value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigText);

