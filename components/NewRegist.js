import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps'
import axios from 'axios';
import { connect } from 'react-redux';
import { addAlermItem } from '../actions/actions';
import { styles, ICON_SIZE } from '../containers/styles';
import { admobBanner } from '../containers/googleAdmob';
import { newRegistHeader } from '../containers/header';
import {
  getCurrentPosition,
} from '../containers/location';
import I18n from '../i18n/index';

const GEOCODE_ENDPOINT =
  'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

export class NewRegist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMapRead: false,
      word: '',
      searchResult: '',
      isSearch: false,
      markers: [
        {
          title: I18n.t('alermPoint'),
          latlng: {
            latitude: props.ownInfo.coords.latitude,
            longitude: props.ownInfo.coords.longitude,
          },
        },
      ],
    };
  }

  async componentWillMount() {
    let region = this.props.ownInfo.coords;
    if (region == null || region.latitude == null || region.longitude == null) {
      region = await getCurrentPosition();
    }
    region.latitudeDelta = 0.05;
    region.longitudeDelta = 0.05;
    this.setState({ region, isMapRead: true })
  }

  initPlace() {
    this.setState({
      word: '',
      isSearch: false,
      region: {
        latitude: this.props.ownInfo.coords.latitude,
        longitude: this.props.ownInfo.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      markers: [
        {
          title: I18n.t('alermPoint'),
          latlng: {
            latitude: this.props.ownInfo.coords.latitude,
            longitude: this.props.ownInfo.coords.longitude,
          },
        },
      ],
    });
  }
  handleGetLatAndLng() {
    if (this.state.word.length == 0) {
      this.setState({
        isSearch: false,
      });
      return;
    }
    let option = {
      language: I18n.t('locale'),
      location:
        this.props.ownInfo.coords.latitude +
        ',' +
        this.props.ownInfo.coords.longitude,
      radius: 50000,
      type: 'transit_station',
      name: this.state.word,
      keyword: this.state.word,
      key: 'AIzaSyARtoLl2mHUxeBJfh40wax-k1crkR6ymo0',
    };
    axios
      .get(GEOCODE_ENDPOINT, { params: option })
      .then(results => {
        // 以下のGoogle API のレスポンスの例を元に欲しいデータを取得
        const data = results.data;
        const result = data.results[0];
        const location = result.geometry.location;
        if (data.results != null || data.results.length > 0) {
          this.setState({
            isSearch: true,
            searchResult: data.results.length + I18n.t('searchSuccessMessage'),
            alermList: data.results,
          });
          this.listSelect(data.results[0]);
          // キーボード非表示
          Keyboard.dismiss();
        } else {
          alert(I18n.t('searchErrorMessage'));
          this.setState({
            isSearch: false,
          });
        }
      })
      .catch(() => {
        alert(I18n.t('searchErrorMessage'));
        this.setState({
          isSearch: false,
        });
      });
  }

  listSelect = item => {
    let coords = {
      latitude: item.geometry.location.lat,
      longitude: item.geometry.location.lng,
    };
    this.markerSetting(coords, item.name);
    this.regionSetting(coords);
  };

  regionSetting = position => {
    let region = this.state.region;
    region.latitude = position.latitude;
    region.longitude = position.longitude;
    this.setState({
      region,
    });
  };
  markerSetting = (position, name) => {
    const marker_copy = this.state.markers.slice();
    marker_copy[0].latlng = position;
    marker_copy[0].title = name;
    this.setState({
      markers: marker_copy,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {newRegistHeader(this.state, this.props)}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.word}>
            <MaterialIcons
              name="search"
              size={ICON_SIZE}
              style={styles.wordIcon}
            />
            <TextInput
              inlineImagePadding={10}
              style={styles.wordInput}
              autoFocus={false}
              enablesReturnKeyAutomatically={true}
              onChangeText={word => this.setState({ word })}
              value={this.state.word}
              onSubmitEditing={() => this.handleGetLatAndLng()}
            />
            <Button
              style={styles.wordButton}
              title={I18n.t('search')}
              onPress={() => this.handleGetLatAndLng()}
            />
            <Button
              style={styles.wordButton}
              buttonStyle={styles.bgColorRed}
              title={I18n.t('searchInit')}
              onPress={() => this.initPlace()}
            />
          </View>
        </TouchableWithoutFeedback>
        {this.state.isSearch && (
          <View style={styles.searchListView}>
            <Text style={styles.sectionHeader}>
              {I18n.t('searchResult') + this.state.searchResult}
            </Text>
            <ScrollView>
              <FlatList
                data={this.state.alermList}
                extraData={this.state.alermList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.ListRow}
                    onPress={() => this.listSelect(item)}>
                    <FontAwesome
                      name="map-pin"
                      color="red"
                      size={ICON_SIZE}
                      style={styles.icon}
                    />
                    <View style={styles.itemNew}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemDis} numberOfLines={1}>
                        {item.vicinity}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        )}
        {this.state.isMapRead && <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={styles.container}
          onPoiClick={e => {
            this.regionSetting(e.nativeEvent.coordinate);
            this.markerSetting(e.nativeEvent.coordinate, e.nativeEvent.name);
          }}
          onRegionChangeComplete={region => this.setState({ region })}
          region={{
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
            latitudeDelta: this.state.region.latitudeDelta,
            longitudeDelta: this.state.region.longitudeDelta,
          }}>
          {this.state.markers != null && this.state.markers.map(marker => (
            marker.latlng != null &&
            marker.latlng.latitude != null &&
            <MapView.Marker
              key={marker.toString()}
              value={marker}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>}
        {this.props.ownInfo.isFree && admobBanner()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return state;
};
const mapDispatchToProps = {
  addAlermItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewRegist);
