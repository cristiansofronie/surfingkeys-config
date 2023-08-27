import { leader } from './settings';
import { browserSyncID } from './consts';
import { parseDOMToRoam } from './domparser';

export const escapeHTML = unsafe => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const hintsPromise = (elems, func, options) => {
  return new Promise((resolve, reject) => {
    api.Hints.create(
      elems,
      e => {
        func(e);
        resolve();
      },
      options,
    );
  });
};

export const UIGuard = async (func, styleContent) => {
  const style = document.createElement('style');
  style.textContent = styleContent;
  document.body.prepend(style);

  const working = document.createElement('div');
  working.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: yellow;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    z-index: 999999;
  `;
  document.body.append(working);

  const block = document.createElement('div');
  block.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    background-color: transparent;
    width: 100vw;
    height: 100vh;
    z-index: 9999999999999;
    tab-index: 1;
  `;
  document.body.append(block);
  block.focus();

  const blockKeyboard = e => {
    e.stopImmediatePropagation();
    e.preventDefault();
  };
  const events = ['keydown', 'keyup', 'keypress'];

  events.forEach(event => {
    window.addEventListener(event, blockKeyboard, true);
  });

  await func();

  style.remove();
  events.forEach(event => {
    window.removeEventListener(event, blockKeyboard, true);
  });
  block.remove();
  working.remove();
};

export const textRange = async (startPat, endPat, func) => {
  const range = new Range();
  await hintsPromise(startPat, e => range.setStart(e[0], e[1]));
  await hintsPromise(endPat, e => range.setEnd(e[0], e[1] + e[2].length));
  return range.toString();
};

export const getVisibleElems = elems => {
  const visibleElems = [];
  elems.forEach(e => {
    const r = e.getBoundingClientRect();
    if (
      (r.bottom >= 0 && r.bottom <= window.innerHeight) ||
      (r.top >= 0 && r.top <= window.innerHeight) ||
      (r.top < 0 && r.bottom > 0)
    )
      visibleElems.push(e);
  });
  return visibleElems;
};

export const setClipboard = text => {

  const type = 'text/html';
  const blob = new Blob([text], {
    type,
  });
  const data = [
    new ClipboardItem({
      [type]: blob,
    }),
  ];

  navigator.clipboard.write(data);
};

export const sleep = m => new Promise(r => setTimeout(r, m));

String.prototype.toTitleCase = function () {
  let i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = [
    'A',
    'An',
    'The',
    'And',
    'But',
    'Or',
    'For',
    'Nor',
    'As',
    'At',
    'By',
    'For',
    'From',
    'In',
    'Into',
    'Near',
    'Of',
    'On',
    'Onto',
    'To',
    'With',
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(
      new RegExp('\\s' + lowers[i] + '\\s', 'g'),
      function (txt) {
        return txt.toLowerCase();
      },
    );

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(
      new RegExp('\\b' + uppers[i] + '\\b', 'g'),
      uppers[i].toUpperCase(),
    );

  return str;
};

String.prototype.cleanTextRoam = function () {
  return this.replace(/(^\n\{)|(\n\{)|(^\{)/g, '$$$${').replace(
    /\}\n|\}$/g,
    '}$$$$',
  );
};

export const getSelectionHTML = function () {
  let userSelection;
  if (window.getSelection) {
    userSelection = window.getSelection();
    let range;
    if (userSelection.getRangeAt) {
      range = userSelection.getRangeAt(0);
    } else {
      let range = document.createRange();
      range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
      range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    }
    let clonedSelection = range.cloneContents();
    let div = document.createElement('div');
    div.appendChild(clonedSelection);
    return div.innerHTML;
  } else if (document.selection) {
    userSelection = document.selection.createRange();
    return userSelection.htmlText;
  } else {
    return '';
  }
};

export const copySelectionToRoam = () => {
  let sele = '<div>' + getSelectionHTML() + '</div>';
  const data = new DOMParser().parseFromString(sele, 'text/html');
  const url = location.href;

  const page = window.prompt('Page: ', document.title);
  if (!page) return;
  let newClip = `<ul><li><span>[[${page}]]</span><ul>`;
  newClip += '<li>' + url + '</li>';
  newClip += parseDOMToRoam(data.querySelector('div'));
  newClip += '</ul></li>';
  newClip += '</ul>';

  pasteToRoam(newClip);
  setClipboard(newClip);
};

export const addUpDownBinds = (elems, margin) => {
  const errorPercentage = 0.2;
  const elemUp = (elems, margin) => {
    const i = elems.findLastIndex(
      e => e.getBoundingClientRect().top < margin * (1 - errorPercentage),
    );
    if (i != -1) {
      const elem = elems[i];
      elem.scrollIntoView(true);
      document.scrollingElement.scrollTop -= margin;
    }
  };

  const elemDown = (elems, margin) => {
    const i = elems.findIndex(
      e => e.getBoundingClientRect().top > margin * (1 + errorPercentage),
    );
    if (i != -1) {
      const elem = elems[i];
      elem.scrollIntoView(true);
      document.scrollingElement.scrollTop -= margin;
    }
  };

  const getSortedElems = elems => {
    return elems.sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );
  };

  api.mapkey('<F2>', 'Scroll to next elem', () => {
    elemDown(getSortedElems(elems), margin);
  });

  api.mapkey('<Shift-F2>', 'Scroll to previous elem', () => {
    elemUp(getSortedElems(elems), margin);
  });
};

export const mapAllClick = getElemFunc => {
  window.getFirstRelevantLink = getElemFunc;

  [
    [`${leader}F`],
    ['aF', { tabbed: true }],
    ['cF', { multipleHits: true }],
  ].forEach(([shortcut, props]) => {
    api.mapkey(shortcut, 'Click', () => {
      api.Hints.create(getElemFunc(), api.Hints.dispatchMouseClick, props);
    });
  });

  api.mapkey('gF', 'Select first search item', () => {
    api.Hints.dispatchMouseClick(getElemFunc()[0]);
  });

  api.mapkey('gaF', 'Select first search item', () => {
    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
      },
      url: getElemFunc()[0].href || getElemFunc()[0].closest('a').href,
    });
  });
};

