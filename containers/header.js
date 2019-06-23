import React, { Component } from 'react';
import { Header } from 'react-native-elements';
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DEF from '../constants/constants';
import * as json from '../containers/jsonFile';
import {
  getNumTime,
  getTimeFromDateTime,
  checkOSSetting,
} from '../containers/utils';
import { storeReview } from '../containers/googleAdmob';
import { CL_HEADER, CL_ICON_HEADER, RIDE_ICON_HEADER } from './styles';
import I18n from '../i18n/index';

const ICON_SIZE = 30;
const FONT_SIZE = 18;

export async function settingBtn(props) {
  if (!(await checkOSSetting())) {
    return;
  }
  props.navigation.navigate('Setting');
}

export async function newRegistBtn(props) {
  if (!(await checkOSSetting())) {
    return;
  }
  let count = props.alermList.length;
  let maxCount = props.ownInfo.reviewed ? 1 : 0;

  if (props.ownInfo.isFree) {
    maxCount += DEF.MAX_TRIAL;
  } else {
    maxCount += DEF.MAX_OFFICAL;
  }
  if (count >= maxCount) {
    if (props.ownInfo.isFree) {
      Alert.alert(
        I18n.t('blank'),
        I18n.t('freeAlert1') + maxCount + I18n.t('freeAlert2'),
        [
          {
            text: 'OK',
            onPress: async () => {
              storeReview(props);
            },
          },
        ]
      );
    } else {
      Alert.alert(I18n.t('blank'), maxCount + I18n.t('freeAlert2'), [
        {
          text: 'OK',
          onPress: async () => {
            storeReview(props);
          },
        },
      ]);
    }
  } else {
    props.navigation.navigate('NewRegist');
  }
}

const settingUpdate = (state, props) => {
  let ownInfo = {};
  Object.assign(ownInfo, props.ownInfo);
  let performance = 0;
  if (!state.performanceSelect) {
    performance = state.performance + 1;
  }
  ownInfo.performance = performance;
  ownInfo.distance = state.distance;
  ownInfo.sound = state.sound;
  let recoveryTime = 0;
  if (state.recoveryTime) {
    recoveryTime = DEF.RECOVERY_TIME;
  }
  ownInfo.recoveryTime = recoveryTime;
  ownInfo.recoveryDistance = state.recoveryDistance;
  ownInfo.isNearestDisplay = state.isNearestDisplay;
  ownInfo.sortKind = state.sortKind;
  ownInfo.sortType = state.sortType;
  json.setStorageDataOwnInfo(ownInfo);
  props.setOwnInfoSetting(ownInfo);
  props.navigation.navigate('Top');
};

async function newMarkerClick(state, props) {
  let item = {};
  let INITIAL_ITEM = {
    index: 0,
    title: I18n.t('alermPoint'),
    isAvailable: true,
    isAlermed: false,
    alermTime: null,
    alermMessage: I18n.t('alermPoint') + I18n.t('arrivedNear'),
    alermDistance: 750,
    interval: 'auto',
    coords: { latitude: null, longitude: null },
    isLimitTimeZone: false,
    timeZoneStart: '12:00',
    timeZoneEnd: '12:00',
    isLimitWeekDay: true,
    isMonday: true,
    isTuesday: true,
    isWednesday: true,
    isThursday: true,
    isFriday: true,
    isSaturday: true,
    isSunday: true,
  };
  Object.assign(item, INITIAL_ITEM);
  let markers = state.markers.slice();
  item.index = await json.getSetIndex();
  item.title = markers[0].title;
  item.coords = markers[0].latlng;
  var date = new Date();
  let nowTime = getTimeFromDateTime(date);
  let numNowTime = getNumTime(nowTime);
  let startTime = 0;
  let endTime = 0;
  if (numNowTime >= 200) {
    startTime = numNowTime - 200;
  } else {
    startTime = 2400 + numNowTime - 200;
  }

  if (numNowTime < 2200) {
    endTime = numNowTime + 200;
  } else {
    endTime = numNowTime + 200 - 2400;
  }
  let hourLen;
  if (String(startTime).length > 2) {
    hourLen = String(startTime).substr(0, String(startTime).length - 2);
  } else {
    hourLen = '0';
  }
  item.timeZoneStart = hourLen + ':00';

  if (String(endTime).length > 2) {
    hourLen = String(endTime).substr(0, String(endTime).length - 2);
  } else {
    hourLen = '0';
  }
  item.timeZoneEnd = hourLen + ':00';
  props.addAlermItem(item);
  json.addAsyncStorage(item);
  props.navigation.navigate('Top');
}

