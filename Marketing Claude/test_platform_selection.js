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
    
    // Capture page console logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.fpg-list-row');
    const rows = await page.$$('.fpg-list-row');
    
    console.log("Selecting Row 1...");
    await rows[1].click();
    await new Promise(r => setTimeout(r, 500));

    // Open Edit modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
      if (btn) btn.click();
    });

    await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
    console.log("Modal opened.");

    // Toggle LinkedIn and TikTok one by one and wait
    console.log("Clicking LinkedIn chip...");
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.pf-chip'));
      const linkedin = chips.find(c => c.textContent.includes("LinkedIn"));
      if (linkedin) linkedin.click();
    });
    await new Promise(r => setTimeout(r, 500));

    console.log("Clicking TikTok chip...");
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.pf-chip'));
      const tiktok = chips.find(c => c.textContent.includes("TikTok"));
      if (tiktok) tiktok.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Query active chips
    const activePlatforms = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.pf-chip.active')).map(el => el.textContent.trim());
    });
    console.log("Active platforms after toggle:", activePlatforms);

    // Save
    console.log("Saving post...");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === "Salva");
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

  } catch (err) {
    console.error("Error during platform selection test:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
