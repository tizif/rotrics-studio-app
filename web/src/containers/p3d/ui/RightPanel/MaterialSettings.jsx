import React, {PureComponent} from 'react';
import {Radio} from 'antd';
import {actions as p3dMaterialSettingsActions} from "../../../../reducers/p3dMaterialSettings";
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {renderCategoryChildren, wrapCollapse, wrapCollapsePanel} from "./renderUtils.jsx";
import Line from "../../../../components/Line/Index.jsx";

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

class MaterialSettings extends PureComponent {
    actions = {
        updateSetting: (keyChain, value) => {
            this.props.update(`${keyChain}.default_value`, value);
        },
        selectSettings: (e) => {
            this.props.select(e.target.value)
        }
    };

    render() {
        const {settings, selected} = this.props;
        if (!settings || settings.length === 0 || !selected) {
            return null;
        }

        const actions = this.actions;
        const {t} = this.props;
        const tCommon = (key) => {
            return t("common#" + key);
        };
        const tCura = (key) => {
            return t("cura#" + key);
        };

        const {name, isOfficial} = selected;
        const radioGroup =
            <Radio.Group
                style={{padding: "3px 0 0 8px"}}
                key="2"
                size="small"
                defaultValue={name}
                onChange={actions.selectSettings}
            >
                {settings.map(item => {
                    const {name: itemName} = item;
                    return (
                        <Radio
                            style={radioStyle}
                            key={itemName}
                            size="small"
                            checked={itemName === name}
                            value={itemName}>
                            {tCommon(itemName)}
                        </Radio>
                    );
                })}
            </Radio.Group>;

        const categoryKey = "material.children";
        const {materialSettingsFilter} = this.props;
        const header = tCommon("Material Settings");
        const editable = !isOfficial;
        const elements4settings = renderCategoryChildren(selected.material.children, categoryKey, materialSettingsFilter, tCura, actions.updateSetting, editable);
        const line = <Line key="line"/>;
        const elements = [radioGroup, line, ...elements4settings];

        const icon = null;
        const collapsePanel = wrapCollapsePanel(header, icon, elements);
        const collapse = wrapCollapse(collapsePanel);
        return (
            <div>
                <div>
                    {collapse}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {settings, selected} = state.p3dMaterialSettings;
    const {materialSettingsFilter} = state.p3dSettingVisibility;
    return {
        settings,
        selected,
        materialSettingsFilter
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        update: (keyChain, value) => dispatch(p3dMaterialSettingsActions.update(keyChain, value)),
        rename: (newName) => dispatch(p3dMaterialSettingsActions.rename(newName)),
        delete: (name) => dispatch(p3dMaterialSettingsActions.delete(name)),
        clone: (name) => dispatch(p3dMaterialSettingsActions.clone(name)),
        select: (name) => dispatch(p3dMaterialSettingsActions.select(name)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation(['common', 'cura'])(MaterialSettings));
