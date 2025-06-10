import Layout from '@/layout/Layout'
import '@/styles/globals.css'
import { Provider } from 'react-redux';
import store from '@/redux/store'; // Redux store'unuzu içe aktarın

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
