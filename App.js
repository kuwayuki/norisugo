import * as React from 'react';
import { Text, View, Button, AppRegistry } from 'react-native';
import { Constants } from 'expo';
import { styles } from './containers/styles';
import { createStore } from 'redux';
import Top from './components/Top';
import NewRegist from './components/NewRegist';
import EditRegist from './components/EditRegist';
import Setting from './components/Setting';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers/index';
import I18n from './i18n/index';
// Remove this once Sentry is correctly setup.
import Sentry from 'sentry-expo';
Sentry.enableInExpoDevelopment = true;
Sentry.config('https://d71129879b7648e3a0db2324e094d522@sentry.io/1482364').install();

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
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <AppContainer />
        </View>
      </Provider>
    );
  }
}