async function editMarkerClick(state, props, listIndex) {
  let item = {};
  Object.assign(item, props.alermList[listIndex]);
  let markers = state.markers.slice();
  item.title = state.title;
  item.alermMessage = state.title + I18n.t('arrivedNear');
  item.isAlermed = false;
  item.alermDistance = Number(state.alermDistance);
  item.isLimitTimeZone = state.isLimitTimeZone;
  item.timeZoneStart = state.timeZoneStart;
  item.timeZoneEnd = state.timeZoneEnd;
  item.isLimitWeekDay = state.isLimitWeekDay;
  item.isMonday = state.isMonday;
  item.isTuesday = state.isTuesday;
  item.isWednesday = state.isWednesday;
  item.isThursday = state.isThursday;
  item.isFriday = state.isFriday;
  item.isSaturday = state.isSaturday;
  item.isSunday = state.isSunday;
  item.coords = markers[0].latlng;
  props.setAlermItem(item);
  json.addAsyncStorage(item);
  props.navigation.navigate('Top');
}
const headerIcon = (props, name) => {
  return (
    <MaterialIcons
      name={name}
      size={ICON_SIZE}
      color={CL_ICON_HEADER}
      onPress={() => {
        if (name == 'settings') {
          return settingBtn(props);
        } else if (name == 'add') {
          return newRegistBtn(props);
        } else if (name == 'arrow-back') {
          return props.navigation.navigate('Top');
        }
      }}
    />
  );
};

const rideIcon = speed => {
  let homeIcon = 'airline-seat-recline-normal';
  let type = 'material';
  if (speed < 0.2) {
    // 停滞・維持レベル(目的地までの距離)
    homeIcon = 'airline-seat-recline-normal';
  } else if (speed < 1.5) {
    homeIcon = 'directions-walk';
  } else if (speed < 5) {
    // 徒歩レベル(目的地までの距離)
    homeIcon = 'directions-run';
  } else if (speed < 13) {
    // バス・車レベル(目的地までの距離と通知距離に反比例)
    homeIcon = 'directions-bus';
  } else {
    // 電車レベル(目的地までの距離と通知距離に反比例)
    homeIcon = 'train';
  }
  return (
    <MaterialIcons name={homeIcon} size={ICON_SIZE} color={RIDE_ICON_HEADER} />
  );
};

export const topHeader = props => {
  return (
    <Header
      leftComponent={headerIcon(props, 'settings')}
      centerComponent={
        DEF.DISPLAY_HEADER_ICON && rideIcon(props.ownInfo.coords.speed)
      }
      rightComponent={headerIcon(props, 'add')}
      containerStyle={{
        backgroundColor: CL_HEADER,
        justifyContent: 'space-around',
        borderBottomWidth: 0,
      }}
    />
  );
};

export const newRegistHeader = (state, props) => {
  return (
    <Header
      leftComponent={headerIcon(props, 'arrow-back')}
      centerComponent={{
        text: I18n.t('newRegist'),
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
      }}
      rightComponent={{
        text: I18n.t('decision'),
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
        onPress: () => newMarkerClick(state, props),
      }}
      containerStyle={{
        backgroundColor: CL_HEADER,
        justifyContent: 'space-around',
        borderBottomWidth: 0,
      }}
    />
  );
};

export const editRegistHeader = (state, props, listIndex) => {
  return (
    <Header
      leftComponent={headerIcon(props, 'arrow-back')}
      centerComponent={{
        text: props.alermList[listIndex].title,
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
      }}
      rightComponent={{
        text: I18n.t('decision'),
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
        onPress: () => editMarkerClick(state, props, listIndex),
      }}
      containerStyle={{
        backgroundColor: CL_HEADER,
        justifyContent: 'space-around',
        borderBottomWidth: 0,
      }}
    />
  );
};

export const settingHeader = (state, props) => {
  return (
    <Header
      leftComponent={headerIcon(props, 'arrow-back')}
      centerComponent={{
        text: I18n.t('setting'),
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
      }}
      rightComponent={{
        text: I18n.t('update'),
        style: { color: CL_ICON_HEADER, fontSize: FONT_SIZE },
        underlayColor: CL_HEADER,
        onPress: () => settingUpdate(state, props),
      }}
      containerStyle={{
        backgroundColor: CL_HEADER,
        justifyContent: 'space-around',
        borderBottomWidth: 0,
      }}
    />
  );
};
