import React, {PureComponent} from 'react';
import {Checkbox, Select, Input, Row, Col} from 'antd';
import styles from './styles.css';
import NumberInput from '../../../../components/NumberInput/Index.jsx';
import Line from '../../../../components/Line/Index.jsx'
import {actions as writeAndDrawActions} from "../../../../reducers/writeAndDraw";
import {connect} from 'react-redux';
import {ConfigText, ConfigTitle, ConfigSelect} from "../../../../components/Config";
import {withTranslation} from 'react-i18next';
import ReactTooltip from "react-tooltip";
import {getUuid} from '../../../../utils';

const tooltipId = getUuid();

class ConfigSvgText extends PureComponent {
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
        const {t} = this.props;
        const {model, config_text, config} = this.props;
        if (!model || model.fileType !== "text" || !config_text || !config) {
            return null;
        }
        const actions = this.actions;

        const {text, font, font_size} = config_text.children;

        const fontOptions = [];
        Object.keys(font.options).forEach((key) => {
            const option = font.options[key];
            fontOptions.push({label: key, value: option})
        });

        const {optimize_path, fill} = config.children;
        const {fill_density} = fill.children;

        return (
            <div>
                <ReactTooltip
                    id={tooltipId}
                    place="left"
                    type="info"
                    effect="solid"
                    backgroundColor="#c0c0c0"
                    textColor="#292421"
                    delayShow={200}/>
                <Line/>
                <div style={{
                    padding: "8px",
                }}>
                    <ConfigTitle text={t('Text')}/>
                    <Row
                        data-for={tooltipId}
                        data-tip={t('Content of the Text.')}>
                        <Col span={13}>
                            <ConfigText text={`${t('Content')}`}/>
                        </Col>
                        <Col span={11}>
                            <Input.TextArea style={{fontSize: "12px", resize: "none"}}
                                            value={text.default_value}
                                            onChange={actions.setText}/>
                        </Col>
                    </Row>
                    <Row
                        data-for={tooltipId}
                        data-tip={t('Font of the Text.')}>
                        <Col span={13}>
                            <ConfigText text={`${t(font.label)}`}/>
                        </Col>
                        <Col span={11}>
                            <ConfigSelect options={fontOptions} value={font.default_value} onChange={actions.setFont}/>
                        </Col>
                    </Row>
                    <Row
                        data-for={tooltipId}
                        data-tip={t('Font size of the Text.')}>
                        <Col span={19}>
                            <ConfigText text={`${t(font_size.label)}`}/>
                        </Col>
                        <Col span={5}>
                            <NumberInput
                                min={font_size.minimum_value}
                                max={font_size.maximum_value}
                                value={font_size.default_value}
                                onAfterChange={actions.setFontSize}/>
                        </Col>
                    </Row>
                    <Row
                        data-for={tooltipId}
                        data-tip={t('Optimizes the path based on the proximity of the lines in the image.')}>
                        <Col span={19}>
                            <ConfigText text={`${t(optimize_path.label)}`}/>
                        </Col>
                        <Col span={5}>
                            <Checkbox checked={optimize_path.default_value} onChange={actions.setOptimizePath}/>
                        </Col>
                    </Row>
                    <Row
                        data-for={tooltipId}
                        data-tip={t('Set the degree to which an area is filled with laser dots.')}>
                        <Col span={19}>
                            <ConfigText text={`${t(fill.label)}`}/>
                        </Col>
                        <Col span={5}>
                            <Checkbox checked={fill.default_value} onChange={actions.setFill}/>
                        </Col>
                    </Row>
                    {fill.default_value &&
                    <Row>
                        <Col span={17} push={2}>
                            <ConfigText text={`${t(fill_density.label)}`}/>
                        </Col>
                        <Col span={5} push={2}>
                            <NumberInput
                                min={fill_density.minimum_value}
                                max={fill_density.maximum_value}
                                value={fill_density.default_value}
                                onAfterChange={actions.setFillDensity}/>
                        </Col>
                    </Row>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {model, config, config_text} = state.writeAndDraw;
    return {
        model,
        config,
        config_text
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateConfigText: (key, value) => dispatch(writeAndDrawActions.updateConfigText(key, value)),
        updateConfig: (key, value) => dispatch(writeAndDrawActions.updateConfig(key, value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ConfigSvgText));

