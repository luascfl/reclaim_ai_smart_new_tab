// Compatibilidade Chrome/Firefox: usa a API disponível
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// URL do Reclaim que você quer abrir
const reclaimUrl = "https://app.reclaim.ai/planner?login=1&taskSort=schedule&range=WEEK";

// URL que será buscada para ver se já existe
const reclaimPattern = "*://app.reclaim.ai/planner*";

const NEW_TAB_URLS = new Set(["about:blank", "about:newtab", "chrome://newtab/"]);

const queryTabs = (query) =>
  new Promise((resolve) => browserAPI.tabs.query(query, resolve));

const updateTab = (tabId, updateInfo) =>
  new Promise((resolve) => browserAPI.tabs.update(tabId, updateInfo, resolve));

async function handleNewTab(newTab) {
  const currentUrl = newTab.url || newTab.pendingUrl;
  if (!NEW_TAB_URLS.has(currentUrl)) {
    return;
  }

  const tabs = await queryTabs({ url: reclaimPattern });

  // Se não houver abas do Reclaim abertas, redireciona a nova aba
  if (tabs.length === 0) {
    await updateTab(newTab.id, { url: reclaimUrl });
  }
}

browserAPI.tabs.onCreated.addListener(handleNewTab);
