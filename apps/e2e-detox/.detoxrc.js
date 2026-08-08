/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: '../mobile/android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd ../mobile/android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [
        8081,
        3005
      ]
    }
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30'
      }
    }
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  }
};
