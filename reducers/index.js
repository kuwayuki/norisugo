import { combineReducers } from 'redux';
import { ownInfo } from './ownInfo';
import { alermList } from './alermList';
import { CLEAR } from '../constants/constants';

// ここにクリアアクションを追加
export const rootReducer = (state, action) => {
  if (action.type === CLEAR) {
    state = undefined;
  }
  return reducers(state, action);
};

const reducers = combineReducers({
  alermList: alermList,
  ownInfo: ownInfo,
});
