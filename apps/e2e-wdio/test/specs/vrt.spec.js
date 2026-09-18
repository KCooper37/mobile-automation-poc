const { Eyes, Target, Configuration, VisualGridRunner, DeviceName, ScreenOrientation } = require('@applitools/eyes-webdriverio');
const ProductsScreen = require('../pageobjects/ProductsScreen');

describe('Visual Regression Testing (Applitools)', () => {
  let eyes;
  let runner;
  
  before(async () => {
    if (!process.env.APPLITOOLS_API_KEY) return;
    // 1. Initialize the Runner (VisualGridRunner for Ultrafast Grid)
    runner = new VisualGridRunner({ testConcurrency: 5 });
    
    // 2. Initialize Eyes SDK
    eyes = new Eyes(runner);
    
    // 3. Configure Applitools
    const config = new Configuration();
    config.setApiKey(process.env.APPLITOOLS_API_KEY);
    config.setBatch({ name: 'Awesome Shop Mobile VRT' });
    
    // Cross-environment testing configuration (mocked)
    config.addDeviceEmulation(DeviceName.iPhone_11, ScreenOrientation.PORTRAIT);
    config.addDeviceEmulation(DeviceName.Pixel_5, ScreenOrientation.PORTRAIT);
    
    eyes.setConfiguration(config);
  });
  
  it('should visually validate the products screen', async function () {
    if (!process.env.APPLITOOLS_API_KEY) {
      this.skip();
    }

    await ProductsScreen.ensureLoggedIn();
    await eyes.open(driver, 'Awesome Shop', 'Products Screen');
    await eyes.check('Products Page Loaded', Target.window().fully());
    await eyes.closeAsync();
  });

  after(async () => {
    if (!process.env.APPLITOOLS_API_KEY) return;
    
    // 7. Wait for all visual grids to finish
    const results = await runner.getAllTestResults(true);
    console.log(results);
  });
});
