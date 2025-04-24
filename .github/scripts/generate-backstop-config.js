const fs = require('fs');

const [,, configPath] = process.argv;
if (!configPath) throw new Error('No config path provided');

const input = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const viewports = {
  desktop: { label: 'desktop', width: 1920, height: 1080 },
  tablet: { label: 'tablet', width: 768, height: 1024 },
  mobile: { label: 'mobile', width: 375, height: 667 },
};

const scenario = {
  label: input.selector || 'Full Page',
  url: input.url1,
  referenceUrl: input.url2 || undefined,
  selectors: input.selector ? [input.selector] : ['document'],
  misMatchThreshold: 0.1,
  requireSameDimensions: true
};

const config = {
  id: 'backstop_test',
  viewports: [viewports[input.device] || viewports.desktop],
  scenarios: [scenario],
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report'
  },
  report: ['browser'],
  engine: 'puppeteer',
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false
};

fs.writeFileSync('backstop.generated.config.js', `module.exports = ${JSON.stringify(config, null, 2)};`);
console.log('BackstopJS config generated successfully.');
