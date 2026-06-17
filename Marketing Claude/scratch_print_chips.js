import puppeteer from 'puppeteer-core';

async function run() {
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
    await rows[1].click();
    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
      if (btn) btn.click();
    });

    await page.waitForSelector('.pfm-wrap', { timeout: 5000 });

    const chipsText = await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('.pf-chip'));
      return chips.map(c => ({
        text: c.textContent,
        html: c.outerHTML,
        className: c.className
      }));
    });

    console.log("Chips in the modal:", chipsText);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

run();
