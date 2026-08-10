await page.evaluate(() => {
    const deepFind = (root, sel) => {
        if (root.querySelector(sel)) return root.querySelector(sel);
        for (const c of root.children) {
            if (c.shadowRoot) {
                const res = deepFind(c.shadowRoot, sel);
                if (res) return res;
            }
        }
        return null;
    };
    const el = deepFind(document.body, '#searchbox') || deepFind(document.body, '[contenteditable="true"]') || deepFind(document.body, 'textarea');
    if (el) {
        el.focus();
    }
});
await page.waitForTimeout(500);
await page.keyboard.type('Yes, please provide the tight spec for the TemporalDampener (data model + Rust/Go hooks + UI representation).');
await page.waitForTimeout(500);
await page.keyboard.press('Enter');
return true;
