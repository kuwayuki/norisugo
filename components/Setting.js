import * as React from 'react';
import { Text, Switch, View, Alert, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import {
  setOwnInfo,
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
} from '../actions/actions';
import { Button, ButtonGroup } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import AppLink from 'react-native-app-link';
import * as json from '../containers/jsonFile';
import { styles } from '../containers/styles';
import { getCurrentPosition } from '../containers/location';
import { settingHeader } from '../containers/header';
import { admobInterstitial } from '../containers/googleAdmob';
import { APP_STORE_ID, PLAY_STORE_ID, GEOFENCE_ON, APP_URL, ICON_BTN_SIZE } from '../constants/constants';
import I18n from '../i18n/index';

let nearest = true; // TODO:
export class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisplay: false,
      isFree: this.props.ownInfo.isFree,
      performanceSelect: props.ownInfo.performance == 0,
      performance:
        props.ownInfo.performance == 0 ? -1 : props.ownInfo.performance - 1,
      distance: props.ownInfo.distance,
      sound: props.ownInfo.sound,
      recoveryTime: props.ownInfo.recoveryTime > 0,
      recoveryDistance: props.ownInfo.recoveryDistance,
      isNearestDisplay: props.ownInfo.isNearestDisplay,
      sortKind: props.ownInfo.sortKind,
      sortType: props.ownInfo.sortType,
    };
  }

  async componentDidMount() {
    if (this.state.isFree) {
      await admobInterstitial();
    }
  }

  buyStore() {
    let config = { appStoreId: APP_STORE_ID, appStoreLocale: I18n.t('locale'), playStoreId: PLAY_STORE_ID }
    AppLink.openInStore(config)
      .then(() => {
        // do stuff
      })
      .catch(err => {
        // handle error
      });
  }

  shareApp(type) {
    let baseUrl = "https://timeline.line.me/social-plugin/share?url=";
    switch (type) {
      case 0:
        // Line
        baseUrl = "https://timeline.line.me/social-plugin/share?url=";
        break;
      case 1:
        // facebook
        baseUrl = "http://www.facebook.com/sharer.php?u=";
        break;
      case 2:
        // twitter
        baseUrl = "http://twitter.com/share?url=";
        break;
    }
    Linking.openURL(baseUrl + APP_URL);
  }

  SORT_KIND = [I18n.t('sortRegist'), I18n.t('sortDistance')];
  PERFORMANCE_KIND = [
    I18n.t('lowest'),
    I18n.t('low'),
    I18n.t('balanced'),
    I18n.t('high'),
    I18n.t('highest'),
    I18n.t('best'),
  ];

  clearSetting() {
    Alert.alert(I18n.t('initialize'), I18n.t('initializeQuestion'), [
      {
        text: 'OK',
        onPress: async () => {
          this.props.clearStore();
          const position = await getCurrentPosition();
          this.props.setOwnInfoCoords(position.coords);
          Alert.alert(I18n.t('initialize'), I18n.t('initializeOK'), [
            {
              text: 'OK',
              onPress: async () => {
                await json.clearAsyncStorage();
                // 設定済情報取得
                await json.getJsonData(this.props);
                this.props.navigation.navigate('Top');
              },
            },
          ]);
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  }

  getDesDitance = index => {
    let text = I18n.t('getLocationDesChoice');
    switch (index) {
      case 0:
        text = I18n.t('getLocationDesChoiceLowest');
        break;
      case 1:
        text = I18n.t('getLocationDesChoiceLow');
        break;
      case 2:
        text = I18n.t('getLocationDesChoiceBalanced');
        break;
      case 3:
        text = I18n.t('getLocationDesChoiceHigh');
        break;
      case 4:
        text = I18n.t('getLocationDesChoicehigHest');
        break;
      case 5:
        text = I18n.t('getLocationDesChoicehigBest');
        break;
    }
    return text;
  };
  render() {
    const recoveryRender = () => {
      return (<View>
        <Text style={styles.sectionHeader}>{I18n.t('recovery')}</Text>
        <Text style={styles.sectionHeader2}>{I18n.t('recoveryTime')}</Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.recoveryTime ? I18n.t('on') : I18n.t('off')}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={recoveryTime => this.setState({ recoveryTime })}
            value={this.state.recoveryTime}
          />
        </View>
        {this.state.recoveryTime && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>{I18n.t('recoveryTimeDes')}</Text>
          </View>
        )}
        <Text style={styles.sectionHeader2}>
          {I18n.t('recoveryDistance')}
        </Text>
        <View style={styles.rowTextSetting}>
          <Text style={styles.text}>
            {this.state.recoveryDistance ? I18n.t('on') : I18n.t('off')}
          </Text>
          <Switch
            style={styles.setting}
            onValueChange={recoveryDistance =>
              this.setState({ recoveryDistance })
            }
            value={this.state.recoveryDistance}
          />
        </View>
        {this.state.recoveryDistance && (
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>
              {I18n.t('recoveryDistanceDes')}
            </Text>
          </View>
        )}
      </View>);
    }

    return (
      <View style={styles.container}>
        {settingHeader(this.state, this.props)}
        <ScrollView>
          {this.state.isDisplay && (
            <View>
              <Text style={styles.sectionHeader}>{I18n.t('getLocation')}</Text>
              <View style={styles.rowTextSetting}>
                <Text style={styles.text}>
                  {this.state.performanceSelect
                    ? I18n.t('auto')
                    : I18n.t('choice')}
                </Text>
                <Switch
                  style={styles.setting}
                  onValueChange={performanceSelect =>
                    this.setState({ performanceSelect })
                  }
                  value={this.state.performanceSelect}
                />
              </View>
              {!this.state.performanceSelect && (
                <View style={styles.bgColorWhite}>
                  <ButtonGroup
                    onPress={performance => this.setState({ performance })}
                    selectedButtonStyle={styles.bgColorSelected}
                    buttons={this.PERFORMANCE_KIND}
                    selectedIndex={this.state.performance}
                  />
                </View>
              )}
              <View style={styles.rowTextSetting}>
                <Text style={styles.textDes}>
                  {!this.state.performanceSelect
                    ? this.getDesDitance(this.state.performance)
                    : I18n.t('getLocationDesAuto')}
                </Text>
              </View>
            </View>
          )}
          <Text style={styles.sectionHeader}>{I18n.t('sort')}</Text>
          <View style={styles.bgColorWhite}>
            <ButtonGroup
              onPress={sortKind => this.setState({ sortKind })}
              selectedButtonStyle={styles.bgColorSelected}
              buttons={this.SORT_KIND}
              selectedIndex={this.state.sortKind}
            />
          </View>
          <View style={styles.rowBottonSetting}>
            <Text style={styles.text}>
              {this.state.sortType
                ? I18n.t('sortNormal')
                : I18n.t('sortReverse')}
            </Text>
            <Switch
              style={styles.setting}
              onValueChange={sortType => this.setState({ sortType })}
              value={this.state.sortType}
            />
          </View>
          {this.state.isDisplay && (
            <View>
              <Text style={styles.sectionHeader}>{I18n.t('sound')}</Text>
              <View style={styles.rowTextSetting}>
                <Text style={styles.text}>
                  {this.state.sound ? I18n.t('on') : I18n.t('off')}
                </Text>
                <Switch
                  style={styles.setting}
                  onValueChange={sound => this.setState({ sound })}
                  value={this.state.sound}
                />
              </View>
            </View>
          )}
          <Text style={styles.sectionHeader}>
            {I18n.t('isNearestDisplay')}
          </Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>
              {this.state.isNearestDisplay ? I18n.t('on') : I18n.t('off')}
            </Text>
            <Switch
              style={styles.setting}
              onValueChange={isNearestDisplay =>
                this.setState({ isNearestDisplay })
              }
              value={this.state.isNearestDisplay}
            />
          </View>
          {!GEOFENCE_ON && recoveryRender()}
          <Text style={styles.sectionHeader}>{I18n.t('other')}</Text>
          {this.state.isFree && (
            <View style={styles.rowTextSetting}>
              <Text style={styles.text}>{I18n.t('payDes')}</Text>
              <Button
                style={styles.button}
                title={I18n.t('pay')}
                onPress={() => this.buyStore()}
              />
            </View>
          )}
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>{I18n.t('shareSNS')}</Text>
            <FontAwesome5 name="line" size={ICON_BTN_SIZE} color="#1dcd00" style={styles.buttonIcon} onPress={() => this.shareApp(0)} />
            <FontAwesome5 name="facebook" size={ICON_BTN_SIZE} color="#3B5998" style={styles.buttonIcon} onPress={() => this.shareApp(1)} />
            <FontAwesome5 name="twitter-square" size={ICON_BTN_SIZE} color="#55acee" style={styles.buttonIcon} onPress={() => this.shareApp(2)} />
          </View>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>{I18n.t('initializeDes')}</Text>
            <Button
              style={styles.button}
              buttonStyle={styles.bgColorRed}
              title={I18n.t('initialize')}
              onPress={() => this.clearSetting()}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setOwnInfo,
  setOwnInfoSetting,
  setOwnInfoCoords,
  clearStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting);
