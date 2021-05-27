import React from 'react';

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

  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
};
