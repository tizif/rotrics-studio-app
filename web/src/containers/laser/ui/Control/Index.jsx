import React from 'react';
import {connect} from 'react-redux';
import {Switch, Slider} from 'antd';
import styles from './styles.css';
import DeviceControl from "../../../_deviceControl/Index.jsx"
import Line from "../../../../components/Line/Index.jsx";
import {actions as gcodeSendActions} from "../../../../reducers/gcodeSend";
import {getGcode4runBoundary} from "../../../../reducers/laser";

const INIT_LASER_POWER = 1;

class Index extends React.Component {
    state = {
        isLaserOn: false,
        laserPower: INIT_LASER_POWER
    };

    //M3: laser on
    //M5: laser off
    //M3 S${power, 0~255}: set laser power
    actions = {
        switchLaser: (checked) => {
            this.setState({isLaserOn: checked, laserPower: INIT_LASER_POWER}, () => {
                this.actions._sendGcode4laser();
            });
        },
        changeLaserPower: (laserPower) => {
            this.setState({laserPower})
        },
        afterChangeLaserPower: (laserPower) => {
            this.setState({laserPower}, () => {
                this.actions._sendGcode4laser();
            });
        },
        _sendGcode4laser: () => {
            const {isLaserOn, laserPower} = this.state;
            let gcode = "";
            if (isLaserOn) {
                gcode = `M3 S${Math.round(laserPower * 2.55)}`
            } else {
                gcode = "M5"
            }
            this.props.sendGcode(gcode);
        },
        runBoundary: () => {
            const gcode = getGcode4runBoundary();
            console.log(gcode)
            this.props.sendGcode(gcode)
        },
    };

    render() {
        const actions = this.actions;
        const state = this.state;
        return (
            <div>
                <DeviceControl runBoundary={actions.runBoundary}/>
                <Line/>
                <div style={{padding: "5px"}}>
                    <span>Laser</span>
                    <Switch style={{position: "absolute", right: "5px"}} checked={state.isLaserOn}
                            onChange={actions.switchLaser}/>
                    <Slider
                        style={{width: "95%"}}
                        min={0}
                        max={100}
                        step={1}
                        onChange={actions.changeLaserPower}
                        onAfterChange={actions.afterChangeLaserPower}
                        defaultValue={0}
                        value={state.laserPower}
                        disabled={!state.isLaserOn}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {status} = state.serialPort;
    return {
        serialPortStatus: status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendGcode: (gcode) => dispatch(gcodeSendActions.start(gcode)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);

