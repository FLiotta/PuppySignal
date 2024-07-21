declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAPS_API_KEY: string
    GOOGLE_SIGN_IN_WEB_CLIENT_ID: string
    API_URL: string
    FOUND_QR_PATH: string
  }

  export const Config: NativeConfig
  export default Config
}
