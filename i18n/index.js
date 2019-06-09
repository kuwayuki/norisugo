import I18n from 'ex-react-native-i18n'
import en from './locales/en'
import ja from './locales/ja'

I18n.fallbacks = true

I18n.translations = {
  en,
  ja
}

export default I18n