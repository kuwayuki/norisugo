import * as React from 'react';
import {
  Text,
  Switch,
  TextInput,
  View,
  ScrollView,
  SectionList,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { styles, CHECK_SIZE } from '../containers/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { setAlermItem } from '../actions/actions';
import { DISTANCE_KIND, DISTANCE_KIND_METER } from '../constants/constants';
import * as utils from '../containers/utils';
import { editRegistHeader } from '../containers/header';
import { admobInterstitial } from '../containers/googleAdmob';
import I18n from '../i18n/index';

let listIndex = 0;
let selectTimer = 0; // 0:start / 1:end

const getListIndex = props => {
  let index = 0;
  for (let alermItem of props.alermList) {
    if (alermItem.index === props.ownInfo.selectedIndex) {
      return index;
    }
    index++;
  }
};

const getSelectedDistanceIndex = alermDistance => {
  let index = 0;
  for (let meter of DISTANCE_KIND_METER) {
    if (meter == alermDistance) {
      return index;
    }
    index++;
  }
  return 9;
};

export class EditRegist extends React.Component {
  constructor(props) {
    super(props);
    listIndex = getListIndex(props);
    let alermItem = props.alermList[listIndex];
    let selectIndex = getSelectedDistanceIndex(alermItem.alermDistance);
    let region = alermItem.coords;
    region.latitudeDelta = 0.00003 * alermItem.alermDistance;
    region.longitudeDelta = 0.00003 * alermItem.alermDistance;
    this.state = {
      region,
      isSelectedDistance: selectIndex != 9,
      selectedDistanceIndex: selectIndex,
      title: alermItem.title,
      isAvailable: alermItem.isAvailable,
      isAlermed: alermItem.isAlermed,
      alermMessage: alermItem.alermMessage,
      alermDistance: String(alermItem.alermDistance),
      interval: alermItem.interval,
      isLimitTimeZone: alermItem.isLimitTimeZone,
      localTimeZoneStart: alermItem.timeZoneStart,
      localTimeZoneEnd: alermItem.timeZoneEnd,
      timeZoneStart: alermItem.timeZoneStart,
      timeZoneEnd: alermItem.timeZoneEnd,
      isLimitWeekDay: alermItem.isLimitWeekDay,
      isMonday: alermItem.isMonday,
      isTuesday: alermItem.isTuesday,
      isWednesday: alermItem.isWednesday,
      isThursday: alermItem.isThursday,
      isFriday: alermItem.isFriday,
      isSaturday: alermItem.isSaturday,
      isSunday: alermItem.isSunday,
      markers: [
        {
          title: alermItem.title,
          latlng: {
            latitude: alermItem.coords.latitude,
            longitude: alermItem.coords.longitude,
          },
        },
      ],
    };
  }

  async componentDidMount() {
    if (this.props.ownInfo.isFree) {
      await admobInterstitial();
    }
  }

  //
  selectedDistanceClick = selectedDistanceIndex => {
    this.setState({ selectedDistanceIndex });
    let selectMeter = 1000;
    switch (selectedDistanceIndex) {
      case 0:
        selectMeter = DISTANCE_KIND_METER[0];
        break;
      case 1:
        selectMeter = DISTANCE_KIND_METER[1];
        break;
      case 2:
        selectMeter = DISTANCE_KIND_METER[2];
        break;
      case 3:
        selectMeter = DISTANCE_KIND_METER[3];
        break;
      case 4:
        selectMeter = DISTANCE_KIND_METER[4];
        break;
      case 5:
        selectMeter = DISTANCE_KIND_METER[5];
        break;
      case 6:
        selectMeter = DISTANCE_KIND_METER[6];
        break;
    }
    let region = this.state.region;
    region.latitudeDelta = 0.00003 * selectMeter;
    region.longitudeDelta = 0.00003 * selectMeter;

    this.setState({ alermDistance: String(selectMeter), region });
  };

  markerSetting = e => {
    const position = e.nativeEvent.coordinate;
    const marker_copy = this.state.markers.slice();
    const region = this.state.region;
    region.latitude = position.latitude;
    region.longitude = position.longitude;
    marker_copy[0].latlng = position;
    marker_copy[0].title = e.nativeEvent.name;
    this.setState({
      title: e.nativeEvent.name,
      markers: marker_copy,
      region,
    });
  };

  _showDateTimePicker = target => {
    selectTimer = target;
    this.setState({ isDateTimePickerVisible: true });
  };

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = time => {
    if (selectTimer == 0) {
      this.setState({ timeZoneStart: utils.getTimeFromDateTime(time) });
    } else {
      this.setState({ timeZoneEnd: utils.getTimeFromDateTime(time) });
    }
    this._hideDateTimePicker();
  };

  setDate = newDate => {
    if (selectTimer == 0) {
      this.setState({ localTimeZoneStart: utils.getTimeFromDateTime(newDate) });
    } else {
      this.setState({ localTimeZoneEnd: utils.getTimeFromDateTime(newDate) });
    }
  };

  WEEK_DAY = [
    I18n.t('monday'),
    I18n.t('tuesday'),
    I18n.t('wednesday'),
    I18n.t('thursday'),
    I18n.t('friday'),
    I18n.t('saturday'),
    I18n.t('sunday'),
  ];

  render() {
    const checkBoxContainer = (index, stateWeekDay) => {
      return (
        <View>
          <Text style={styles.checkBoxText}>{this.WEEK_DAY[index]}</Text>
          <MaterialCommunityIcons
            style={styles.checkBox}
            name={
              stateWeekDay
                ? 'checkbox-marked-outline'
                : 'checkbox-blank-outline'
            }
            size={CHECK_SIZE}
            onPress={() => {
              switch (index) {
                case 0:
                  return this.setState({ isMonday: !stateWeekDay });
                case 1:
                  return this.setState({ isTuesday: !stateWeekDay });
                case 2:
                  return this.setState({ isWednesday: !stateWeekDay });
                case 3:
                  return this.setState({ isThursday: !stateWeekDay });
                case 4:
                  return this.setState({ isFriday: !stateWeekDay });
                case 5:
                  return this.setState({ isSaturday: !stateWeekDay });
                case 6:
                  return this.setState({ isSunday: !stateWeekDay });
              }
            }}
          />
        </View>
      );
    };
    return (
      <View style={styles.container}>
        {editRegistHeader(this.state, this.props, listIndex)}
        <ScrollView>
          <SectionList
            sections={[
              {
                title: I18n.t('editTitle'),
                data: [this.state.title],
              },
            ]}
            renderItem={({ item }) => (
              <TextInput
                style={styles.item}
                onChangeText={title => this.setState({ title })}
                value={item}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            keyExtractor={(item, index) => index}
          />
          <MapView
            provider={MapView.PROVIDER_GOOGLE}
            style={styles.map}
            onPoiClick={e => this.markerSetting(e)}
            onRegionChangeComplete={region => this.setState({ region })}
            region={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            }}>
            {this.state.markers.map(marker => (
              <MapView.Marker
                key={marker.toString()}
                value={marker}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
              />
            ))}
            <MapView.Circle
              center={{
                latitude: this.state.markers[0].latlng.latitude,
                longitude: this.state.markers[0].latlng.longitude,
              }}
              radius={Number(this.state.alermDistance)}
              strokeWidth={1}
              strokeColor="darkviolet"
              fillColor={'rgba(148,0,211,0.1)'}
            />
          </MapView>
          <Text style={styles.sectionHeader}>
            {I18n.t('editAlermDistance')}
          </Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>
              {this.state.isSelectedDistance
                ? I18n.t('editChoiceInput')
                : I18n.t('editManualInput')}
            </Text>
            <Switch
              style={styles.setting}
              onValueChange={isSelectedDistance =>
                this.setState({ isSelectedDistance })
              }
              value={this.state.isSelectedDistance}
            />
          </View>
          {this.state.isSelectedDistance ? (
            <View style={styles.bgColorWhite}>
              <ButtonGroup
                onPress={this.selectedDistanceClick}
                selectedButtonStyle={styles.bgColorSelected}
                buttons={DISTANCE_KIND}
                selectedIndex={this.state.selectedDistanceIndex}
              />
            </View>
          ) : (
              <View style={styles.rowTextSetting}>
                <TextInput
                  style={styles.textNum}
                  keyboardType={'number-pad'}
                  onChangeText={alermDistance => {
                    let region = this.state.region;
                    region.latitudeDelta = 0.00003 * alermDistance;
                    region.longitudeDelta = 0.00003 * alermDistance;
                    this.setState({ alermDistance, region });
                  }}
                  value={this.state.alermDistance}
                />
                <Text>{I18n.t('meter')}</Text>
              </View>
            )}
          <View style={styles.rowTextSetting}>
            <Text style={styles.textDes}>{I18n.t('distanceDes')}</Text>
          </View>
          <Text style={styles.sectionHeader}>{I18n.t('editAlermWeekDay')}</Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>{I18n.t('editChoiceWeekDay')}</Text>
            <Switch
              style={styles.setting}
              onValueChange={isLimitWeekDay =>
                this.setState({ isLimitWeekDay })
              }
              value={this.state.isLimitWeekDay}
            />
          </View>
          {this.state.isLimitWeekDay && (
            <View style={styles.rowStyle}>
              {checkBoxContainer(0, this.state.isMonday)}
              {checkBoxContainer(1, this.state.isTuesday)}
              {checkBoxContainer(2, this.state.isWednesday)}
              {checkBoxContainer(3, this.state.isThursday)}
              {checkBoxContainer(4, this.state.isFriday)}
              {checkBoxContainer(5, this.state.isSaturday)}
              {checkBoxContainer(6, this.state.isSunday)}
            </View>
          )}
          <DateTimePicker
            mode={'time'}
            date={
              selectTimer == 0
                ? new Date('2019/03/10 ' + this.state.localTimeZoneStart)
                : new Date('2019/03/10 ' + this.state.localTimeZoneEnd)
            }
            titleIOS={
              selectTimer == 0
                ? I18n.t('editAlermTimeZone') + I18n.t('start')
                : I18n.t('editAlermTimeZone') + I18n.t('end')
            }
            confirmTextIOS={'OK'}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            onDateChange={this.setDate}
          />
          <Text style={styles.sectionHeader}>
            {I18n.t('editAlermTimeZone')}
          </Text>
          <View style={styles.rowTextSetting}>
            <Text style={styles.text}>{I18n.t('editAlermTimeChoice')}</Text>
            <Switch
              style={styles.setting}
              onValueChange={isLimitTimeZone =>
                this.setState({ isLimitTimeZone })
              }
              value={this.state.isLimitTimeZone}
            />
          </View>
          {this.state.isLimitTimeZone && (
            <View style={styles.rowStyle}>
              <Text
                style={styles.timeZone}
                onPress={() => this._showDateTimePicker(0)}>
                {this.state.timeZoneStart}
              </Text>
              <Text>～</Text>
              <Text
                style={styles.timeZone}
                onPress={() => this._showDateTimePicker(1)}>
                {this.state.timeZoneEnd}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  setAlermItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditRegist);
