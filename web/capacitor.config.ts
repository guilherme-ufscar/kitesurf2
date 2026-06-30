import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kite360.app',
  appName: 'KITE360º',
  webDir: 'out',
  server: {
    url: 'https://kite.codermaster.com.br',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
  },
}

export default config
