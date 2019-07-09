import { StyleSheet } from 'react-native';

export const ICON_SIZE = 25;
export const CHECK_SIZE = 30;

// 背景色
const CL_BG = '#dbe2ef';
// 最寄り背景色
const CL_NEAR_BG = '#3f72af';
// リスト背景色
const CL_LIST_BG = '#f9f7f7';
// ヘッダー色
export const CL_HEADER = '#3f72af';
// 項目ヘッダー色
const CL_ITEM_HEADER = '#59B7C9';
// const CL_ITEM_HEADER = 'darkturquoise';
// 項目サブヘッダー色
const CL_ITEM_SUB_HEADER = 'darkgray';
// const CL_ITEM_SUB_HEADER = 'yellowgreen';
// 距離有効カラー
export const CL_ABAILABLE = '#60D3D1';
export const CL_DISABLE = 'lightslategray';
export const CL_ALERMED = 'lightslategray';
export const CL_OUT_WEEK_DAY = 'lightslategray';
export const CL_OUT_TIME = 'lightslategray';

// 線色
const CL_BORDER = 'gray';
// 文字色
const FONT_MOJI = '#f5f5f5';
// 文字色(説明)
const FONT_TEXT = '#202124';
const FONT_DES = '#1a73e8';
// 残り距離文字色
const FONT_DISTANCE = '#f9f7f7';
export const CL_ICON_HEADER = '#f9f7f7';
export const RIDE_ICON_HEADER = 'gold';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: CL_BG,
    flex: 1,
  },
  nearRest: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: CL_NEAR_BG,
    padding: 7,
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
    alignItems: 'center',
  },
  nearRestTitle: {
    textAlign: 'center',
    width: 60,
    paddingTop: 8,
    paddingBottom: 8,
    color: FONT_DISTANCE,
    overflow: 'hidden',
    fontSize: 17,
  },
  nearRestInfo: {
    paddingLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  nearRestName: {
    color: FONT_MOJI,
    paddingLeft: 10,
    fontSize: 15,
  },
  nearRestDistance: {
    color: FONT_MOJI,
    paddingTop: 1,
    paddingLeft: 10,
    fontSize: 14,
  },
  itemListRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CL_LIST_BG,
    padding: 7,
    fontSize: 18,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
    alignItems: 'center',
  },
  itemFocus: {
    textAlign: 'center',
    width: 60,
    paddingTop: 8,
    paddingBottom: 8,
    color: FONT_DISTANCE,
    borderRadius: 30,
    overflow: 'hidden',
    fontSize: 17,
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  viewMiddle: {
    width: '60%',
  },
  itemList: {
    paddingTop: 5,
    paddingLeft: 3,
    fontSize: 20,
  },
  itemListDis: {
    paddingLeft: 10,
    fontSize: 14,
  },
  itemSwitch: {
    width: 60,
  },
  map: {
    height: 220,
  },
  item: {
    padding: 10,
    margin: 0,
    paddingLeft: 50,
    fontSize: 18,
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  bgColorWhite: {
    backgroundColor: CL_LIST_BG,
  },
  bgColorSelected: {
    backgroundColor: 'cornflowerblue',
  },
  textNum: {
    width: '80%',
    padding: 9,
    paddingLeft: 30,
    fontSize: 18,
    textAlign: 'right',
  },
  checkBoxText: {
    flexDirection: 'row',
    fontSize: 12,
  },
  checkBox: {
    padding: 0,
    margin: 0,
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderWidth: 0,
    textAlign: 'right',
  },
  timeZone: {
    width: '40%',
    paddingLeft: 50,
    fontSize: 18,
  },
  searchListView: {
    maxHeight: 181,
  },
  word: {
    padding: 3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
  },
  wordIcon: {
    backgroundColor: CL_LIST_BG,
    padding: 5,
  },
  wordInput: {
    marginLeft: 20,
    borderWidth: 1,
    fontSize: 18,
    width: '50%',
    borderRadius: 5,
    height: 34,
  },
  wordButton: {
    width: 60,
    height: 34,
    paddingLeft: 10,
  },
  ListRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: CL_LIST_BG,
    padding: 3,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
    alignItems: 'flex-start',
  },
  icon: {
    backgroundColor: CL_LIST_BG,
    alignItems: 'center',
    padding: 10,
  },
  itemNew: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  itemTitle: {
    fontSize: 18,
    color: FONT_TEXT,
  },
  itemDis: {
    paddingTop: 3,
    fontSize: 12,
  },
  bgColorRed: {
    backgroundColor: 'red',
  },
  sectionHeader: {
    color: FONT_MOJI,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: CL_ITEM_HEADER,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
  },
  sectionHeader2: {
    color: FONT_MOJI,
    paddingTop: 2,
    paddingLeft: 30,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: CL_ITEM_SUB_HEADER,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
  },
  rowTextSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderBottomWidth: 0.25,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  rowBottonSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CL_LIST_BG,
    borderStyle: 'solid',
    borderColor: CL_BORDER,
    borderWidth: 0.25,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  textDes: {
    paddingLeft: 30,
    fontSize: 12,
    color: FONT_DES,
  },
  button: {
    width: 90,
    paddingRight: 20,
  },
  buttonIcon: {
    width: 50,
    paddingRight: 10,
  },
  text: {
    width: '60%',
    paddingLeft: 30,
    fontSize: 16,
    color: FONT_TEXT,
  },
  setting: {
    width: 80,
  },
});
