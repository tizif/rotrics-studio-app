import React, {PureComponent} from 'react';
import {Checkbox, Row, Col} from 'antd';
import {toFixed} from '../../../../utils/index.js';
import styles from './styles.css';
import NumberInput from '../../../../components/NumberInput/Index.jsx';
import Line from '../../../../components/Line/Index.jsx'
import {actions as writeAndDrawActions} from "../../../../reducers/writeAndDraw";
import {connect} from 'react-redux';

class ConfigSvg extends PureComponent {
    actions = {
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
        const {model, config} = this.props;
        // console.log("ConfigSvg model===="+JSON.stringify(model)+"    config===="+JSON.stringify(config))
        if (!model || model.fileType !== "svg" || !config) {
            return null;
        }

        const actions = this.actions;
        const {optimize_path, fill} = config.children;
        const {fill_density} = fill.children;
        return (
            <div>
                <Line/>
                <div style={{
                    padding: "5px",
                }}>
                    <h4>{config.label}</h4>
                    <Row>
                        <Col span={15}>
                            <span>{optimize_path.label}</span>
                        </Col>
                        <Col span={9}>
                            <Checkbox checked={optimize_path.default_value} onChange={actions.setOptimizePath}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={15}>
                            <span>{fill.label}</span>
                        </Col>
                        <Col span={9}>
                            <Checkbox checked={fill.default_value} onChange={actions.setFill}/>
                        </Col>
                    </Row>
                    {fill.default_value &&
                    <Row>
                        <Col span={13} push={2}>
                            <span>{fill_density.label}</span>
                        </Col>
                        <Col span={9} push={2}>
                            <NumberInput min={fill_density.minimum_value} max={fill_density.maximum_value}
                                         value={toFixed(fill_density.default_value, 0)}
                                         onChange={actions.setFillDensity}/>
                        </Col>
                    </Row>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {model, config} = state.writeAndDraw;
    return {
        model,
        config
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateConfig: (key, value) => dispatch(writeAndDrawActions.updateConfig(key, value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigSvg);

