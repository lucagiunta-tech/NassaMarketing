import puppeteer from 'puppeteer-core';

async function run() {
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

    console.log("Waiting for list rows...");
    await page.waitForSelector('.fpg-list-row');

    const rowsCount = await page.evaluate(() => {
      return document.querySelectorAll('.fpg-list-row').length;
    });

    console.log(`Found ${rowsCount} rows. Logging details...`);

    for (let i = 0; i < Math.min(5, rowsCount); i++) {
      console.log(`\n--- Inspecting Row ${i} ---`);
      
      // Make sure modal is closed before clicking next row
      await page.evaluate(() => {
        // If there's an open modal overlay, close it
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
          const closeBtn = overlay.querySelector('.pfm-header button');
          if (closeBtn) {
            closeBtn.click();
          } else {
            overlay.click(); // Click backdrop
          }
        }
      });
      await new Promise(r => setTimeout(r, 500));

      // Click the row to select it
      const rows = await page.$$('.fpg-list-row');
      await rows[i].click();
      await new Promise(r => setTimeout(r, 500));

      // Click "Modifica" button
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
        if (btn) btn.click();
      });

      // Wait for modal to open
      await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
      await new Promise(r => setTimeout(r, 500)); // wait for transitions

      // Extract form values from inputs
      const formData = await page.evaluate((index) => {
        const titleInput = document.querySelector('input.pfm-title-inp');
        const title = titleInput ? titleInput.value : "";
        
        const formatBtn = document.querySelector('.pf-tab.active');
        const format = formatBtn ? formatBtn.textContent.trim() : "";
        
        const platforms = Array.from(document.querySelectorAll('.pf-chip.active')).map(el => el.textContent.trim());

        const mediaZone = document.querySelector('.pfm-media-zone');
        const hasPreview = !!mediaZone?.querySelector('.pfm-media-preview');
        const hasCarousel = !!mediaZone?.querySelector('.pfm-media-zone div[style*="aspect-ratio"]') || !!mediaZone?.querySelector('.pfm-media-zone > div > div[style*="aspect-ratio"]');
        const emptyText = mediaZone?.querySelector('.pfm-media-empty')?.textContent?.trim() || "";

        const videoSrc = mediaZone?.querySelector('video')?.getAttribute('src') || "";
        const imgSrc = mediaZone?.querySelector('img')?.getAttribute('src') || "";

        return {
          index,
          title,
          format,
          platforms,
          hasPreview,
          hasCarousel,
          emptyText,
          videoSrc,
          imgSrc
        };
      }, i);

      console.log(`Row ${i} Modal Info:`, formData);

      // Close modal using modal header close button
      await page.evaluate(() => {
        const closeBtn = document.querySelector('.pfm-header button') || document.querySelector('.modal-overlay .btn-ghost');
        if (closeBtn) closeBtn.click();
      });
      await new Promise(r => setTimeout(r, 500));
    }

  } catch (err) {
    console.error("Error printing post data:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
