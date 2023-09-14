import {
  searchRoam,
  searchSyncEngines,
  detectSPA,
  getRepo,
  downloadGitHubRepo,
} from './utils';
import { browserSyncID } from './consts';
import './search_aliases';
import { setSettings, leader } from './settings';
import './roampdf';
import './mappings';
import { connectSock } from './ws';

setSettings();

window.addEventListener('popstate', () => {
  if (location.hash.includes('tULVR6FYG')) {
    console.log('Sync Roam search');
    chrome.runtime.sendMessage(browserSyncID, {
      actionType: 'setRoamTabID',
    });
  }
});

window.addEventListener('message', async e => {
  switch (e.data.actionType) {
    case 'syncSearch':
      searchSyncEngines(e.data.seleTxt);
      break;
    case 'queueToOpenInSearchWin':
      chrome.runtime.sendMessage(browserSyncID, {
        actionType: 'queueToOpenInSearchWin',
        URLs: e.data.URLs,
      });
      break;
    case 'openInSearchWin':
      chrome.runtime.sendMessage(browserSyncID, {
        actionType: 'openInSearchWin',
        URL: e.data.URL,
      });
      break;
  }
});

connectSock();

const openLinkInSearchBrowser = link => {
  const msg = {
    actionType: 'openTabInSearchWindowToServer',
    data: {
      actionType: 'openTabInSearchWindow',
      link,
    },
  };
  ws.send(JSON.stringify(msg));
};

const searchWithChatGPT = query => {
  const msg = {
    actionType: 'searchWithChatGPT',
    data: {
      actionType: 'searchWithChatGPT',
      query,
    },
  };
  ws.send(JSON.stringify(msg));
};

const roamAdvSearch = query => {
  const msg = {
    actionType: 'roamAdvancedSearch',
    data: {
      actionType: 'roamAdvancedSearch',
      query,
    },
  };
  ws.send(JSON.stringify(msg));
};

window.getRepo = getRepo;
window.downloadGitHubRepo = downloadGitHubRepo;
window.openLink = openLinkInSearchBrowser;
window.searchWithChatGPT = searchWithChatGPT;
window.roamAdvSearch = roamAdvSearch;

addEventListener('DOMContentLoaded', () => {
  if (location.href.includes('autoOpenOmni')) {
    setTimeout(setWindowToOpenTabs, 500);
  }

  if (location.href === 'https://www.google.com/search?q=openSyncTabs') {
    chrome.runtime.sendMessage(browserSyncID, {
      actionType: 'openSyncTabsBasedOnTabName',
    });
    setTimeout(api.Normal.feedkeys, 100, 'x');
  }

  if (location.href === 'https://www.google.com/search?q=autoOpenOmni') {
    console.log('Did set the location');
    chrome.runtime.sendMessage(browserSyncID, {
      actionType: 'setSearchWindowIDBasedOnTabName',
    });
  }

  if (location.href.includes('autoOpenExtensions')) {
    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
        active: true,
      },
      url: 'chrome:extensions',
    });
    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
        active: false,
      },
      url: 'chrome://extensions/shortcuts',
    });
    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
        active: false,
      },
      url: 'chrome://settings',
    });
    setTimeout(api.Normal.feedkeys, 100, 'x');
  }

  if (document.hasFocus())
    searchRoam(document.getElementsByTagName('h1')[0].textContent);
});

window.setTimeout(detectSPA, 50);

if (location.hostname === 'chat.openai.com') {
  const setChatGPTWin = () => {
    window.chatGPTWin = true;
    const msg = {
      actionType: 'setChatGPTWS',
    };
    window.ws.send(JSON.stringify(msg));
  };
  setTimeout(setChatGPTWin, 1000);
}

if (new URL(location).searchParams.get('auto_open_first') === 'true') {
  api.Hints.dispatchMouseClick(getFirstRelevantLink()[0]);
}

const logSrc = () => {
  const found = new Set();
  document.querySelectorAll('[href^="http://github.com"]').forEach(e => {
    console.log(e.href);
    found.add(e.href);
  });
  if (found.size) {
    api.Front.showBanner([...found.entries()].join('\n'));
  }
};

window.addEventListener('DOMContentLoaded', () => {
  logSrc();
});

window.setTimeout(() => {
  const isCgit = document.querySelector(
    'meta[name="generator"][content^=cgit]',
  );
  if (isCgit) {
    const links = [
      ...new Set(
        [...document.querySelectorAll('[rel=vcs-git]')].map(e => e.href),
      ),
    ].join('\n');
    console.log(links);
    api.Front.showBanner(links);
  }
}, 100);
