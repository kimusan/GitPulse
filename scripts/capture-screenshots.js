import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const DEFAULT_CONFIG = {
  theme: 'github-dark',
  trackedRepoIds: [101, 102, 103, 104, 105],
  visibleMetrics: {
    stars: true,
    downloads: true,
    forks: true,
    pullRequests: true,
    issues: true,
    discussions: true,
    commitVelocity: true,
    trafficViews: true,
    trafficClones: true,
    languages: true,
    topContributors: true,
    watchers: true,
  },
  autoRefresh: '1h',
  enableAnimations: false,
  compactCardView: false,
  lastSelectedRepoId: null,
  onboardingCompleted: true,
};

async function main() {
  const assetsDir = path.resolve('assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  console.log('🚀 Starting Vite preview server...');
  const server = spawn('npx', ['vite', '--port', '3456'], {
    stdio: 'pipe',
    shell: true
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const out = data.toString();
      if (out.includes('http://localhost:3456')) {
        console.log('✅ Vite server active at http://localhost:3456');
        resolve();
      }
    });
    setTimeout(resolve, 2500);
  });

  console.log('🌐 Launching headless browser for real UI capture...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();

  // 1. Desktop Dashboard Screenshot (GitHub Dark)
  console.log('📸 1. Capturing Real Desktop Dashboard (GitHub Dark)...');
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3456', { waitUntil: 'domcontentloaded' });

  // Initialize demo mode and tracked repos in LocalStorage
  await page.evaluate((config) => {
    localStorage.setItem('gitpulse_is_demo_mode', 'true');
    localStorage.setItem('gitpulse_app_config', JSON.stringify(config));
    window.location.reload();
  }, DEFAULT_CONFIG);

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(assetsDir, 'dashboard_preview.png') });
  console.log('✅ Saved authentic assets/dashboard_preview.png');

  // 2. Mobile Viewport Screenshot
  console.log('📸 2. Capturing Real Mobile Viewport (Portrait)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(assetsDir, 'mobile_preview.png') });
  console.log('✅ Saved authentic assets/mobile_preview.png');

  // 3. Retro CRT Theme Screenshot
  console.log('📸 3. Capturing Real Retro CRT Theme...');
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 2 });
  await page.evaluate((config) => {
    const crtConfig = { ...config, theme: 'retro-crt' };
    localStorage.setItem('gitpulse_app_config', JSON.stringify(crtConfig));
    window.location.reload();
  }, DEFAULT_CONFIG);

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(assetsDir, 'retro_crt_preview.png') });
  console.log('✅ Saved authentic assets/retro_crt_preview.png');

  // 4. Repository Detail Modal Screenshot
  console.log('📸 4. Capturing Real Repository Detail Modal...');
  await page.evaluate((config) => {
    const ghConfig = { ...config, theme: 'github-dark' };
    localStorage.setItem('gitpulse_app_config', JSON.stringify(ghConfig));
    window.location.reload();
  }, DEFAULT_CONFIG);

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));

  // Click the first repo card
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.group.cursor-pointer');
    if (cards.length > 0) {
      cards[0].click();
    }
  });

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(assetsDir, 'repo_detail_preview.png') });
  console.log('✅ Saved authentic assets/repo_detail_preview.png');

  await browser.close();
  server.kill();
  console.log('🎉 All authentic screenshots successfully captured and saved to assets/');
  process.exit(0);
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
