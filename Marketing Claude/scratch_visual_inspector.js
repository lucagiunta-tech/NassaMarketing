import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = "C:\\Users\\Akash\\.gemini\\antigravity\\brain\\53ef667c-1824-4c0e-97fc-fc8cd0f2ca85";

async function run() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: { width: 1400, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log("Waiting for list rows...");
    await page.waitForSelector('.fpg-list-row', { timeout: 10000 });

    // Screenshot 1: Default Grid View
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'view_1_grid.png') });
    console.log("Saved view_1_grid.png");

    // Click "Reels" tab
    console.log("Clicking Reels tab...");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Reels"));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Get Reels Grid styles
    const reelsGridStyle = await page.evaluate(() => {
      const el = document.querySelector('.fpg-grid-reels');
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap
      };
    });
    console.log("Reels grid style:", reelsGridStyle);

    // Screenshot 2: Reels View
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'view_2_reels.png') });
    console.log("Saved view_2_reels.png");

    // Click "Storie" tab
    console.log("Clicking Storie tab...");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Storie") || b.textContent.includes("Stories"));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 3: Stories View
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'view_3_stories.png') });
    console.log("Saved view_3_stories.png");

    // Now switch back to Grid and open the first post modal
    console.log("Switching back to Grid and opening post modal...");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Grid"));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Click the first row to select it
    const rows = await page.$$('.fpg-list-row');
    await rows[0].click();
    await new Promise(r => setTimeout(r, 500));

    // Click "Modifica" button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
      if (btn) btn.click();
    });

    await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
    console.log("Modifica modal opened.");

    // Screenshot 4: Modal Opened
    const modalEl = await page.$('.pfm-wrap');
    if (modalEl) {
      await modalEl.screenshot({ path: path.join(ARTIFACT_DIR, 'view_4_modal_default.png') });
      console.log("Saved view_4_modal_default.png");
    }

    // Let's query elements inside modal
    const modalState = await page.evaluate(() => {
      const title = document.querySelector('.pfm-head-title')?.textContent || "";
      const selectFormat = document.querySelector('select.inp[value]') || document.querySelector('select');
      const formatValue = selectFormat ? selectFormat.value : "unknown";
      
      const platforms = Array.from(document.querySelectorAll('.pfm-piat-btn.active')).map(el => el.textContent.trim());
      
      return { title, formatValue, platforms };
    });
    console.log("Modal state:", modalState);

  } catch (err) {
    console.error("Error inspecting visual layout:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
