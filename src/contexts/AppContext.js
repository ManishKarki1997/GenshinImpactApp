import React from 'react';
import socketIOClient from 'socket.io-client';
import {
  getUniqueId,
  getManufacturer,
  getSystemName,
  getBrand,
  getAndroidId,
} from 'react-native-device-info';

const {API_URL} = require('../constants');

const AppStateContext = React.createContext();

const AppDispatchContext = React.createContext();

export const useAppStateContext = () => React.useContext(AppStateContext);

export const useAppDispatchContext = () => React.useContext(AppDispatchContext);

const initialData = {
  isLoading: false,
  characters: [],
  currentlyViewingCharacter: null,
  weapons: [],
  currentlyViewingWeapon: null,
  talentBooksToFarmForTheDay: null,
  weaponAscMatsToFarmForTheDay: null,
  resinInfo: {
    currentResin: 0,
    lastSetResinTime: null,
  },
  lastSetParametricTransformer: null,
  parametricTransformerTime: {
    days: 6,
    hours: 22,
    mins: 0,
    lastSetDate: new Date(),
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };

    case 'SET_CHARACTERS':
      return {
        ...state,
        characters: action.payload.characters,
        isLoading: false,
      };

    case 'SET_CURRENTLY_VIEWING_CHARACTER':
      return {
        ...state,
        currentlyViewingCharacter: action.payload.character,
        isLoading: false,
      };

    case 'SET_WEAPONS':
      return {
        ...state,
        weapons: action.payload.weapons,
        isLoading: false,
      };

    case 'SET_CURRENTLY_VIEWING_WEAPON':
      return {
        ...state,
        currentlyViewingWeapon: action.payload.weapon,
        isLoading: false,
      };

    case 'SET_MATS_FOR_A_DAY':
      return {
        ...state,
        isLoading: false,
        talentBooksToFarmForTheDay: action.payload.talentBooks,
        weaponAscMatsToFarmForTheDay: action.payload.ascensionMaterials,
      };

    case 'SET_RESIN_INFO':
      return {
        ...state,
        resinInfo: {
          ...action.payload.resinInfo,
        },
      };

    case 'SET_PARAMETRIC_TRANSFORMER':
      return {
        ...state,
        lastSetParametricTransformer:
          action.payload.lastSetParametricTransformer,
      };

    case 'SET_PARAMETRIC_TRANSFORMER_TIME':
      return {
        ...state,
        parametricTransformerTime: {
          ...action.payload.parametricTransformerTime,
        },
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AppProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(appReducer, initialData);

  // React.useEffect(() => {
  //   const uniqueId = getUniqueId();
  //   const systemName = getSystemName();
  //   const brandName = getBrand();

  //   // just for me to see how many users use the app
  //   // no point in continuing improving the app if there is no-one to ues
  //   // sending unique id and brand name

  //   const socket = socketIOClient(API_URL);
  //   // const socket = socketIOClient('http://092aeee7efae.ngrok.io');
  //   socket.emit('I_AM_ONLINE', {
  //     uniqueId,
  //     systemName,
  //     brandName,
  //   });
  // }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
