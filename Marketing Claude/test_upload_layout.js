import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = "C:\\Users\\Akash\\.gemini\\antigravity\\brain\\53ef667c-1824-4c0e-97fc-fc8cd0f2ca85";

async function run() {
  console.log("Creating a dummy image file for test...");
  const dummyImgPath = path.resolve("test_dummy.png");
  // Simple 1x1 transparent PNG or just random bytes that look like a JPEG
  fs.writeFileSync(dummyImgPath, Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"));

  console.log("Launching Chrome...");
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
    
    // Find "05. Reminder" row
    const rows = await page.$$('.fpg-list-row');
    let targetIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      const text = await page.evaluate(el => el.textContent, rows[i]);
      if (text.includes("05. Reminder")) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx === -1) {
      console.error("Could not find post '05. Reminder'!");
      return;
    }

    console.log(`Clicking row ${targetIdx}...`);
    await rows[targetIdx].click();
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
      if (btn) btn.click();
    });

    await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
    console.log("Modal opened.");

    // Find input type=file and upload our dummy file
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      console.log("Uploading test file...");
      await fileInput.uploadFile(dummyImgPath);
      
      // Wait for upload spinner to disappear
      console.log("Waiting for upload to complete...");
      await new Promise(r => setTimeout(r, 5000)); // wait for Dropbox upload

      // Check if preview zone has updated
      const mediaZoneDetails = await page.evaluate(() => {
        const zone = document.querySelector('.pfm-media-zone');
        const preview = zone?.querySelector('.pfm-media-preview');
        const overlay = zone?.querySelector('.pfm-media-overlay');
        const img = zone?.querySelector('img');
        const buttons = Array.from(overlay?.querySelectorAll('button') || []).map(b => ({
          text: b.textContent.trim(),
          width: b.getBoundingClientRect().width,
          height: b.getBoundingClientRect().height
        }));

        return {
          hasPreview: !!preview,
          hasOverlay: !!overlay,
          imgSrc: img ? img.getAttribute('src') : "",
          overlayOpacity: overlay ? window.getComputedStyle(overlay).opacity : "",
          overlayVisibility: overlay ? window.getComputedStyle(overlay).visibility : "",
          buttons
        };
      });

      console.log("Media zone details after upload:", mediaZoneDetails);

      const modalEl = await page.$('.pfm-wrap');
      if (modalEl) {
        await modalEl.screenshot({ path: path.join(ARTIFACT_DIR, 'modal_after_upload_post.png') });
        console.log("Saved screenshot modal_after_upload_post.png");
      }
    } else {
      console.error("File input not found!");
    }

  } catch (err) {
    console.error("Error during upload layout test:", err);
  } finally {
    await browser.close();
    // clean up dummy file
    try { fs.unlinkSync(dummyImgPath); } catch {}
    console.log("Browser closed.");
  }
}

run();
