const puppeteer = require('puppeteer-core');
const fs = require('fs');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const browserPath = fs.existsSync(EDGE) ? EDGE : fs.existsSync(CHROME) ? CHROME : null;

if (!browserPath) {
  console.log('NO_BROWSER');
  process.exit(2);
}

console.log('Browser:', browserPath);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(60000);

  const errors = [];
  const logs = [];

  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('Navigating to http://localhost:8081/');
  await page.goto('http://localhost:8081/', { waitUntil: 'networkidle0', timeout: 120000 });

  await sleep(8000);

  const initialText = await page.evaluate(() => document.body.innerText);
  console.log('--- PAGE TEXT ---');
  console.log(initialText || '(empty)');
  console.log('--- END PAGE TEXT ---');

  console.log('=== BROWSER CONSOLE LOGS ===');
  for (const log of logs) {
    console.log('[ ' + log.type.toUpperCase() + ' ] ' + log.text);
  }

  console.log('=== BROWSER ERRORS ===');
  for (const err of errors) {
    console.log('[ERROR] ' + err);
  }

  const hasFlashcards = initialText.includes('Flashcards');
  const hasShowAnswer = initialText.includes('Show Answer');
  const hasCardCounter = initialText.includes('Card 1 of');

  console.log('=== ASSERTIONS ===');
  console.log((hasFlashcards ? 'PASS' : 'FAIL') + ': Flashcards title');
  console.log((hasShowAnswer ? 'PASS' : 'FAIL') + ': Show Answer button');
  console.log((hasCardCounter ? 'PASS' : 'FAIL') + ': Card 1 of counter');

  let ok = hasFlashcards && hasShowAnswer && hasCardCounter;

  if (!ok) {
    console.log('=== LIMITATION ===');
    console.log('App fails to render on web');
    process.exit(ok ? 0 : 1);
  }

  const clickButton = async (text) => {
    return await page.evaluate((t) => {
      const buttons = Array.from(document.querySelectorAll('button, [role="button"], a'));
      const btn = buttons.find(b => b.textContent.trim() === t || b.textContent.includes(t));
      if (btn) {
        btn.click();
        return { clicked: true, tag: btn.tagName, text: btn.textContent.trim() };
      }
      const all = Array.from(document.querySelectorAll('*'));
      const el = all.find(e => e.textContent.trim() === t);
      if (el) {
        el.click();
        return { clicked: true, tag: el.tagName, text: el.textContent.trim() };
      }
      return { clicked: false };
    }, text);
  };

  console.log('=== INTERACTION: Show Answer ===');
  try {
    const showAnswerResult = await clickButton('Show Answer');
    console.log('Clicked:', showAnswerResult.tag, showAnswerResult.text);
    if (showAnswerResult.clicked) {
      await sleep(800);
      const afterShow = await page.evaluate(() => document.body.innerText);
      const toggledToHide = afterShow.includes('Hide Answer');
      console.log((toggledToHide ? 'PASS' : 'FAIL') + ': Toggles to Hide Answer');
      ok = ok && toggledToHide;
    } else {
      console.log('FAIL: Show Answer button not found');
      ok = false;
    }
  } catch (e) {
    console.log('FAIL:', e.message);
    ok = false;
  }

  console.log('=== INTERACTION: Next ===');
  try {
    const nextResult = await clickButton('Next');
    console.log('Clicked:', nextResult.tag, nextResult.text);
    if (nextResult.clicked) {
      await sleep(800);
      const afterNext = await page.evaluate(() => document.body.innerText);
      const counterAdvanced = afterNext.includes('Card 2 of');
      console.log((counterAdvanced ? 'PASS' : 'FAIL') + ': Next advances counter to Card 2');
      ok = ok && counterAdvanced;
    } else {
      console.log('FAIL: Next button not found');
      ok = false;
    }
  } catch (e) {
    console.log('FAIL:', e.message);
    ok = false;
  }

  console.log('=== INTERACTION: Add Flashcard ===');
  try {
    const addResult = await clickButton('Add Flashcard');
    console.log('Clicked:', addResult.tag, addResult.text);
    if (addResult.clicked) {
      await sleep(800);
      const afterAdd = await page.evaluate(() => document.body.innerText);
      const modalOpen = afterAdd.includes('Save Flashcard');
      console.log((modalOpen ? 'PASS' : 'FAIL') + ': Add Flashcard opens modal with Save button');
      ok = ok && modalOpen;
    } else {
      console.log('FAIL: Add Flashcard button not found');
      ok = false;
    }
  } catch (e) {
    console.log('FAIL:', e.message);
    ok = false;
  }

  await browser.close();
  console.log('=== RESULT:', ok ? 'ALL_PASS' : 'SOME_FAIL');
  process.exit(ok ? 0 : 1);
})().catch(e => {
  console.error('FATAL', e);
  process.exit(1);
});