export const getWindows = () => {
  return new Promise(resolve => {
    api.RUNTIME(
      'getWindows',
      {
        query: '',
      },
      response => {
        resolve(response.windows);
      },
    );
  });
};

export const getTabs = () => {
  return new Promise(resolve => {
    api.RUNTIME('getTabs', null, resp => {
      resolve(resp.tabs);
    });
  });
};

export const request = (url, headers, data) => {
  return new Promise(resolve => {
    api.RUNTIME(
      'request',
      {
        url,
        headers,
        data,
      },
      resp => {
        resolve(resp);
      },
    );
  });
};

export const execScript = (id, code) => {
  return new Promise(resolve => {
    api.RUNTIME(
      'executeScript',
      {
        code: code,
        allFrames: true,
        tab: {
          id: id,
        },
      },
      resp => {
        resolve(resp);
      },
    );
  });
};
export const getWinTabs = () => {
  return new Promise(resolve => {
    api.RUNTIME(
      'getTabs',
      {
        queryInfo: {
          currentWindow: true,
        },
      },
      resp => {
        resolve(resp.tabs);
      },
    );
  });
};

export const getContent = (ignore_query, query, archive) => {
  api.mapkey(leader + 'a', 'Test', () => {
    if (!query) {
      if (document.querySelector('article')) query = 'article';
      else query = 'article, main, #main-content';
    }

    api.Hints.create([...document.querySelectorAll(query)], e => {
      const url = location.href;
      let clip = '<ul><li><span>[[<>]]</span><ul>';
      clip += '<li><span>' + url + '</span></li>';

      if (typeof archive !== 'undefined') {
        if (archive)
          clip +=
            '<li><span>{{[[iframe]]: ' +
            'https://web.archive.org/' +
            url +
            '}}</span></li>';
        else clip += '<li><span>{{[[iframe]]: ' + url + '}}</span></li>';
      }

      clip += parseDOMToRoam(e, ignore_query);
      clip += '</ul></li>';
      clip += '</ul>';

      pasteToRoam(clip);
      api.Front.showBanner('Sent Wikipedia page to Roam.');
    });
  });
};

export const pasteToRoam = data => {
  const msg = {
    actionType: 'pasteDailyNotes',
    data: {
      actionType: 'pasteDailyNotes',
      data,
    },
  };
  ws.send(JSON.stringify(msg));
};

export const getElems = query => {
  return [...document.querySelectorAll(query)];
};

export const getLinks = () => {
  return [...document.querySelectorAll('a')];
};

export const getPara = () => {
  return Array.from(
    document.querySelectorAll('ul, pre, p, h2, h1, h3, h4, ol, dl'),
  );
};

export const getSrc = () => {
  return [...document.querySelectorAll('img')];
};

export const openSearchRoam = pattern => {
  ws.send(
    JSON.stringify({
      actionType: 'openSearchRoam',
      data: {
        actionType: 'openSearchRoam',
        pattern,
      },
    }),
  );
};

