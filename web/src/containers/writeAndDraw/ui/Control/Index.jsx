import React from 'react';
import {connect} from 'react-redux';
import DeviceControl from "../../../_deviceControl/Index.jsx"
import {actions as gcodeSendActions} from "../../../../reducers/gcodeSend";
import {actions as writeAndDrawActions} from "../../../../reducers/writeAndDraw";
import NumberInput from '../../../../components/NumberInput/Index.jsx';
import {Row, Col} from 'antd';
import {withTranslation} from 'react-i18next';

class Index extends React.Component {
    actions = {
        setJogPenOffset: (value) => {
            this.props.updateWriteAndDrawParameters('jog_pen_offset', value)
        }
    };

    render() {
        const actions = this.actions;
        const {jog_pen_offset} = this.props;
        const {t} = this.props;
        return (
            <div>
                <DeviceControl/>
                <div style={{padding: "6px"}}>
                    <Row>
                        <Col span={15}>
                            <span>{t(jog_pen_offset.label)}</span>
                            <span>{"(" + jog_pen_offset.unit + ")"}</span>
                        </Col>
                        <Col span={9}>
                            <NumberInput
                                min={jog_pen_offset.minimum_value}
                                max={jog_pen_offset.maximum_value}
                                value={jog_pen_offset.default_value}
                                onAfterChange={actions.setJogPenOffset}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {status} = state.serialPort;
    const {jog_pen_offset} = state.writeAndDraw.write_and_draw;
    return {
        serialPortStatus: status,
        jog_pen_offset
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendGcode: (gcode) => dispatch(gcodeSendActions.start(gcode)),
        updateWriteAndDrawParameters: (key, value) => dispatch(writeAndDrawActions.updateWriteAndDrawParameters(key, value))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Index));

