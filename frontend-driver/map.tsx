import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

const windowHeight = Dimensions.get('window').height;
const WEBVIEW_ORIGIN = 'http://192.168.1.6:3000'; // Vite app
const API_HOST = 'https://bd01-223-185-132-109.ngrok-free.app '; // API server

const INJECTED_JS = `
  (function() {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      let url = typeof input === 'string' ? input : input.url;
      if (url.includes('localhost:5000')) {
        url = url.replace(/localhost:5000/g, '${API_HOST.replace(/\\/g, '\\\\')}');
      }
      if (!(typeof input === 'string')) {
        input = new Request(url, input);
      } else {
        input = url;
      }
      return originalFetch(input, init);
    };
  })();
  true;
`;

const Map = () => {
  const webviewRef = useRef(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Add native input fields here if needed */}
      <View style={{ height: windowHeight }}>
        <WebView
          ref={webviewRef}
          source={{ uri: WEBVIEW_ORIGIN, headers: { 'ngrok-skip-browser-warning': '69420' } }}
          originWhitelist={['*']}
          injectedJavaScriptBeforeContentLoaded={INJECTED_JS}
          startInLoadingState
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
