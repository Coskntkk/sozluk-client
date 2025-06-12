import Layout from '@/layout/Layout'
import '@/styles/globals.css'
import { Provider } from 'react-redux';
import store from '@/redux/store'; // Redux store'unuzu içe aktarın
// import { appWithTranslation } from 'next-i18next'
// import nextI18NextConfig from '../next-i18next.config'
import '../utils/i18n';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

// export default appWithTranslation(App, nextI18NextConfig)