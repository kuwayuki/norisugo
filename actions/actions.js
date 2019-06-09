import * as DEF from '../constants/constants';

export const clearStore = setting => ({
  type: DEF.CLEAR,
});
// ★自分情報★ //////////////////////
// 設定全般
export const setOwnInfo = setting => ({
  type: DEF.OWN_INFO.SETTING,
  setting: setting,
});
// 現在地地点情報：設定
export const setOwnInfoCoords = coords => ({
  type: DEF.OWN_INFO.EDIT_COORDS,
  coords: coords,
});
// 現在地地点情報取得間隔：設定
export const setOwnInfoSetting = ownInfo => ({
  type: DEF.OWN_INFO.EDIT_SETTING,
  ownInfo: ownInfo,
});
// 選択通知情報：設定
export const setOwnInfoSelectedIndex = selectedIndex => ({
  type: DEF.OWN_INFO.EDIT_SELECTED_INDEX,
  selectedIndex: selectedIndex,
});
export const setOwnInfoReviewed = reviewed => ({
  type: DEF.OWN_INFO.REVIEWED,
  reviewed: reviewed,
});

// ★アラームリスト★ //////////////////////
// アラーム項目：追加
export const addAlermItem = alermItem => ({
  type: DEF.ALERM_LIST.ADD,
  alermItem: alermItem,
});
// アラーム項目：編集
export const setAlermItem = alermItem => ({
  type: DEF.ALERM_LIST.EDIT,
  alermItem: alermItem,
});
// アラーム項目：削除
export const deleteAlermItem = index => ({
  type: DEF.ALERM_LIST.DELETE,
  index: index,
});
// アラーム項目：リフレッシュ
export const refleshAlermItem = coords => ({
  type: DEF.ALERM_LIST.REFLESH,
  coords: coords,
});
// 有効／無効切替
export const setAlermAvailable = index => ({
  type: DEF.ALERM_LIST.EDIT_AVAILABLE,
  index: index,
});
