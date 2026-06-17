import puppeteer from 'puppeteer-core';

async function run() {
  console.log("Launching Chrome to check deployed assets...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    
    // Capture style tags and link tags content
    page.on('response', async response => {
      const respUrl = response.url();
      if (respUrl.endsWith('.css') || respUrl.includes('/assets/index-')) {
        try {
          const text = await response.text();
          if (text.includes('pfm-media-overlay')) {
            console.log(`CSS file found: ${respUrl}`);
            const hasOverlayRule = text.includes('.pfm-media-preview .pfm-media-overlay');
            const hasPersistent = text.includes('Persistent media preview overlay');
            const has3ColReels = text.includes('.fpg-grid-reels');
            console.log(`- contains '.pfm-media-preview .pfm-media-overlay': ${hasOverlayRule}`);
            console.log(`- contains 'Persistent media preview overlay': ${hasPersistent}`);
            console.log(`- contains '.fpg-grid-reels': ${has3ColReels}`);
          }
        } catch (e) {
          // ignore text reading errors
        }
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log("Page loaded.");

    // Let's also check the actual computed styles of the reels layout in the feed
    await page.waitForSelector('.fpg-grid-reels', { timeout: 5000 }).catch(() => {});
    const gridStyle = await page.evaluate(() => {
      const el = document.querySelector('.fpg-grid-reels');
      if (!el) return 'Grid Reels not found';
      const style = window.getComputedStyle(el);
      return {
        gridTemplateColumns: style.gridTemplateColumns,
        display: style.display
      };
    });
    console.log("Reels grid computed style on deployed app:", gridStyle);

  } catch (err) {
    console.error("Error checking deployed assets:", err);
  } finally {
    await browser.close();
  }
}

run();
