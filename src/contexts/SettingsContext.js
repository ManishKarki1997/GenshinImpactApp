import React from 'react';
import {AsyncStorageKeys} from '../constants';
import {getItem} from '../hooks/useAsyncStorage';

const SettingsStateContext = React.createContext();
const SettingsDispatchContext = React.createContext();

export const useSettingsStateContext = () =>
  React.useContext(SettingsStateContext);

export const useSettingsDispatchContext = () =>
  React.useContext(SettingsDispatchContext);

const initialSettings = {
  characterPositionInHomePageMaterials: 'MODAL',
  showEvents: true,
  showResinTimer: true,
  showParametricTransformer: true,
  slackTimeInMinsForTimer: 10,
  updateVersion: 1.2,
  newUpdateInfo: null,
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHARACTER_POSITION_IN_HOME_PAGE_MATERIALS':
      return {
        ...state,
        characterPositionInHomePageMaterials:
          action.payload.characterPositionInHomePageMaterials,
      };

    case 'SET_SHOW_EVENTS':
      return {
        ...state,
        showEvents: action.payload.showEvents,
      };

    case 'SET_SHOW_RESIN_TIMER':
      return {
        ...state,
        showResinTimer: action.payload.showResinTimer,
      };

    case 'SET_SHOW_PARAMETRIC_TIMER':
      return {
        ...state,
        showParametricTransformer: action.payload.showParametricTransformer,
      };

    case 'SET_SLACK_TIME_FOR_TIMER':
      return {
        ...state,
        slackTimeInMinsForTimer: action.payload.slackTimeInMinsForTimer,
      };

    case 'SET_NEW_UPDATE_INFO':
      return {
        ...state,
        newUpdateInfo: action.payload.newUpdateInfo,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const SettingsProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(settingsReducer, initialSettings);

  React.useEffect(() => {
    async function handleRestoreSettings() {
      const characterPositionInHomePageMaterials = await getItem(
        AsyncStorageKeys.MATERIALS_POSITION_IN_DASHBOARD,
      );

      const showEventsVal = await getItem(
        AsyncStorageKeys.SHOW_EVENTS_SETTING_KEY,
      );

      const showResinTimerVal = await getItem(
        AsyncStorageKeys.SHOW_RESIN_TIMER_SETTING_KEY,
      );

      const showParametricTimerVal = await getItem(
        AsyncStorageKeys.SHOW_TRANSFORMER_TIMER_SETTING_KEY,
      );

      const slackTimeForTimerVal = await getItem(
        AsyncStorageKeys.NOTIFICATIONS_SLACK_TIME_IN_MINS,
      );

      dispatch({
        type: 'SET_CHARACTER_POSITION_IN_HOME_PAGE_MATERIALS',
        payload: {
          characterPositionInHomePageMaterials:
            characterPositionInHomePageMaterials || 'MODAL',
        },
      });

      dispatch({
        type: 'SET_SHOW_EVENTS',
        payload: {
          showEvents: showEventsVal ? showEventsVal === 'true' : true,
        },
      });

      dispatch({
        type: 'SET_SHOW_PARAMETRIC_TIMER',
        payload: {
          showParametricTransformer: showParametricTimerVal
            ? showParametricTimerVal === 'true'
            : true,
        },
      });

      dispatch({
        type: 'SET_SHOW_RESIN_TIMER',
        payload: {
          showResinTimer: showResinTimerVal
            ? showResinTimerVal === 'true'
            : true,
        },
      });

      dispatch({
        type: 'SET_SLACK_TIME_FOR_TIMER',
        payload: {
          slackTimeInMinsForTimer: slackTimeForTimerVal
            ? parseInt(slackTimeForTimerVal)
            : 10,
        },
      });
    }

    handleRestoreSettings();
  }, []);

  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
};
