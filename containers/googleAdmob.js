import React from 'react';
import {
  StoreReview,
  Linking,
} from 'expo';
import { AdMobInterstitial, AdMobBanner, PublisherBanner } from 'expo-ads-admob'
import { Alert } from 'react-native';
import I18n from '../i18n/index';
import * as json from './jsonFile';

export const BANNER = 'ca-app-pub-2103807205659646/2958032499';
const INTERSTITIAL = 'ca-app-pub-2103807205659646/1954946162';
const MAX_NUM = 5;
const ADMOB_IN_DISABLE = true;// TODO:

export const random = () => {
  return Math.floor(Math.random() * Math.floor(MAX_NUM));
};

export const admobBanner = () => {
  return <AdMobBanner bannerSize="smartBannerPortrait" adUnitID={BANNER} />;
};

export async function admobInterstitialInit() {
  if (ADMOB_IN_DISABLE) return;
  AdMobInterstitial.setAdUnitID(INTERSTITIAL);
  AdMobInterstitial.requestAdAsync();
}

export async function admobInter() {
  if (ADMOB_IN_DISABLE) return;
  if (AdMobInterstitial.getIsReadyAsync()) {
    await AdMobInterstitial.showAdAsync();
  }
}

export async function admobInterstitial() {
  if (ADMOB_IN_DISABLE) return;
  let randomNum = random();
  if (randomNum == 0) {
    await admobInter;
  }
}

export async function admobInterstitialNumCount(count, total) {
  if (ADMOB_IN_DISABLE) return;
  if (count == null || total == null || count >= total) {
    await admobInter;
  }
}

async function storeDetailReview() {
  Alert.alert(I18n.t('reviewTitle'), I18n.t('reviewQuestion'), [
    {
      text: 'OK',
      onPress: async () => {
        const url = StoreReview.storeUrl();
        Linking.openURL(url);
      },
    },
    {
      text: 'Cancel',
    },
  ]);
}

export const storeReview = props => {
  if (props.ownInfo.reviewed) return;
  if (StoreReview.isSupported()) {
    Alert.alert(I18n.t('reviewTitle'), I18n.t('reviewQuestion'), [
      {
        text: 'OK',
        onPress: async () => {
          await StoreReview.requestReview();
          props.setOwnInfoReviewed(true);
          await json.mergeStorageDataOwnInfo({ reviewed: true });
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }
};
