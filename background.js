chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ask-copilot",
    title: "Ask Copilot",
    contexts: ["selection", "page", "image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const selection = info.selectionText || '';
  const context = { url: tab.url, selection };
  // POST to your Gemma IDE endpoint
  const resp = await fetch('https://your-gemma-host/api/router/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operatorRequest: selection || `Inspect page ${tab.url}`, context })
  });
  const data = await resp.json();
  // Optionally open a popup or notify user
  chrome.notifications.create({ type: 'basic', title: 'Copilot', message: 'Response received. Check Gemma IDE.' });
});