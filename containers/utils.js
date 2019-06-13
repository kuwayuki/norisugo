import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions'
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { _handleNotification } from './location';
import { isCheckDayWeek, isCheckTime } from './position';
import { STATUS, SETTING_APP_URL } from '../constants/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from '../i18n/index';
import {
  CL_ABAILABLE,
  CL_DISABLE,
  CL_ALERMED,
  CL_OUT_WEEK_DAY,
  CL_OUT_TIME,
} from './styles';

export const distanceMtoKm = meter => {
  var n = 2;
  let km = Math.floor((meter / 1000) * Math.pow(10, n)) / Math.pow(10, n);

  return distanceKeta(km);
};

const isOkLocationCheck = permission => {
  if (
    permission.ios.scope === 'always' ||
    permission.ios.scope === 'whenInUse'
    // (Platform.isPad && permission.ios.scope === 'whenInUse')
  ) {
    return true;
  }
  return false;
};

export async function checkOSSetting() {
  const { permissions } = await Permissions.askAsync(Permissions.LOCATION);
  const currentLocationPermission = permissions[Permissions.LOCATION];
  if (!isOkLocationCheck(currentLocationPermission)) {
    // (iOS向け) 位置情報利用の許可をユーザーに求める
    Alert.alert(I18n.t('alermError'), I18n.t('alermLocation'), [
      {
        text: 'OK',
        onPress: async () => {
          Linking.openURL(SETTING_APP_URL);
        },
      },
    ]);
    return false;
  }
  return true;
}

let isRead = false;
export async function initNotification() {
  let isOK = false;
  if (this.isRead) return;
  this.isRead = true;
  // 既存のパーミッションを取得
  const { permissions } = await Permissions.askAsync(Permissions.LOCATION);
  const currentLocationPermission = permissions[Permissions.LOCATION];

  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );

  let finalStatus = existingStatus;
  // if (Platform.OS === 'android') {
  //   const ok = await PermissionsAndroid.check(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //   );
  //   if (!ok) {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       throw new Error();
  //     }
  //   }
  // }
  // 未設定の場合
  if (finalStatus !== 'granted') {
    // 通知許可を促す
    await Alert.alert(I18n.t('setting'), I18n.t('alermNotification'), [
      {
        text: I18n.t('allowNotification'),
        onPress: async () => {
          const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
          );
          finalStatus = status;
          if (finalStatus !== 'granted') {
            // await Alert.alert(
            //   I18n.t('setting'),
            //   I18n.t('alermNotificationError'),
            //   [
            //     {
            //       text: I18n.t('goSet'),
            //       onPress: async () => {
            //         Linking.openURL(SETTING_APP_URL);
            //       },
            //     },
            //   ]
            // );
          }
        },
      },
    ]);
  }
  await Notifications.addListener(_handleNotification);
  if (!isOkLocationCheck(currentLocationPermission)) {
    // (iOS向け) 位置情報利用の許可をユーザーに求める
    await Alert.alert(I18n.t('alermError'), I18n.t('alermLocation'), [
      {
        text: 'OK',
        onPress: async () => {
          Linking.openURL(SETTING_APP_URL);
        },
      },
    ]);
    return isOK;
  }
  isOK = true;
  return isOK;
}

export const getDistance = (coords1, coords2) => {
  if (
    coords1 == null ||
    coords2 == null ||
    coords1.latitude == null ||
    coords2.latitude == null
  ) {
    return '--\nkm';
  }

  let distance = getDistanceMeter(coords1, coords2) / 1000;
  return distanceKeta(distance) + '\n' + distanceUnit(distance);
};

export const getStatusIcon = item => {
  // 通知済の場合
  if (!item.isAvailable) {
    return STATUS.DISABLE;
  }
  if (item.isAlermed) {
    return STATUS.ALERMED;
  } else {
    // 曜日指定外の場合
    if (item.isLimitWeekDay && !isCheckDayWeek(item)) {
      return STATUS.OUT_WEEK_DAY;
    }
    // 時間指定外の場合
    if (item.isLimitTimeZone && !isCheckTime(item)) {
      return STATUS.OUT_TIME;
    }

    // 通知設定
    return STATUS.AVAILABLE;
  }
};

export const getDistanceMeter = (coords1, coords2) => {
  if (coords1 == null || coords2 == null) {
    return 999999;
  }
  let lat1 = coords1.latitude;
  let lng1 = coords1.longitude;
  let lat2 = coords2.latitude;
  let lng2 = coords2.longitude;
  lat1 *= Math.PI / 180;
  lng1 *= Math.PI / 180;
  lat2 *= Math.PI / 180;
  lng2 *= Math.PI / 180;
  let distance =
    1000 *
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
      Math.sin(lat1) * Math.sin(lat2)
    );
  return distance;
};

export const distanceKeta = km => {
  if (km > 99) {
    km = 99.99;
  } else if (km < 1) {
    // 1kmいないならメートル表示
    km = km * 1000;
    km = km.toFixed(0);
  } else {
    if (String(km).indexOf('.') > 1) {
      km = km.toFixed(1);
    } else {
      km = km.toFixed(2);
    }
  }
  return km;
};

export const distanceUnit = km => {
  if (km < 1) {
    return 'm';
  }
  return 'km';
};
export const getTimeFromDateTime = dateTime => {
  let localeDateTime = dateTime.toLocaleString();
  return localeDateTime.slice(localeDateTime.indexOf(' '), -3);
};
export const getNumTime = time => {
  return Number(
    time.substr(0, time.indexOf(':')) + time.substr(time.indexOf(':') + 1)
  );
};

export const getBgColor = item => {
  return { backgroundColor: getColor(item) };
};

export const getColor = item => {
  let status = getStatusIcon(item);
  let coords2 = item.coords;
  let alermDistance = item.alermDistance;
  switch (status) {
    case STATUS.AVAILABLE:
      return CL_ABAILABLE;
    case STATUS.DISABLE:
      return CL_DISABLE;
    case STATUS.ALERMED:
      return CL_ALERMED;
    case STATUS.OUT_WEEK_DAY:
      return CL_OUT_WEEK_DAY;
    case STATUS.OUT_TIME:
      return CL_OUT_TIME;
  }
  return CL_ABAILABLE;
};
