import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = "C:\\Users\\Akash\\.gemini\\antigravity\\brain\\53ef667c-1824-4c0e-97fc-fc8cd0f2ca85";

async function run() {
  const dummyImgPath = path.resolve("test_dummy.png");
  fs.writeFileSync(dummyImgPath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"));

  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Auto-accept dialogs (like alerts)
    page.on('dialog', async dialog => {
      console.log(`Alert Dialog encountered: [${dialog.type()}] "${dialog.message()}". Dismissing...`);
      await dialog.dismiss();
    });

    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.fpg-list-row');
    const rows = await page.$$('.fpg-list-row');
    
    // Find row index for 05. Reminder
    let targetIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      const text = await page.evaluate(el => el.textContent, rows[i]);
      if (text.includes("05. Reminder")) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) {
      console.error("05. Reminder row not found!");
      return;
    }

    await rows[targetIdx].click();
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
      if (btn) btn.click();
    });

    await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
    
    const fileInput = await page.$('input[type="file"]');
    await fileInput.uploadFile(dummyImgPath);
    await new Promise(r => setTimeout(r, 5000)); // wait for upload

    const coords = await page.evaluate(() => {
      const preview = document.querySelector('.pfm-media-preview');
      const overlay = document.querySelector('.pfm-media-overlay');
      const img = preview?.querySelector('img');

      if (!preview) return { err: "No preview element" };

      const pRect = preview.getBoundingClientRect();
      const oRect = overlay ? overlay.getBoundingClientRect() : null;
      const iRect = img ? img.getBoundingClientRect() : null;

      const pStyle = window.getComputedStyle(preview);
      const oStyle = overlay ? window.getComputedStyle(overlay) : null;
      const iStyle = img ? window.getComputedStyle(img) : null;

      return {
        preview: {
          rect: { top: pRect.top, bottom: pRect.bottom, left: pRect.left, right: pRect.right, width: pRect.width, height: pRect.height },
          position: pStyle.position,
          zIndex: pStyle.zIndex,
          overflow: pStyle.overflow,
          display: pStyle.display,
          opacity: pStyle.opacity,
          visibility: pStyle.visibility
        },
        overlay: overlay ? {
          rect: { top: oRect.top, bottom: oRect.bottom, left: oRect.left, right: oRect.right, width: oRect.width, height: oRect.height },
          position: oStyle.position,
          zIndex: oStyle.zIndex,
          opacity: oStyle.opacity,
          visibility: oStyle.visibility,
          background: oStyle.background,
          topStyle: oStyle.top,
          bottomStyle: oStyle.bottom
        } : null,
        img: img ? {
          rect: { top: iRect.top, bottom: iRect.bottom, left: iRect.left, right: iRect.right, width: iRect.width, height: iRect.height },
          position: iStyle.position,
          zIndex: iStyle.zIndex,
          display: iStyle.display
        } : null
      };
    });

    console.log("Layout coordinates and styles:", JSON.stringify(coords, null, 2));

  } catch (e) {
    console.error("Error running overlay check:", e);
  } finally {
    await browser.close();
    try { fs.unlinkSync(dummyImgPath); } catch {}
  }
}

run();
