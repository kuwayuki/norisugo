import I18n from '../i18n/index';
let unique = '_NAME';

// export const DISPLAY_HEADER_ICON = true;
export const DISPLAY_HEADER_ICON = false;
export const GEOFENCE_ON = true;
// export const SETTING_APP_URL = 'app-settings://notification/expo';// TODO:
export const SETTING_APP_URL = 'app-settings:';// TODO:
export const APP_STORE_ID = '1471348212';
export const APP_FREE_STORE_ID = '1471345749';
export const APP_URL = "https://apps.apple.com/jp/app/" + APP_FREE_STORE_ID;
export const PLAY_STORE_ID = '1467611043';// TODO:
export const ICON_BTN_SIZE = 35;

export const ALERM_LIST = {
  ADD: 'ADD' + unique,
  EDIT: 'EDIT' + unique,
  DELETE: 'DELETE' + unique,
  REFLESH: 'REFLESH' + unique,
  EDIT_AVAILABLE: 'EDIT_AVAILABLE' + unique,
};
export const CLEAR = 'CLEAR_STATE';

unique = '_OWN_INFO';
export const OWN_INFO = {
  SETTING: 'SETTING' + unique,
  EDIT_COORDS: 'EDIT_COORDS' + unique,
  EDIT_SETTING: 'EDIT_SETTING' + unique,
  EDIT_SELECTED_INDEX: 'EDIT_SELECTED_INDEX' + unique,
  REVIEWED: 'REVIEWED' + unique,
};

export const VIBRATION_PATTERN = {
  PTN_1: [1000, 2000, 3000],
  PTN_2: [1000, 2000, 3000],
  PTN_3: [1000, 2000, 3000],
};

export const DISTANCE_KIND = [
  '100M',
  '300M',
  '500M',
  '750M',
  '1KM',
  '3KM',
  '5KM',
];

export const DISTANCE_KIND_METER = [100, 300, 500, 750, 1000, 3000, 5000];

export const MAX_TRIAL = 2;
export const MAX_OFFICAL = 9;
export const RECOVERY_TIME = 60;
export const STATUS = {
  AVAILABLE: 0,
  DISABLE: 1,
  ALERMED: 2,
  OUT_WEEK_DAY: 3,
  OUT_TIME: 4,
};
