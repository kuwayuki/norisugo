import {
  Speech,
} from 'expo';
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import {
  mergeStorageDataOwnInfo,
  getStorageDataOwnInfo,
  getAllStorageDataAlermList,
} from '../containers/jsonFile';
import {
  checkPosition,
  isCheckTime,
  isCheckDayWeek,
  checkGeofenceInside,
  checkGeofenceOutside,
} from '../containers/position';
import { Alert, Vibration } from 'react-native';
import { getDistanceMeter } from './utils';
import I18n from '../i18n/index';

let isChecking = false;
let alermList = null;
const LOCATION_TASK_NAME = 'background-location-task';

export async function _handleNotification(notification) {
  if (notification.origin === 'selected') {
    //バックグラウンドで通知
  } else if (notification.origin === 'received') {
    if (isChecking) {
      //フォアグラウンドで通知
      const PATTERN = [1000, 2000, 3000];
      Vibration.vibrate(PATTERN);
      Alert.alert(I18n.t('blank'), notification.data.message);
    }
  }
}

export async function getCurrentPosition() {
  let position = await Location.getCurrentPositionAsync({});
  return position;
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (isChecking) return;
  isChecking = true;

  if (data) {
    const { locations } = data;
    await mergeStorageDataOwnInfo(locations[0]);
    // AsyncStorageより情報取得
    alermList = await getAllStorageDataAlermList();
    let ownInfo = await getStorageDataOwnInfo();
    checkPosition(ownInfo, alermList);
    startLocation(ownInfo, alermList);
  }
  isChecking = false;
});

async function getBestPerformance(ownCoords, alermList) {
  let accuracy = Location.Accuracy.Lowest;
  let alermDistance = 100000;
  let pointDistance = 0;
  let hasMap = false;
  for (let alermItem of alermList) {
    // １．有効かつ、２．未通知かつ、３．曜日有効かつ、４．時刻有効の場合のみチェック
    if (
      alermItem.isAvailable &&
      !alermItem.isAlermed &&
      isCheckDayWeek(alermItem) &&
      isCheckTime(alermItem)
    ) {
      // 残り通知距離を取得
      let localDis =
        getDistanceMeter(ownCoords, alermItem.coords) - alermItem.alermDistance;
      hasMap = true;
      // 最小値を取得
      if (alermDistance > localDis) {
        // 目的地の通知地点までの距離
        pointDistance = localDis;
        // 一番近い目的地の通知距離
        alermDistance = alermItem.alermDistance;
      }
    }
  }
  if (!hasMap) {
    return { accuracy: Location.Accuracy.Lowest, distance: 1000 };
  } else if (pointDistance > 5000) {
    return { accuracy: Location.Accuracy.Balanced, distance: 1000 };
  }

  let index = 1;
  if (ownCoords.speed < 1) {
    // 停滞・維持レベル(目的地までの距離)
    index = 0.3;
  } else if (ownCoords.speed < 10) {
    // 徒歩レベル(目的地までの距離)
    index = 1;
  } else if (ownCoords.speed < 30) {
    // 電車・車レベル(目的地までの距離と通知距離に反比例)
    index = 2;
  } else {
    // 新幹線レベル
    index = 3;
  }

  if (pointDistance < 10 * index) {
    accuracy = Location.Accuracy.Highest;
  } else if (pointDistance < 100 * index) {
    // 10m範囲
    accuracy = Location.Accuracy.High;
  } else if (pointDistance < 1000 * index) {
    // 100m範囲
    accuracy = Location.Accuracy.Balanced;
  } else if (pointDistance < 3000 * index) {
    // 1000m範囲
    accuracy = Location.Accuracy.Low;
  } else {
    // 3000m範囲
    accuracy = Location.Accuracy.Lowest;
  }
  // 目的地周辺の場合は再取得距離を短くする
  if (pointDistance < 1.5 * alermDistance * index) {
    alermDistance = alermDistance / 20;
  } else if (pointDistance < 2 * alermDistance * index) {
    alermDistance = alermDistance / 10;
  } else if (pointDistance < 3 * alermDistance * index) {
    alermDistance = alermDistance / 5;
  }
  return { accuracy: accuracy, distance: alermDistance };
}

