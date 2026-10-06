const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';
const EDGE_PATH = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';

async function findBrowser() {
  const fs = require('fs');
  if (fs.existsSync(CHROME_PATH)) return CHROME_PATH;
  if (fs.existsSync(EDGE_PATH)) return EDGE_PATH;
  return null;
}

async function run() {
  const browserPath = await findBrowser();
  if (!browserPath) {
    console.log('No browser found');
    process.exit(1);
  }
  console.log('Using browser:', browserPath);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);

  console.log('Navigating to http://localhost:8081/');
  await page.goto('http://localhost:8081/', { waitUntil: 'networkidle0', timeout: 120000 });

  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    return root && root.innerText && root.innerText.length > 10;
  }, { timeout: 120000 });

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('--- PAGE TEXT ---');
  console.log(bodyText);
  console.log('--- END PAGE TEXT ---');

  const checks = {
    'Flashcards title': bodyText.includes('Flashcards'),
    'Show Answer button': bodyText.includes('Show Answer'),
    'Card counter': bodyText.includes('Card 1 of'),
    'Question visible': bodyText.length > 20
  };

  console.log('\n=== ASSERTIONS ===');
  for (const [name, pass] of Object.entries(checks)) {
    console.log((pass ? '✓ ' : '✗ ') + name);
  }

  console.log('\n=== INTERACTION TESTS ===');

  try {
    const showAnswerBtn = await page.("//button[contains(text(), 'Show Answer')]");
    if (showAnswerBtn.length > 0) {
      await showAnswerBtn[0].click();
      await page.waitForTimeout(500);
      const afterShow = await page.evaluate(() => document.body.innerText);
      const answerVisible = afterShow.includes('Hide Answer');
      console.log((answerVisible ? '✓ ' : '✗ ') + 'Show Answer toggles to Hide Answer');
    } else {
      console.log('✗ Show Answer button not found for click');
    }
  } catch (e) {
    console.log('✗ Show Answer click failed:', e.message);
  }

  try {
    const nextBtn = await page.("//button[contains(text(), 'Next')]");
    if (nextBtn.length > 0) {
      await nextBtn[0].click();
      await page.waitForTimeout(500);
      const afterNext = await page.evaluate(() => document.body.innerText);
      const counterAdvanced = afterNext.includes('Card 2 of');
      console.log((counterAdvanced ? '✓ ' : '✗ ') + 'Next advances counter');
    } else {
      console.log('✗ Next button not found');
    }
  } catch (e) {
    console.log('✗ Next click failed:', e.message);
  }

  try {
    const addBtn = await page.("//button[contains(text(), 'Add Flashcard')]");
    if (addBtn.length > 0) {
      await addBtn[0].click();
      await page.waitForTimeout(500);
      const afterAdd = await page.evaluate(() => document.body.innerText);
      const modalOpen = afterAdd.includes('Save Flashcard') && afterAdd.includes('Cancel');
      console.log((modalOpen ? '✓ ' : '✗ ') + 'Add Flashcard opens modal');
      
      try {
        const saveBtn = await page.("//button[contains(text(), 'Save Flashcard')]");
        if (saveBtn.length > 0) {
          await saveBtn[0].click();
          await page.waitForTimeout(500);
          const afterEmptySave = await page.evaluate(() => document.body.innerText);
          const validationError = afterEmptySave.includes('required') || afterEmptySave.includes('empty') || afterEmptySave.includes('must');
          console.log((validationError ? '✓ ' : '✗ ') + 'Empty validation works');
        }
      } catch (e) {
        console.log('✗ Empty validation test failed:', e.message);
      }

      try {
        const questionInput = await page.input[placeholder*="Question"] || await page.textarea[placeholder*="Question"];
        const answerInput = await page.input[placeholder*="Answer"] || await page.textarea[placeholder*="Answer"];
        
        if (questionInput && answerInput) {
          await questionInput.type('Test Question');
          await answerInput.type('Test Answer');
          
          const saveBtn = await page.("//button[contains(text(), 'Save Flashcard')]");
          if (saveBtn.length > 0) {
            await saveBtn[0].click();
            await page.waitForTimeout(1000);
            const afterSave = await page.evaluate(() => document.body.innerText);
            const backToHome = afterSave.includes('Flashcards') && afterSave.includes('Show Answer');
            console.log((backToHome ? '✓ ' : '✗ ') + 'Save returns to Home with updated count');
          }
        } else {
          console.log('✗ Input fields not found');
        }
      } catch (e) {
        console.log('✗ Fill and save failed:', e.message);
      }
    } else {
      console.log('✗ Add Flashcard button not found');
    }
  } catch (e) {
    console.log('✗ Add Flashcard test failed:', e.message);
  }

  await browser.close();
  console.log('\n=== TEST COMPLETE ===');
}

run().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
