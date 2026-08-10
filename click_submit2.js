const el = await page.evaluateHandle(() => {
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
    return deepFind(document.body, '#searchbox') || deepFind(document.body, '[contenteditable="true"]') || deepFind(document.body, 'textarea');
});
if (el) {
    await el.focus();
    await page.keyboard.press('Enter');
    return true;
}
return false;
