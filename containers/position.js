import { getDistanceMeter, getNumTime, getTimeFromDateTime, sleep } from './utils';
import { addAsyncStorage } from './jsonFile';
import { Notifications } from 'expo';
import * as DEF from '../constants/constants';
import I18n from '../i18n/index';

// 地点までの距離が、通知距離内かのチェック
let gTimerCancel = false;
export async function notificateAlerm(alermItem, ownInfo) {
  var repeatInterval = ownInfo.repeatInterval ? ownInfo.repeatInterval * 1000 : 1000;
  var repeatCnt = ownInfo.repeatCnt ? ownInfo.repeatCnt : 1;
  let lTimerCancel = false;
  for (var step = 0; step < repeatCnt; step++) {
    if (lTimerCancel) break;
    let localNotification = {
      title: I18n.t('appTitle'),
      body: alermItem.alermMessage,
      android: {
        sound: true,
      },
      ios: {
        sound: true,
      },
      data: {
        count: step,
        message: alermItem.alermMessage,
      },
    }
    if (step == 0) {
      await Notifications.presentLocalNotificationAsync(localNotification);
    }
    else {
      let schedulingOptions = { time: (new Date()).getTime() + (repeatInterval * step) };
      await Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
    }
    sleep(repeatInterval);
    lTimerCancel = gTimerCancel;
  }
  // 最後は必ず元に戻す
  gTimerCancel = false;
};

export const stopNotification = (localNotificationId) => {
  if (localNotificationId) {
    Notifications.cancelAllScheduledNotificationsAsync(localNotificationId);
  }
  else {
    Notifications.cancelAllScheduledNotificationsAsync();
  }
  gTimerCancel = true;
}

// 地点までの距離が、通知距離内かのチェック
export const isInside = (distance, alermDistance) => {
  if (distance < alermDistance) {
    return true;
  }
  return false;
};

// 一定時間経過したかチェック
export const elapsedTime = (recoveryTime, alermTime) => {
  if (alermTime == null) {
    return true;
  }

  var diff = new Date().getTime() - alermTime;
  // 一定時間経過
  if (recoveryTime < diff / (1000 * 60)) {
    return true;
  }
  return false;
};

export const isCheckDayWeek = alermItem => {
  let isCheck = true;
  if (alermItem.isLimitWeekDay) {
    // 現在曜日を取得を取得
    var date = new Date();
    let weekDay = date.getDay();
    // 曜日指定ありかつ、対象曜日がチェックがついていない
    if (
      (weekDay == 0 && !alermItem.isSunday) ||
      (weekDay == 1 && !alermItem.isMonday) ||
      (weekDay == 2 && !alermItem.isTuesday) ||
      (weekDay == 3 && !alermItem.isWednesday) ||
      (weekDay == 4 && !alermItem.isThursday) ||
      (weekDay == 5 && !alermItem.isFriday) ||
      (weekDay == 6 && !alermItem.isSaturday)
    ) {
      isCheck = false;
    }
  }
  return isCheck;
};

export const isCheckTime = alermItem => {
  let isCheck = true;
  // 現在時刻が有効であるかのチェック
  if (alermItem.isLimitTimeZone) {
    // 現在時刻を取得
    var date = new Date();
    let nowTime = getTimeFromDateTime(date);
    let numNowTile = getNumTime(nowTime);
    let timeZoneStart = getNumTime(alermItem.timeZoneStart);
    let timeZoneEnd = getNumTime(alermItem.timeZoneEnd);
    // 時刻指定ありかつ、対象時刻内でない場合
    if (timeZoneStart < timeZoneEnd) {
      // 一般的な時間比較
      if (!(timeZoneStart <= numNowTile && numNowTile <= timeZoneEnd)) {
        // 時間外なので処理をしない
        isCheck = false;
      }
    } else if (timeZoneStart == timeZoneEnd) {
      // まあ同じ時間はないかな
      if (!(timeZoneStart == numNowTile)) {
        // 時間外なので処理をしない
        isCheck = false;
      }
    } else {
      // 終了日時の方が早いので、0時跨ぎ
      if (
        !(
          (timeZoneStart <= numNowTile && numNowTile <= 2400) ||
          (0 <= numNowTile && numNowTile <= timeZoneEnd)
        )
      ) {
        // 時間外なので処理をしない
        isCheck = false;
      }
    }
  }
  return isCheck;
};

function isCheckInside(alermItem) {
  // 有効の場合のみチェック
  if (alermItem.isAvailable) {
    // 未通知チェック
    if (!alermItem.isAlermed) {
      // 曜日チェック
      if (!isCheckDayWeek(alermItem)) return false;

      // 時間チェック
      if (!isCheckTime(alermItem)) return false;

      // 一定時間経過したかチェック
      if (!elapsedTime(DEF.RECOVERY_TIME, alermItem.alermTime)) return false;

      return true;
    }
  }
  return false;
}

// Geofence:通知するかチェック
export async function checkGeofenceInside(alermItem, ownInfo) {
  // 有効の場合のみチェック
  if (isCheckInside(alermItem)) {
    alermItem.isAlermed = true;
    alermItem.alermTime = new Date().getTime();
    addAsyncStorage(alermItem);

    // 対象範囲なので通知を行う
    await notificateAlerm(alermItem, ownInfo);
  }
  return;
}

function isCheckOutside(alermItem) {
  // 通知済みの場合だけはずす
  if (alermItem.isAlermed) {
    return true;
  }
  return false;
}

// Geofence:通知オンにするかチェック
export async function checkGeofenceOutside(alermItem) {
  // 通知済みの場合だけはずす
  if (isCheckOutside(alermItem)) {
    alermItem.isAlermed = false;
    addAsyncStorage(alermItem);
  }
}

// 登録地点が一定距離内に存在するかチェック
export async function checkPosition(ownInfo, alermList) {
  let isReturn = false;

  // 対象が通知範囲内かのチェック
  for (let alermItem of alermList) {
    // 有効の場合のみチェック
    if (alermItem.isAvailable) {
      // console.log('通知チェック！');
      let distance = getDistanceMeter(ownInfo.coords, alermItem.coords);
      let isIn = isInside(distance, alermItem.alermDistance);
      // 未通知チェック
      if (!alermItem.isAlermed) {
        if (!isIn) {
          // 範囲外なら何もしない
          continue;
        }
        // 曜日チェック
        if (!isCheckDayWeek(alermItem)) continue;

        // 時間チェック
        if (!isCheckTime(alermItem)) continue;

        // 対象範囲なので通知を行う
        await Notifications.presentLocalNotificationAsync({
          title: I18n.t('appTitle'),
          body: alermItem.alermMessage,
          sound: ownInfo.sound,
          data: {
            message: alermItem.alermMessage,
          },
        });
        alermItem.isAlermed = true;
        alermItem.alermTime = new Date().getTime();
        addAsyncStorage(alermItem);
      } else {
        // 通知済の場合
        let isOK = false;

        // 範囲外なら未通知に変更
        if (ownInfo.recoveryDistance) {
          if (isIn) {
            continue;
          } else {
            isOK = true;
          }
        }

        // 一定時間経過なら未通知に変更
        if (ownInfo.recoveryTime > 0) {
          if (!elapsedTime(ownInfo.recoveryTime, alermItem.alermTime)) {
            continue;
          } else {
            isOK = true;
          }
        }

        if (isOK) {
          alermItem.isAlermed = false;
          addAsyncStorage(alermItem);
        }
      }
    }
  }
  return;
}