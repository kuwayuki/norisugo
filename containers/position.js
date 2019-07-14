import { getNumTime, getTimeFromDateTime } from './utils';
import { addAsyncStorage } from './jsonFile';
import { Notifications } from 'expo';
import I18n from '../i18n/index';

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
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

      return true;
    }
  }
  return false;
}

// Geofence:通知するかチェック
export async function checkGeofenceInside(alermItem) {
  // 有効の場合のみチェック
  if (isCheckInside(alermItem)) {
    alermItem.isAlermed = true;
    alermItem.alermTime = new Date().getTime();
    addAsyncStorage(alermItem);
    // 対象範囲なので通知を行う
    Notifications.presentLocalNotificationAsync({
      title: I18n.t('appTitle'),
      body: alermItem.alermMessage,
      sound: true,
      data: {
        message: alermItem.alermMessage,
      },
    });
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