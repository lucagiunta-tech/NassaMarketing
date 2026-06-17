// c:\Users\Akash\OneDrive\Desktop\New folder\Antigravity\NassaMarketing\Marketing Claude\inspect_overlay.js
import puppeteer from 'puppeteer-core';

async function run() {
  console.log("Launching Chrome to inspect elements...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.fpg-list-row');
    const rows = await page.$$('.fpg-list-row');

    let targetRow = null;
    for (const row of rows) {
      const text = await page.evaluate(el => el.textContent, row);
      if (text.includes("03. Mandorle di Avola")) {
        targetRow = row;
        break;
      }
    }

    if (targetRow) {
      await targetRow.click();
      await page.waitForFunction(() => {
        return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes("Modifica"));
      });
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
        if (btn) btn.click();
      });

      await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
      console.log("Modal opened.");

      const zone = await page.$('.pfm-media-zone');
      if (zone) {
        const zoneDims = await page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        }, zone);
        console.log("pfm-media-zone dimensions:", zoneDims);
      }

      const previewContainer = await page.$('.pfm-media-preview');
      if (previewContainer) {
        const previewDims = await page.evaluate(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return { 
            width: rect.width, 
            height: rect.height,
            minHeight: style.minHeight,
            maxHeight: style.maxHeight,
            display: style.display,
            position: style.position,
            overflow: style.overflow
          };
        }, previewContainer);
        console.log("pfm-media-preview computed styles and dimensions:", previewDims);

        const img = await previewContainer.$('img');
        if (img) {
          const imgDims = await page.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return { width: rect.width, height: rect.height, naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight };
          }, img);
          console.log("img dimensions:", imgDims);
        }

        const overlay = await previewContainer.$('.pfm-media-overlay');
        if (overlay) {
          const overlayDims = await page.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
          }, overlay);
          console.log("pfm-media-overlay bounding rect dimensions:", overlayDims);
        }
      }
    }
  } catch (err) {
    console.error("Error inspecting:", err);
  } finally {
    await browser.close();
  }
}

run();
