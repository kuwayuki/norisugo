import { AsyncStorage } from 'react-native';
let json = require('../assets/setting.json');
const UNIQUE_INDEX = 'INDEX';
const UNIQUE_SETTING = 'SETTING';
const UNIQUE_ALERM = 'ALERM';

let save = null;
export async function getSetIndex() {
  let strIndex = await AsyncStorage.getItem(UNIQUE_INDEX);
  let index = 0;
  if (strIndex !== null) {
    index = Number(strIndex);
  }
  await AsyncStorage.setItem(UNIQUE_INDEX, String(index + 1));
  return index;
}

export async function isExistsAsyncStorage(props) {
  const value = await AsyncStorage.getItem(UNIQUE_SETTING);
  if (value != null) {
    props.setOwnInfo(JSON.parse(value));
    return true;
  }
  return false;
}
export async function addAsyncStorage(alermItem) {
  AsyncStorage.setItem(
    UNIQUE_ALERM + alermItem.index,
    JSON.stringify(alermItem)
  );
}
export async function setPartAsyncStorage(index, setItem) {
  AsyncStorage.mergeItem(UNIQUE_ALERM + index, JSON.stringify(setItem));
}
export async function deleteAsyncStorage(index) {
  AsyncStorage.removeItem(UNIQUE_ALERM + index);
}
export async function saveInfo() {
  const value = await AsyncStorage.getItem(UNIQUE_SETTING);
  if (value != null) {
    save = JSON.parse(value);
  }
}

export async function clearAsyncStorage(index) {
  await saveInfo();
  AsyncStorage.clear();
}

// jsonファイルから通知情報を取得
export async function getAllStorageDataAlermList() {
  var listAlermItem = [];
  const keys = await AsyncStorage.getAllKeys();
  const items = await AsyncStorage.multiGet(keys);
  let index = 0;
  for (let key of keys) {
    if (key.indexOf(UNIQUE_ALERM) != -1) {
      listAlermItem.push(JSON.parse(items[index][1]));
    }
    index++;
  }
  return listAlermItem;
}

export async function setStorageDataOwnInfo(ownInfo) {
  await AsyncStorage.setItem(UNIQUE_SETTING, JSON.stringify(ownInfo));
}

export async function mergeStorageDataOwnInfo(parts) {
  await AsyncStorage.mergeItem(UNIQUE_SETTING, JSON.stringify(parts));
}

export async function getStorageDataOwnInfo() {
  let ownInfo = await AsyncStorage.getItem(UNIQUE_SETTING);
  return JSON.parse(ownInfo);
}

// jsonファイルから通知情報を取得
export async function getJsonData(props) {
  let isRet = await isExistsAsyncStorage(props);
  if (isRet) {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          let key = store[i][0];
          let value = store[i][1];
          if (key.indexOf(UNIQUE_ALERM) != -1) {
            props.addAlermItem(JSON.parse(value));
          }
        });
      });
    });
  } else {
    await AsyncStorage.clear();
    json.filter(async function(item) {
      // 通知項目情報取得
      if (item.isFree != null) {
        if (save != null) {
          item.isFree = save.isFree;
          item.reviewed = save.reviewed;
        }
        await AsyncStorage.setItem(UNIQUE_SETTING, JSON.stringify(item));
        await props.setOwnInfo(item);
      }
    });
  }
}

// jsonファイルに通知情報を追加
export async function addJsonData(alermItem) {
  json.push(alermItem);
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys, (err, stores) => {
      stores.map((result, i, store) => {
        // get at each store's key/value so you can work with it
        let key = store[i][0];
        let value = store[i][1];
        // AsyncStorage.removeItem(key);
      });
    });
  });
}

// jsonファイルから通知情報を削除
export async function deleteJsonData(index) {
  var newData = json.filter(function(item, index) {
    if (item.index != index) return true;
  });
  json = newData;
}
