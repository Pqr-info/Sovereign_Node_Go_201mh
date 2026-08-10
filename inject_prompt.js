return await page.evaluate(() => {
    const input = document.querySelector('#searchbox') || document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
    if (input) {
        input.focus();
        input.value = 'Yes, please provide the tight spec for the TemporalDampener (data model + Rust/Go hooks + UI representation).';
        if (input.tagName !== 'TEXTAREA' && input.tagName !== 'INPUT') {
            input.innerText = 'Yes, please provide the tight spec for the TemporalDampener (data model + Rust/Go hooks + UI representation).';
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
    }
    return false;
});
