import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  ToggleField
} from 'decky-frontend-lib';
import {
  useCustomFanCurvesEnabled,
  useEnableFullFanSpeedMode,
  useFanPerGameProfilesEnabled,
  useSupportsCustomFanCurves
} from '../../hooks/fan';
import { capitalize } from 'lodash';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectCurrentGameDisplayName } from '../../redux-modules/uiSlice';
import FanCurveSliders from './FanCurveSliders';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

const useTitle = (fanPerGameProfilesEnabled: boolean) => {
  const currentDisplayName = useSelector(selectCurrentGameDisplayName);

  if (!fanPerGameProfilesEnabled) {
    return 'Fan Control';
  }

  const title = `Fan Control - ${capitalize(currentDisplayName)}`;

  return title;
};

const WARNING_KEY = 'legionGoRemapper.customfan.warning';

const FanPanel = () => {
  const supportsFanCurves = useSupportsCustomFanCurves();
  const [showSliders, setShowSliders] = useState(false);
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(
    window.localStorage.getItem(WARNING_KEY) === 'true'
  );

  const setWarning = (value: boolean) => {
    window.localStorage.setItem(WARNING_KEY, `${value}`);
    return setAcknowledgeWarning(value);
  };
  const { enableFullFanSpeedMode, setEnableFullFanSpeedMode } =
    useEnableFullFanSpeedMode();

  const { customFanCurvesEnabled, setCustomFanCurvesEnabled } =
    useCustomFanCurvesEnabled();
  const { fanPerGameProfilesEnabled, setFanPerGameProfilesEnabled } =
    useFanPerGameProfilesEnabled();
  const title = useTitle(fanPerGameProfilesEnabled);

  if (!supportsFanCurves) {
    return null;
  }

  return (
    <>
      <PanelSection title={title}>
        {/* {!acknowledgeWarning && (
          <PanelSectionRow>
            ⚠️ Warning ⚠️ - recently reported bugs indicate that custom fan
            curves sometimes stop working for unknown reasons. Use this feature
            with caution!
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ToggleField
            label={'Hide Warning'}
            checked={acknowledgeWarning}
            onChange={setWarning}
          />
        </PanelSectionRow> */}
        <PanelSectionRow>
          <ToggleField
            label={'Enable Custom Fan Curves'}
            checked={customFanCurvesEnabled}
            onChange={setCustomFanCurvesEnabled}
          />
        </PanelSectionRow>
        {customFanCurvesEnabled && (
          <>
            <PanelSectionRow>
              <ToggleField
                label={'Enable Per Game Fan Curves'}
                checked={fanPerGameProfilesEnabled}
                onChange={setFanPerGameProfilesEnabled}
              />
            </PanelSectionRow>
            <PanelSectionRow>
              <ButtonItem
                layout="below"
                bottomSeparator={showSliders ? 'none' : 'thick'}
                style={{
                  width: '100%',
                  height: '20px',
                  display: 'flex', // Set the display to flex
                  justifyContent: 'center', // Center align horizontally
                  alignItems: 'center' // Center align vertically
                }}
                onClick={() => setShowSliders(!showSliders)}
              >
                {showSliders ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </ButtonItem>
            </PanelSectionRow>
            {showSliders && (
              <PanelSectionRow>
                <ToggleField
                  label={'Enable Full Fan Speed Mode'}
                  checked={enableFullFanSpeedMode}
                  onChange={setEnableFullFanSpeedMode}
                />
              </PanelSectionRow>
            )}
          </>
        )}
      </PanelSection>
      {customFanCurvesEnabled && !enableFullFanSpeedMode && showSliders && (
        <FanCurveSliders />
      )}
    </>
  );
};

export default FanPanel;
