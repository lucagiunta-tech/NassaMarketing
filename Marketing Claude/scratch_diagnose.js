import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = "C:\\Users\\Akash\\.gemini\\antigravity\\brain\\53ef667c-1824-4c0e-97fc-fc8cd0f2ca85";

async function run() {
  console.log("Launching Chrome...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    const url = "https://nassa-marketing-edw5.vercel.app/project/demo-radenza-cal/ed/contenuti/feed";
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log("Waiting for list rows...");
    await page.waitForSelector('.fpg-list-row', { timeout: 10000 });

    // Extract all rows info
    const rowsInfo = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.fpg-list-row'));
      return rows.map((r, i) => {
        const titleEl = r.querySelector('.fpg-list-title') || r.querySelector('div') || r;
        const text = r.textContent || "";
        const typeIcon = r.querySelector('.fpg-type-icon') || r.querySelector('span') || null;
        return {
          index: i,
          text: text.trim(),
          title: titleEl ? titleEl.textContent.trim() : "",
          typeIcon: typeIcon ? typeIcon.textContent.trim() : ""
        };
      });
    });

    console.log("Found rows:", rowsInfo);

    const targets = [
      { type: "post", keyword: "Mandorle" },
      { type: "carousel", keyword: "carosello" },
      { type: "reel", keyword: "reel" }
    ];

    for (const target of targets) {
      let foundRow = null;
      let matchedInfo = null;
      
      // Let's find a row that matches the keyword or typeIcon
      for (const info of rowsInfo) {
        const textLower = info.text.toLowerCase();
        if (target.type === "carousel" && (textLower.includes("carousel") || textLower.includes("carosello") || info.typeIcon.includes("🖼️"))) {
          foundRow = info;
          matchedInfo = info;
          break;
        }
        if (target.type === "reel" && (textLower.includes("reel") || info.typeIcon.includes("🎬"))) {
          foundRow = info;
          matchedInfo = info;
          break;
        }
        if (target.type === "post" && (textLower.includes(target.keyword.toLowerCase()) || info.typeIcon.includes("📄"))) {
          foundRow = info;
          matchedInfo = info;
          break;
        }
      }

      if (foundRow) {
        console.log(`\n--- Processing target type: ${target.type} (matched: "${matchedInfo.text}") ---`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.fpg-list-row');

        const rowElements = await page.$$('.fpg-list-row');
        await rowElements[foundRow.index].click();
        console.log(`Clicked row ${foundRow.index}`);

        await page.waitForFunction(() => {
          return Array.from(document.querySelectorAll('button')).some(b => b.textContent.includes("Modifica"));
        }, { timeout: 5000 });

        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("Modifica"));
          if (btn) btn.click();
        });

        await page.waitForSelector('.pfm-wrap', { timeout: 5000 });
        console.log("Modal opened.");

        // Wait a short bit for media to render
        await new Promise(r => setTimeout(r, 2000));

        const diagnostics = await page.evaluate(() => {
          const zone = document.querySelector('.pfm-media-zone');
          if (!zone) return { hasZone: false };

          const zoneStyle = window.getComputedStyle(zone);
          const zoneRect = zone.getBoundingClientRect();

          const preview = zone.querySelector('.pfm-media-preview');
          const previewStyle = preview ? window.getComputedStyle(preview) : null;
          const previewRect = preview ? preview.getBoundingClientRect() : null;

          const overlay = zone.querySelector('.pfm-media-overlay');
          const overlayStyle = overlay ? window.getComputedStyle(overlay) : null;
          const overlayRect = overlay ? overlay.getBoundingClientRect() : null;

          const image = zone.querySelector('img');
          const imageStyle = image ? window.getComputedStyle(image) : null;
          const imageRect = image ? image.getBoundingClientRect() : null;

          const video = zone.querySelector('video');
          const videoStyle = video ? window.getComputedStyle(video) : null;
          const videoRect = video ? video.getBoundingClientRect() : null;

          const innerCarousel = zone.querySelector('div > div[style*="aspect-ratio"]');
          const innerCarouselStyle = innerCarousel ? window.getComputedStyle(innerCarousel) : null;
          const innerCarouselRect = innerCarousel ? innerCarousel.getBoundingClientRect() : null;

          return {
            hasZone: true,
            zone: {
              className: zone.className,
              width: zoneRect.width,
              height: zoneRect.height,
              minHeight: zoneStyle.minHeight,
              display: zoneStyle.display,
              position: zoneStyle.position
            },
            preview: preview ? {
              className: preview.className,
              width: previewRect.width,
              height: previewRect.height,
              display: previewStyle.display,
              position: previewStyle.position,
              overflow: previewStyle.overflow,
              minHeight: previewStyle.minHeight,
              maxHeight: previewStyle.maxHeight
            } : null,
            overlay: overlay ? {
              className: overlay.className,
              width: overlayRect.width,
              height: overlayRect.height,
              opacity: overlayStyle.opacity,
              visibility: overlayStyle.visibility,
              display: overlayStyle.display,
              position: overlayStyle.position,
              top: overlayStyle.top,
              bottom: overlayStyle.bottom,
              zIndex: overlayStyle.zIndex,
              background: overlayStyle.background
            } : null,
            image: image ? {
              width: imageRect.width,
              height: imageRect.height,
              display: imageStyle.display,
              position: imageStyle.position,
              objectFit: imageStyle.objectFit,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight
            } : null,
            video: video ? {
              width: videoRect.width,
              height: videoRect.height,
              display: videoStyle.display,
              objectFit: videoStyle.objectFit
            } : null,
            innerCarousel: innerCarousel ? {
              width: innerCarouselRect.width,
              height: innerCarouselRect.height,
              display: innerCarouselStyle.display,
              position: innerCarouselStyle.position
            } : null,
            htmlStructure: zone.innerHTML.substring(0, 1000)
          };
        });

        console.log(`Diagnostics for ${target.type}:`, JSON.stringify(diagnostics, null, 2));

        const element = await page.$('.pfm-wrap');
        if (element) {
          const screenshotPath = path.join(ARTIFACT_DIR, `modal_${target.type}.png`);
          await element.screenshot({ path: screenshotPath });
          console.log(`Saved screenshot to ${screenshotPath}`);
        }

        // Close modal
        await page.evaluate(() => {
          const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Annulla') || b.textContent.includes('Chiudi') || b.className.includes('close'));
          if (closeBtn) closeBtn.click();
        });
        await new Promise(r => setTimeout(r, 1000));
      } else {
        console.log(`Could not find any row matching type: ${target.type}`);
      }
    }

  } catch (err) {
    console.error("Error running diagnostics:", err);
  } finally {
    await browser.close();
    console.log("Browser closed.");
  }
}

run();
