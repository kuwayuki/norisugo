import * as DEF from '../constants/constants';

const INITIAL_STATE = [];

export const alermList = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DEF.ALERM_LIST.ADD:
      return [...state, action.alermItem];
    case DEF.ALERM_LIST.EDIT:
      return state.map(el =>
        el.index === action.alermItem.index ? action.alermItem : el
      );
    case DEF.ALERM_LIST.DELETE:
      return state.filter(el => el.index !== action.index);
    case DEF.ALERM_LIST.REFLESH:
      return state;
    case DEF.ALERM_LIST.EDIT_AVAILABLE:
      return state.map(el => {
        if (el.index === action.index) {
          var temp = el;
          temp.isAvailable = !temp.isAvailable;
          return temp;
        } else {
          return el;
        }
      });
    default:
      return state;
  }
};
