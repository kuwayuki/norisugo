import * as React from 'react';
import { View } from 'react-native';
import { styles } from './containers/styles';
import { Asset } from 'expo-asset';
import { AppLoading } from 'expo';
import { createStore } from 'redux';
import Top from './components/Top';
import NewRegist from './components/NewRegist';
import EditRegist from './components/EditRegist';
import Setting from './components/Setting';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers/index';
import I18n from './i18n/index';

export const store = createStore(rootReducer);

const Stack = createStackNavigator(
  {
    Top: {
      screen: Top,
      navigationOptions: {
        header: null,
        headerBackTitleVisible: false,
        // title: 'Home',
      },
    },
    NewRegist: {
      screen: NewRegist,
      navigationOptions: {
        // title: '新規登録',
      },
    },
    EditRegist: {
      screen: EditRegist,
      navigationOptions: {},
    },
    Setting: {
      screen: Setting,
      navigationOptions: {
        // title: '新規登録',
      },
    },
  },
  {
    initialRouteName: 'Top',
    headerMode: 'none',
  }
);
const AppContainer = createAppContainer(Stack);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }
  static navigationOptions = {
    title: 'Welcome',
  };
  async componentWillMount() {
    await this.loadAssetsAsync();
  }
  loadAssetsAsync = async () => {
    try {
      await I18n.initAsync();
    } catch (e) {
      // console.log(e.message)
    } finally {
      // this.setState({ isAssetsLoaded: true });
    }
  };
  async _cacheResourcesAsync() {
    const images = [require('./assets/snack-icon.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppContainer />
        </View>
      </Provider>
    );
  }
}
