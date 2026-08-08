const path = require('path');

exports.config = {
    runner: 'local',
    port: 4723,
    path: '/wd/hub',
    
    specs: [
        './test/specs/**/*.js'
    ],
    
    exclude: [],
    
    maxInstances: 1,
    
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:automationName': 'UiAutomator2',
        // In a real run, you'd specify the built .apk path here, 
        // e.g., 'appium:app': path.join(process.cwd(), '../mobile/android/app/build/outputs/apk/debug/app-debug.apk'),
        'appium:appPackage': 'com.anonymous.mobile',
        'appium:appActivity': '.MainActivity',
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240
    }],
    
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    services: ['appium'],
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
};
