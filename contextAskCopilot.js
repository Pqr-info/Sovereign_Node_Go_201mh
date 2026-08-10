// contextAskCopilot.js
// Attach to your main app initialization

function createContextMenu() {
  const menu = document.createElement('div');
  menu.id = 'copilot-context-menu';
  menu.style.position = 'fixed';
  menu.style.zIndex = 99999;
  menu.style.display = 'none';
  menu.style.background = '#fff';
  menu.style.border = '1px solid #ccc';
  menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
  menu.innerHTML = '<div id="ask-copilot" style="padding:8px 12px;cursor:pointer">Ask Copilot</div>';
  document.body.appendChild(menu);

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const sel = window.getSelection().toString().trim();
    const target = e.target;
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = 'block';

    // store context
    menu.dataset.selection = sel || '';
    menu.dataset.selector = cssPath(target);
  });

  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });

  document.getElementById('ask-copilot').addEventListener('click', async (ev) => {
    ev.stopPropagation();
    const selection = menu.dataset.selection;
    const selector = menu.dataset.selector;
    menu.style.display = 'none';

    const operatorRequest = selection || `Inspect element: ${selector}`;
    // Build context snapshot minimal: url + selector + selected text
    const context = {
      url: window.location.href,
      selector,
      selection
    };

    // Call your router endpoint (adjust path as needed)
    const resp = await fetch('/api/router/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operatorRequest, context })
    });

    const data = await resp.json();
    showCopilotPanel(data);
  });
}

// Utility: deterministic CSS path for element (simple, index-based)
function cssPath(el) {
  if (!el) return '';
  const parts = [];
  while (el && el.nodeType === Node.ELEMENT_NODE && el.tagName.toLowerCase() !== 'html') {
    let name = el.tagName.toLowerCase();
    if (el.id) {
      name += `#${el.id}`;
      parts.unshift(name);
      break;
    } else {
      const parent = el.parentNode;
      if (!parent) { parts.unshift(name); break; }
      const siblings = Array.from(parent.children).filter(c => c.tagName === el.tagName);
      if (siblings.length > 1) {
        const idx = Array.prototype.indexOf.call(parent.children, el) + 1;
        name += `:nth-child(${idx})`;
      }
      parts.unshift(name);
      el = parent;
    }
  }
  return parts.join(' > ');
}

// Simple UI: show Copilot response
function showCopilotPanel(routerResponse) {
  let panel = document.getElementById('copilot-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'copilot-panel';
    panel.style.position = 'fixed';
    panel.style.right = '16px';
    panel.style.bottom = '16px';
    panel.style.width = '420px';
    panel.style.maxHeight = '60vh';
    panel.style.overflow = 'auto';
    panel.style.background = '#fff';
    panel.style.border = '1px solid #ddd';
    panel.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    panel.style.padding = '12px';
    panel.style.zIndex = 100000;
    document.body.appendChild(panel);
  }
  panel.innerText = ''; // clear
  const title = document.createElement('div');
  title.style.fontWeight = '600';
  title.style.marginBottom = '8px';
  title.innerText = 'Copilot';
  panel.appendChild(title);

  const pre = document.createElement('pre');
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.fontFamily = 'inherit';
  pre.innerText = JSON.stringify(routerResponse, null, 2);
  panel.appendChild(pre);
}

// Initialize
createContextMenu();