let beforeSetting = null;
export const clearBefore = () => {
  beforeSetting = null;
};
export async function startLocation(ownInfo, alermList) {
  if (beforeSetting != null && !isChecking) return;
  let accuracy = Location.Accuracy.Balanced;
  let distanceInterval = 10;
  if (ownInfo != null) {
    // 自動設定の場合
    if (ownInfo.performance == 0) {
      if (alermList != null && alermList.length > 0) {
        // 自動取得設定
        let retPer = await getBestPerformance(ownInfo.coords, alermList);
        accuracy = retPer.accuracy;
        distanceInterval = retPer.distance;
      } else {
        // await TaskManager.unregisterAllTasksAsync();
        return;
      }
    } else {
      // 手動設定の場合はそのまま設定
      accuracy = ownInfo.performance;
      // distanceInterval = ownInfo.distance;
    }
  }
  let nextSetting = { accuracy: accuracy, distance: distanceInterval };
  if (ownInfo.debug) {
    console.log(nextSetting);
  }
  if (
    beforeSetting == null ||
    (beforeSetting.accuracy != nextSetting.accuracy ||
      beforeSetting.distance != nextSetting.distance)
  ) {
    if (ownInfo.debug) {
      console.log('change');
    }
    beforeSetting = nextSetting;
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: accuracy,
      distanceInterval: distanceInterval,
      pausesUpdatesAutomatically: true
    });
  }
}

const GEO_TASK_NAME = 'background-geo-task_';
const No0 = 0;
const No1 = 1;
const No2 = 2;
const No3 = 3;
const No4 = 4;
const No5 = 5;
const No6 = 6;
const No7 = 7;
const No8 = 8;
const No9 = 9;
const No10 = 10;
const MAX = No10;
TaskManager.defineTask(GEO_TASK_NAME + No0, ({ data: { eventType, region }, error }) => {
  taskManager(No0, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No1, ({ data: { eventType, region }, error }) => {
  taskManager(No1, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No2, ({ data: { eventType, region }, error }) => {
  taskManager(No2, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No3, ({ data: { eventType, region }, error }) => {
  taskManager(No3, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No4, ({ data: { eventType, region }, error }) => {
  taskManager(No4, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No5, ({ data: { eventType, region }, error }) => {
  taskManager(No5, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No6, ({ data: { eventType, region }, error }) => {
  taskManager(No6, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No7, ({ data: { eventType, region }, error }) => {
  taskManager(No7, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No8, ({ data: { eventType, region }, error }) => {
  taskManager(No8, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No9, ({ data: { eventType, region }, error }) => {
  taskManager(No9, { data: { eventType, region }, error });
});
TaskManager.defineTask(GEO_TASK_NAME + No10, ({ data: { eventType, region }, error }) => {
  taskManager(No10, { data: { eventType, region }, error });
});

export async function taskManager(index, { data: { eventType, region }, error }) {
  if (error) {
    console.error(error.message);
    return;
  }
  // AsyncStorageより情報取得
  alermList = await getAllStorageDataAlermList();
  if (eventType === Location.GeofencingEventType.Enter) {
    // 内に入ったら通知処理を行う
    checkGeofenceInside(alermList[index]);
  } else if (eventType === Location.GeofencingEventType.Exit) {
    // 外に出たら通知を有効にする
    let ownInfo = await getStorageDataOwnInfo();
    checkGeofenceOutside(alermList[index], ownInfo);
  }
}

// ジオフェンスMode
export async function startGeofencing(alermList) {
  stopAllGeofencing(alermList.length);
  let index = 0;
  for (let alermItem of alermList) {
    Location.startGeofencingAsync(GEO_TASK_NAME + index, [{
      latitude: alermItem.coords.latitude,
      longitude: alermItem.coords.latitude,
      radius: alermItem.alermDistance,
      notifyOnEnter: true,
      notifyOnExit: true,
    }]);
    index++;
  }
}

// ジオフェンスMode
export async function stopGeofencing(index) {
  Location.stopGeofencingAsync(GEO_TASK_NAME + index);
}

// ジオフェンスMode
export async function stopAllGeofencing(index) {
  for (let i = index; i < MAX + 1; i++) {
    Location.stopGeofencingAsync(GEO_TASK_NAME + i);
  }
}