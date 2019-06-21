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
} from '../containers/position';
import { Alert, Vibration } from 'react-native';
import { getDistanceMeter } from './utils';
import I18n from '../i18n/index';

let isChecking = false;
let alermList = null;
const LOCATION_TASK_NAME = 'background-location-task';
const GEO_TASK_NAME = 'background-geo-task';

export async function _handleNotification(notification) {
  console.log(notification);
  if (notification.origin === 'selected') {
    //バックグラウンドで通知
    // Vibration.vibrate(1, true);
    // Speech.speak(notification.data.message, { 'language ': 'ja' });
  } else if (notification.origin === 'received') {
    //フォアグラウンドで通知
    const PATTERN = [1000, 2000, 3000];
    Vibration.vibrate(PATTERN);
    Alert.alert(I18n.t('blank'), notification.data.message);
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

  if (data) {
    const { locations } = data;
    await mergeStorageDataOwnInfo(locations[0]);
    // AsyncStorageより情報取得
    alermList = await getAllStorageDataAlermList();
    let ownInfo = await getStorageDataOwnInfo();
    checkPosition(ownInfo, alermList);
    startLocation(ownInfo, alermList);
  }
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
    });
  }
}

const GEOFENCING_ON_ENTER = 'geofencingOnEnter';
TaskManager.defineTask(
  GEOFENCING_ON_ENTER,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log("You've entered:", region);
      // check `error.message` for more details.
      return;
    }
    console.log(eventType);
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
      const PATTERN = [1000];
      Vibration.vibrate(PATTERN);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region);
      const PATTERN = [1000];
      Vibration.vibrate(PATTERN);
    }
  }
);

TaskManager.defineTask(GEO_TASK_NAME, ({ data, error }) => {
  const PATTERN = [1000];
  Vibration.vibrate(PATTERN);
  console.log('GEO_TASK_NAME');
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
  }
});
// ボタンが押されたときにジオフェンスを設定する
export async function startGeofencing(position) {
  console.log('startGeofencing'); GEO_TASK_NAME
  Location.startLocationUpdatesAsync(GEO_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
  });
}
