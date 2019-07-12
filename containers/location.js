import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import {
  getAllStorageDataAlermList,
} from '../containers/jsonFile';
import {
  checkGeofenceInside,
  checkGeofenceOutside,
} from '../containers/position';
import { Alert, Vibration } from 'react-native';
import I18n from '../i18n/index';

export async function _handleNotification(notification) {
  if (notification.origin === 'selected') {
    //バックグラウンドで通知
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

const GEO_TASK_NAME = 'background-geo-task';
TaskManager.defineTask(GEO_TASK_NAME, async ({ data: { eventType, region }, error }) => {
  if (error) {
    return;
  }

  let alermList = await getAllStorageDataAlermList();
  let targetALermList = alermList.map(alermItem => {
    if (alermItem.coords.latitude == region.latitude &&
      alermItem.coords.longitude == region.longitude &&
      alermItem.alermDistance == region.radius
    ) {
      return alermItem;
    }
  });
  for (let alermItem of targetALermList) {
    if (eventType === Location.GeofencingEventType.Enter) {
      checkGeofenceInside(alermItem);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      checkGeofenceOutside(alermItem);
    }
  }
});

// ジオフェンスMode
export async function startGeofencing(alermList) {
  let regions = alermList.map((alermItem) => {
    return {
      latitude: alermItem.coords.latitude,
      longitude: alermItem.coords.longitude,
      radius: alermItem.alermDistance,
      notifyOnEnter: true,
      notifyOnExit: true,
    };
  });
  await Location.startGeofencingAsync(GEO_TASK_NAME, regions);
}

// ジオフェンスMode
export async function stopAllGeofencing() {
  Location.stopGeofencingAsync(GEO_TASK_NAME);
}