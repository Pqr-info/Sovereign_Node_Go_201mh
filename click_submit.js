const el = document.querySelector('#userInput') || document.querySelector('textarea') || document.querySelector('[contenteditable]');
if (el) {
    el.focus();
}
// just press Enter
await page.keyboard.press('Enter');
return 'pressed enter';