window.openSearchRoam = openSearchRoam;

export const detectSPA = () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '0';
  container.style.height = '1em';
  container.style.width = '1em';
  container.style.right = '0';
  container.style.zIndex = '1000';
  container.style.background = 'red';
  document.body.prepend(container);

  window.addEventListener('popstate', () => {
    container.style.background = 'green';
  });
};

export const searchSyncEngines = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'searchSyncEngines',
    query,
  });
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'searchRoam',
    query,
  });
};

export const searchYoutube = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'syncSearch',
    eng: 'youtube',
    query,
  });
};

export const searchYoutubeNewTab = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'searchYoutubeNewTab',
    query,
  });
};

export const searchWikipedia = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'syncSearch',
    eng: 'wikipedia',
    query,
  });
};

export const searchCambridge = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'syncSearch',
    eng: 'cambridge',
    query,
  });
};

export const searchGoogle = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'syncSearch',
    eng: 'google',
    query,
  });
};

export const searchRoam = query => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'searchRoam',
    query,
  });
};

export const searchAnotherInstance = () => {
  const sele = document.getSelection().toString();
  if (sele) {
    searchSyncEngines(sele);
  } else {
    api.Clipboard.read(clip => {
      searchSyncEngines(clip.data);
    });
  }
};

export const wikipediaToRoam = query => {
  chrome.runtime.sendMessage(
    browserSyncID,
    {
      actionType: 'fetchWikipedia',
      query,
    },
    async message => {
      const dom = new DOMParser().parseFromString(message.resp, 'text/html');
      const paragraphs = [];
      let elem = dom.querySelector('#mw-content-text > .mw-parser-output > p');
      while (elem && !elem.matches('#toc') && !elem.querySelector('#toc')) {
        if (elem.tagName === 'P') paragraphs.push(elem);
        elem = elem.nextElementSibling;
      }

      let clip =
        '<ul><li><span>[[' +
        dom.querySelector('#firstHeading').innerText +
        ']]</span><ul>';
      clip += '<li>' + message.url + '</li>';

      let images = Array.from(dom.querySelectorAll('.infobox-image'))
        .map(e =>
          e
            .querySelector('img')
            .src.replace(/thumb\//g, '')
            .replace(/\/[^\/]*?$/g, ''),
        )
        .reduce((prev, curr) => prev + escapeHTML('![](' + curr + ')\n'), '');
      images += '[[rm-flex]]';

      clip += '<li><pre>' + images + '<pre></li>';
      clip += parseDOMToRoam(paragraphs, '.haudio', {
        originLocation: {
          origin: 'https://en.wikipedia.org',
          href: message.url,
        },
      });
      clip += '<li>{{[[iframe]]: ' + message.url + '}}</li>';
      clip += '</ul></li>';
      clip += '</ul>';

      setClipboard(clip);
      api.Front.showBanner('Copied Wikipedia page.');
    },
  );
};

export const getSesFolder = () => {
  return new Promise(resolve => {
    api.RUNTIME(
      'getBookmarks',
      {
        query: 'ses',
      },
      resp => {
        resolve(resp.bookmarks[0].id);
      },
    );
  });
};

export const getSessions = async () => {
  const id = await getSesFolder();
  return new Promise(resolve => {
    RUNTIME(
      'getBookmarks',
      {
        parentId: id,
      },
      resp => {
        resolve(resp.bookmarks);
      },
    );
  });
};

export const formInput = () => {
  const form = document.createElement('form');
  form.style.cssText = `
  position: fixed;
  left: calc(50vw - 200px);
  top: 10vh;
  width: 400px;
  z-index: 100;
`;

  const input = document.createElement('input');
  form.append(input);

  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Stuff';
  submit.onclick = e => {
    e.preventDefault();
    alert(input.value);
    form.remove();
  };

  form.append(submit);

  document.body.prepend(form);
  input.focus();
};

export const getRepo = repo => {
  const msg = {
    actionType: 'tmuxGetRepo',
    data: {
      repo,
    },
  };
  ws.send(JSON.stringify(msg));
};

export const downloadGitHubRepo = repo => {
  const msg = {
    actionType: 'getGitHubRepo',
    data: {
      repo,
    },
  };
  ws.send(JSON.stringify(msg));
  api.Front.showBanner(`Downloading ${repo}`);
};

export const openSrc = query => {
  const msg = {
    actionType: 'openSrc',
    data: {
      actionType: 'openSrc',
      pattern: query,
    },
  };

  ws.send(JSON.stringify(msg));
  api.Front.showBanner(`Searching for ${query}`);
};
