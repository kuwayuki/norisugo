import * as DEF from '../constants/constants';

const INITIAL_STATE = {
  coords: { latitude: null, longitude: null, speed: null },
  distance: 100,
  performance: 0,
  isFree: true,
  isRead: false,
  reviewed: false,
  sound: true,
  recoveryTime: DEF.RECOVERY_TIME,
  recoveryDistance: true,
  isNearestDisplay: true,
  sortKind: 0,
  sortType: true,
  selectedIndex: 0,
  debug: false,
};

export const ownInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.OWN_INFO.SETTING:
      return {
        ...state,
        isFree: action.setting.isFree,
        distance: Number(action.setting.distance),
        performance: Number(action.setting.performance),
        sound: action.setting.sound,
        reviewed: action.setting.reviewed,
        recoveryTime: action.setting.recoveryTime,
        recoveryDistance: action.setting.recoveryDistance,
        isNearestDisplay: action.setting.isNearestDisplay,
        sortKind: action.setting.sortKind,
        sortType: action.setting.sortType,
        isRead: true,
        debug: action.setting.debug,
      };
    case DEF.OWN_INFO.EDIT_COORDS:
      return {
        ...state,
        coords: {
          latitude: action.coords.latitude,
          longitude: action.coords.longitude,
          speed: action.coords.speed,
        },
        isRead: true,
      };
    case DEF.OWN_INFO.EDIT_SETTING:
      return {
        ...state,
        distance: action.ownInfo.distance,
        performance: action.ownInfo.performance,
        sound: action.ownInfo.sound,
        recoveryTime: action.ownInfo.recoveryTime,
        recoveryDistance: action.ownInfo.recoveryDistance,
        isNearestDisplay: action.ownInfo.isNearestDisplay,
        sortKind: action.ownInfo.sortKind,
        sortType: action.ownInfo.sortType,
        isRead: true,
      };
    case DEF.OWN_INFO.EDIT_SELECTED_INDEX:
      return { ...state, selectedIndex: action.selectedIndex };
    case DEF.OWN_INFO.REVIEWED:
      return { ...state, reviewed: action.reviewed };
    default:
      return state;
  }
};
