import {
  openSearchRoam,
  getRepo,
  searchRoam,
  textRange,
  searchCambridge,
  searchSyncEngines,
  searchAnotherInstance,
  getWinTabs,
  searchGoogle,
  searchWikipedia,
  getPara,
  getSrc,
  detectSPA,
  getElems,
  getLinks,
  setClipboard,
  pasteToRoam,
  addUpDownBinds,
  mapAllClick,
  downloadGitHubRepo,
  escapeHTML,
  copySelectionToRoam,
} from '../utils';
import { browserSyncID } from '../consts';
import { parseDOMToRoam } from '../domparser';
import { leader } from '../settings';

mapAllClick(() => [...document.querySelectorAll('h3 a, a h3')]);

window.addEventListener('DOMContentLoaded', () => {
  addUpDownBinds([...document.getElementsByClassName('h3')], 100);
});

for (let i = 0; i < 10; i++) {
  api.mapkey(`${leader}${i}`, 'Go to n% of video', () => {
    const video = document.querySelector('video');
    video.currentTime = (video.duration * i) / 10;
  });
}

api.map('<Alt-I>', '<Alt-s>');
api.map('<Alt-Esc>', '<Esc>');

api.unmap('<Esc>');
api.unmap('<Alt-s>');

api.unmap('ga');
api.unmap('gt');

api.mapkey('d', 'Scroll one page down', () => {
  api.Normal.scroll('fullPageDown');
});

api.mapkey('u', 'Scroll one page up', () => {
  api.Normal.scroll('fullPageUp');
});

api.mapkey(`${leader}q`, 'Clear selection', () => {
  window.getSelection().removeAllRanges();
});

api.mapkey('<Alt-Tab>', 'Focus previous tab by time', () => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'focusPrevTab',
  });
});

api.imapkey('<Alt-Tab>', 'Focus previous tab by time', () => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'focusPrevTab',
  });
});

api.mapkey('\\', 'Play or pause', () => {
  const videos = [...document.getElementsByTagName('video')];
  if (videos.length > 1) {
    api.Hints.create(videos, video => {
      if (video.paused) video.play();
      else video.pause();
    });
  } else if (videos.length == 1) {
    if (videos[0].paused) videos[0].play();
    else videos[0].pause();
  } else {
    api.Hints.create(
      [
        ...document.querySelectorAll(
          '[aria-label="Pause"], [aria-label="Play"]',
        ),
      ],
      label => {
        label.click();
      },
    );
  }
});

api.mapkey(`${leader}gs`, 'Go to Chromium settings', () => {
  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: 'chrome://settings',
  });
});

api.mapkey(`${leader}vl`, 'Loop video', () => {
  api.Hints.create([...document.querySelectorAll('video')], video => {
    video.loop = true;
  });
});

api.mapkey(`${leader}A`, 'Copy whole content', () => {
  let query;
  if (document.querySelector('article')) query = 'article';
  else query = 'article, main, #main-content';
  const title = window.prompt('Title: ');

  api.Hints.create(getElems(query), e => {
    let clip = `<ul><li><span>[[${title}]]</span><ul>`;
    clip += parseDOMToRoam(e);
    const url = location.href;
    clip += '<li><span>{{[[iframe]]: ' + url + '}}</span></li>';
    clip += '</ul></li>';
    clip += '</ul>';

    pasteToRoam(clip);
    api.Front.showBanner('Sent Wikipedia page to Roam.');
  });
});

api.mapkey(`${leader}a`, 'Copy whole content', () => {
  let query;
  if (document.querySelector('article')) query = 'article';
  else query = 'article, main, #main-content, #content, [role="main"], #main';
  const page = window.prompt('Page name:', document.title);

  api.Hints.create(getElems(query), e => {
    let clip = `<ul><li><span>[[${page}]]</span><ul>`;
    clip += parseDOMToRoam(e);
    const url = location.href;
    clip += '<li><span>{{[[iframe]]: ' + url + '}}</span></li>';
    clip += '</ul></li>';
    clip += '</ul>';

    pasteToRoam(clip);
    api.Front.showBanner('Sent Wikipedia page to Roam.');
  });
});

api.mapkey('ys', 'Copy selection', copySelectionToRoam);

api.vmapkey('ys', 'Copy selection', copySelectionToRoam);

api.mapkey(`${leader}yr`, 'Copy element for Roam', () => {
  api.Hints.create([...document.querySelectorAll('*')], e => {
    let clip = '<ul><li><span>' + escapeHTML('[[<>]]') + '</span><ul>';
    clip += '<li>' + location.href + '</li>';
    clip += parseDOMToRoam(e);

    clip += '</ul></li>';
    clip += '</ul>';

    setClipboard(clip);
  });
});

api.mapkey('ay', 'Copy multiple links', () => {
  let links = '';
  api.Clipboard.read(response => {
    links = response.data;
  });
  api.Hints.create(
    getLinks(),
    element => {
      links += element.href + '\n';
      api.Clipboard.write(links);
    },
    {
      multipleHits: true,
    },
  );
});

api.mapkey(`${leader}rhH`, 'Send link to Roam under specified page', () => {
  const page = prompt('Page: ');
  pasteToRoam(
    `<ul><li><span>[[${page}]]</span><ul><li><span>${escapeHTML(
      location.href,
    )}</span></li></ul></li></ul>`,
  );
});

api.mapkey(`${leader}oqo`, 'Open next link in queue', () => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'openInSearchWinFromQueue',
  });
});

api.mapkey(`${leader}oqa`, 'Add link to open in queue', () => {
  api.Hints.create(
    [...document.querySelectorAll('a')],
    elem => {
      chrome.runtime.sendMessage(browserSyncID, {
        actionType: 'queueToOpenInSearchWin',
        URLs: [elem.href],
      });
    },
    { multipleHits: true },
  );
});

api.mapkey(`${leader}oqc`, 'Clear queue to open links', () => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'clearQueueToOpenInSearchWin',
  });
});

api.mapkey(`${leader}ou`, 'Open URLs on page', () => {
  const URLs = [...document.getElementsByTagName('a')].map(e => {
    return { title: e.textContent.toLowerCase() || '', url: e.href || '' };
  });
  console.log(URLs);
  api.Front.openOmnibar({
    type: 'UserURLs',
    extra: URLs,
  });
});

api.mapkey(`${leader}#`, 'Scroll hash into view', () => {
  const tmpHash = location.hash;
  location.hash = null;
  location.hash = tmpHash;
});

api.mapkey(`${leader}Spa`, 'Detect single page app', detectSPA);

api.mapkey('ai', 'Copy image link', () => {
  api.Hints.create(getElems('img'), e => {
    api.Clipboard.write(e.src);
  });
});

api.mapkey('an', 'Copy pronounciation', () => {
  const src =
    document.querySelector('audio').src || document.querySelector('source').src;

  api.Clipboard.write('{{audio: ' + src + '}}');
});

let tmp = '';

api.mapkey('aI', 'Copy multiple image links', () => {
  api.Hints.create(
    getSrc(),
    element => {
      tmp += element.src + '\n';
    },
    {
      multipleHits: true,
    },
  );
});

api.mapkey('ap', 'Copy multiple paragraphs', () => {
  tmp = '';

  api.Hints.create(
    getPara(),
    elem => {
      if (elem.tagName === 'P') {
        tmp += elem.innerText.cleanTextRoam() + '\n';
      } else if (elem.tagName === 'UL' || elem.tagName === 'OL') {
        [...elem.children].forEach(e => {
          tmp += '\t' + e.innerText.cleanTextRoam() + '\n';
        });
      } else if (elem.tagName === 'DL') {
        tmp += elem.querySelector('dt').innerText.cleanTextRoam() + '\n';
        elem.querySelectorAll('dd').forEach(dd => {
          tmp += '\t' + dd.innerText.cleanTextRoam() + '\n';
        });
      } else {
        tmp += elem.innerText.cleanTextRoam() + '\n';
      }
    },
    {
      multipleHits: true,
    },
  );
});

api.mapkey('am', 'Copy buffer to clipboard', () => {
  api.Clipboard.write(tmp.trim());
  tmp = '';
});

api.mapkey('au', 'Copy URL', () => {
  let url = window.location.href;
  if (url.indexOf(chrome.extension.getURL('/pages/pdf_viewer.html')) === 0) {
    url = window.location.search.substr(3);
  }
  tmp += url + '\n';
});

api.mapkey('at', 'Copy tables in for Roam', () => {
  api.Hints.create(getElems('table'), e => {
    let clip = '<ul><li><span>' + '[[<>]]' + '</span><ul>';
    clip += '<li>' + location.href + '</li>';
    clip += parseDOMToRoam(e);
    clip += '</ul></li>';
    clip += '</ul>';

    setClipboard(clip);
  });
});

api.mapkey('gtU', 'Open root in new tab', () => {
  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: location.origin,
  });
});

api.mapkey('oa', 'Open all links in clipboard', () => {
  api.Clipboard.read(clip => {
    let links = clip.data.split('\n');
    for (let link of links) {
      api.RUNTIME('openLink', {
        tab: {
          tabbed: true,
          active: false,
        },
        url: link,
      });
    }
  });
});

api.mapkey(`${leader}n`, 'Open link from clipboard in new tab', () => {
  api.Clipboard.read(clip => {
    const link = clip.data;
    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
        active: true,
      },
      url: link,
    });
  });
});

api.mapkey(`${leader}N`, 'Open link from clipboard in same tab', () => {
  api.Clipboard.read(clip => {
    const link = clip.data;
    api.RUNTIME('openLink', {
      tab: {
        tabbed: false,
      },
      url: link,
    });
  });
});

api.mapkey(`${leader}ol`, 'Open link from clipboard in current tab', () => {
  api.Clipboard.read(clip => {
    api.RUNTIME('openLink', {
      tab: {
        tabbed: false,
      },
      url: clip.data,
    });
  });
});

api.mapkey('sw', 'Search in another browser instance', () => {
  const sele = document.getSelection().toString();
  searchWikipedia(sele);
});

api.mapkey(`<leader>sg`, 'Search in another browser instance', async () => {
  const sele = document.getSelection().toString();
  searchGoogle(sele);
});

api.mapkey(
  '<Alt-b>',
  'Search in another browser instance',
  searchAnotherInstance,
);

api.mapkey(
  '<Alt-v>',
  'Search in another browser instance',
  searchAnotherInstance,
);

api.vmapkey(
  '<Alt-v>',
  'Search in another browser instance',
  searchAnotherInstance,
);

api.mapkey('se', 'Search with wikipedia', () => {
  const sele = document.getSelection().toString();
  const link = 'https://en.wikipedia.org/wiki/Special:Search?search=' + sele;

  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: encodeURI(link),
  });
});

api.mapkey('yf', 'Copy iframe of given page', () => {
  let clip = '';
  clip += '<ul><li><span>' + escapeHTML('[[<>]]') + '</span><ul>';

  clip +=
    '<li>{{[[iframe]]: ' +
    escapeHTML('https://web.archive.org/' + location.href) +
    '}}</li>';
  clip += '<li>{{[[iframe]]: ' + escapeHTML(location.href) + '}}</li>';
  clip += '<li>' + escapeHTML(location.href) + '</li>';

  clip += '</ul></li>';
  clip += '</ul>';
  setClipboard(clip);
});

api.mapkey('gS', 'See Similar Sites', () => {
  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: 'https://google.com/search?q=related:' + location.hostname,
  });
});

api.mapkey('yw', 'Yank words', () => {
  api.Hints.create(/\w+/g, res => {
    api.Clipboard.write(res[2]);
  });
});

const setWindowToOpenTabs = () => {
  window.searchWindow = true;
  const msg = {
    actionType: 'setBrowserSyncWS',
  };
  ws.send(JSON.stringify(msg));
};

api.mapkey(
  `${leader}${leader}ss`,
  'Set window used to open tabs',
  setWindowToOpenTabs,
);

api.mapkey(`${leader}${leader}e`, 'Copy range for Roam at once', () => {
  api.Hints.create(
    [...document.querySelectorAll('*')]
      .filter(e => e.textContent.trim().length !== 0)
      .filter(
        e =>
          ![...e.querySelectorAll(':scope > *')].some(
            child => child.textContent.trim() === e.textContent.trim(),
          ),
      ),
    elem => {
      copyRangeRoamRange = document.createRange();
      copyRangeRoamRange.setStart(elem, 0);
      copyRangeRoamRange.setEnd(elem, elem.childNodes.length);
      const sele = document.getSelection();
      sele.removeAllRanges();
      sele.addRange(copyRangeRoamRange);
      copySelectionToRoam();
      sele.removeAllRanges();
      api.Front.showBanner('Copied');
    },
  );
});

api.mapkey(`${leader}yu`, 'Copy all URLs in current window', async () => {
  const tabs = await getWinTabs();
  const urls = [...new Set(tabs.map(tab => tab.url))];
  api.Clipboard.write(urls.join('\n'));
});

api.mapkey(`${leader}h`, 'Navigate to link from Clipboard', () => {
  api.Clipboard.read(clip => {
    location.href = clip.data;
  });
});

api.mapkey(`${leader}ab`, 'Create bookmarks from all tabs in window', () => {
  api.RUNTIME(
    'createBookmark',
    {
      page: self.page,
    },
    () => {
      api.Front.showBanner('Bookmark created at {0}.'.format(folderName), 3000);
    },
  );
});

// api.mapkey(`${leader}v`, 'Eval from clipboard', () => {
//   api.Clipboard.read(clip => {
//     eval(clip.data);
//   });
// });

api.mapkey('yH', 'Copy second to top part of the host name', () => {
  api.Clipboard.write(location.host.split('.').at(-2));
});

api.mapkey(`${leader}vf`, 'Focus video', () => {
  api.Hints.create([...document.querySelectorAll('video')], e => {
    e.focus();
  });
});

const saveNativeVolume = newVolume => {
  const data = JSON.stringify({
    volume: newVolume,
    muted: newVolume <= 0,
  });
  const timeNow = Date.now();

  window.localStorage.setItem(
    'yt-player-volume',
    JSON.stringify({
      data: data,
      // expiration: timeNow + oneMonth,
      creation: timeNow,
    }),
  );

  window.sessionStorage.setItem(
    'yt-player-volume',
    JSON.stringify({
      data: data,
      creation: timeNow,
    }),
  );
};

const saveYouTubeSessionValue = newVolume => {
  const data = JSON.stringify({
    volume: newVolume,
    muted: newVolume <= 0,
  });
  const timeNow = Date.now();

  sessionStorage.setItem(
    'yt-player-volume',
    JSON.stringify({
      data,
      creation: timeNow,
    }),
  );
};

api.mapkey(
  `${leader}m`,
  'Mute',
  () => {
    api.Hints.create(
      getElems('video'),
      video => {
        video.muted = !video.muted;
      },
      {
        multipleHits: false,
      },
    );
  },
  {
    repeatIgnore: false,
  },
);

api.mapkey(`${leader}j'`, 'Back 10s', () => {
  api.Hints.create(
    getElems('video'),
    video => {
      video.currentTime -= 10;
    },
    {
      multipleHits: false,
    },
  );
});

api.mapkey(`${leader}l`, 'Forward 10s', () => {
  api.Hints.create(
    getElems('video'),
    video => {
      video.currentTime += 10;
    },
    {
      multipleHits: false,
    },
  );
});

api.mapkey('<F9>', 'Decrease volume for YouTube', () => {
  const video = document.querySelector('.video-stream');
  video.volume -= 0.1;
  saveNativeVolume(100);
});

api.mapkey('<F10>', 'Increase volume for YouTube', () => {
  const video = document.querySelector('.video-stream');
  video.volume += 0.1;
  saveNativeVolume(100);
});

api.mapkey(`${leader}${leader}v`, 'Set Youtube Volume to 100%', () => {
  saveNativeVolume(100);
  saveYouTubeSessionValue(5);
  document.querySelector('video').volume = 0.05;
});

api.mapkey(`${leader}${leader}j`, 'Decrease volume', () => {
  api.Hints.create(
    getElems('video'),
    video => {
      video.volume -= 0.1;
    },
    {
      multipleHits: false,
    },
  );
});

api.mapkey(`${leader}${leader}l`, 'Increase volume', () => {
  api.Hints.create(
    getElems('video'),
    video => {
      video.volume += 0.1;
    },
    {
      multipleHits: false,
    },
  );
});

api.mapkey(`${leader}sk`, 'Open in WikiPedia from input', () => {
  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${
      document.querySelector('input').value
    }`,
  });
});

api.mapkey(`${leader}${leader}i`, 'Show dialog', () => {
  const dialog = document.createElement('dialog');
  dialog.innerHTML = `
    <form>
      Enter sme text: <input type="text">
      <input type="submit">
    </form>
  `;
  document.body.prepend(dialog);
  dialog.showModal();
});

api.mapkey(`${leader}${leader}r`, 'Add class to element', () => {
  api.Hints.create([...document.querySelectorAll('*')], e => {
    const prevElem = document.getElementsByClassName('sk')[0];
    if (prevElem) prevElem.classList.remove('sk');
    e.classList.add('sk');
    console.log(e.parentElement);
    console.log(e);
    console.log(e.children);
    api.Clipboard.write('sk');
    api.Clipboard.write(
      "let sk = document.getElementsByClassName('sk')[0]\nsk",
    );
  });
});

api.mapkey(`${leader}${leader}s`, 'Show element markup', () => {
  api.Hints.create([...document.querySelectorAll('*')], e => {
    api.Clipboard.write(e.innerHTML);
  });
});

api.mapkey(
  `${leader}rhw`,
  'Send link to Roam under specified page and create link',
  () => {
    let page;
    let parentPage;
    api.Clipboard.read(clip => {
      page = window.prompt('Page: ', clip.data);
      if (page) {
        pasteToRoam(
          `<ul><li><span>[[${page} Website]]</span><ul><li><span>${escapeHTML(
            location.href,
          )}</span></li></ul></li>
        </ul>`,
        );
      }
    });
  },
);
api.mapkey(`${leader}rhh`, 'Send link to Roam', () => {
  pasteToRoam(
    `<ul><li><span>[[&lt&gt]]</span><ul><li><span>${escapeHTML(
      location.href,
    )}</span></li></ul></li></ul>`,
  );
});

api.mapkey(
  `${leader}rhl`,
  'Send link to Roam under specified page and create link',
  () => {
    let page;
    let parentPage;
    api.Clipboard.read(clip => {
      page = prompt('Page: ', clip.data);
      api.Clipboard.read(clip => {
        parentPage = prompt('Parent page: ', clip.data);
        pasteToRoam(
          `<ul><li><span>[[${page}]]</span><ul><li><span>${escapeHTML(
            location.href,
          )}</span></li></ul></li>
        <li>#[[child page]] [[${parentPage}]] [[${page}]]</li>
        </ul>`,
        );
      });
    });
  },
);

api.mapkey('yv', '#7Yank text of an element', function () {
  api.Hints.create(/(^[\n\r\s]*\S+|\b\S+)/g, e => {
    api.Clipboard.write(e[1] === 0 ? e[0].data.trim() : e[2].trim());
  });
});

api.mapkey(`${leader}os`, 'Open link in search window', () => {
  api.Hints.create([...document.querySelectorAll('a')], elem => {
    chrome.runtime.sendMessage(browserSyncID, {
      actionType: 'openInSearchWin',
      URL: elem.href,
    });
  });
});

let prevSearchQuery;

api.mapkey(
  `${leader}Sn`,
  'Search All Engines with Previous Query',
  async () => {
    searchSyncEngines(prevSearchQuery);
  },
);

api.mapkey(`${leader}sc`, 'Search Cambridge Dictionary', async () => {
  const txt = await textRange(/\w+/g, /\w+/g);
  prevSearchQuery = txt;
  searchCambridge(txt);
  searchRoam(txt.replace(/(s|ed|es)$/g, '') + ' english word');
});

api.mapkey(`${leader}yt`, 'Copy text range', async () => {
  const txt = await textRange(/[\w-_]+/g, /[\w-_]+/g);
  prevSearchQuery = txt;
  api.Clipboard.write(txt);
});

api.mapkey(`${leader}yo`, 'Copy text range', async () => {
  const txt = await textRange(/[\w-_]+/g, /[\w-_]+/g);
  openSearchRoam(txt);
});

api.mapkey(`${leader}yr`, 'Copy text range for Roam', async () => {
  const txt = await textRange(/[^\s]+/g, /[^\s]+/g);
  let clip = '<ul><li><span>[[&lt&gt]]</span><ul>';
  clip += '<li>' + location.href + '</li>';
  clip += '<li>' + txt + '</li>';
  clip += '</ul></li></ul>';
  setClipboard(clip);
});

api.mapkey(`${leader}sr`, 'Search Roam', async () => {
  const txt = await textRange(/\w+/g, /\w+/g);
  searchRoam(txt);
});

api.mapkey(`${leader}so`, 'Open page in Roam', async () => {
  const txt = await textRange(/\w+/g, /\w+/g);
  openSearchRoam(txt);
});

api.mapkey(`${leader}sw`, 'Search Wikipedia', () => {
  api.Hints.create(/\w+/g, res => {
    searchWikipedia(res);
  });
});

api.mapkey(`${leader}sn`, 'Search All Engines', async () => {
  const txt = await textRange(/\w+/g, /\w+/g);
  searchSyncEngines(txt);
});

api.mapkey(`${leader}sp`, 'Search Exact Phrase', async () => {
  const txt = await textRange(/\w+/g, /\w+/g);
  api.RUNTIME('openLink', {
    tab: {
      tabbed: true,
      active: true,
    },
    url: 'https://google.com/search?q=' + encodeURI('"' + txt + '"'),
  });
});

api.mapkey(`${leader}sa`, 'Serch Element in Serch Engines', () => {
  api.Hints.create(
    getElems('*'),
    elem => {
      searchSyncEngines(elem.innerText);
    },
    {
      multipleHits: false,
    },
  );
});

api.mapkey(`${leader}oy`, 'Open with specified input', () => {
  const msg = {
    type: 'URLs',
    action: 'openOmnibar',
    commandToFrontend: true,
  };

  top.postMessage({
    surfingkeys_data: msg,
  });
});

const fetchData = url => {
  chrome.runtime.sendMessage(
    browserSyncID,
    {
      actionType: 'fetchData',
      url,
    },
    message => {
      console.log('Text', message.resp);
    },
  );
};

api.mapkey(`${leader}${leader}d`, 'Fetch random URLs', () => {
  console.log('Should fetch data!');
  fetchData(
    'https://levelup.gitconnected.com/how-to-use-react-js-to-create-chrome-extension-in-5-minutes-2ddb11899815',
  );
});

api.mapkey(`${leader}se`, 'Search Content of Entire Elements in Roam', () => {
  api.Hints.create(
    [...document.querySelectorAll('*')]
      .filter(e => e.textContent.trim().length !== 0)
      .filter(
        e =>
          ![...e.querySelectorAll(':scope > *')].some(
            child => child.textContent.trim() === e.textContent.trim(),
          ),
      ),
    e => {
      searchRoam(e.textContent.trim());
    },
  );
});

const downloadWholeWebsite = URL => {
  const msg = {
    actionType: 'downloadWholeWebsite',
    data: {
      URL,
    },
  };
  ws.send(JSON.stringify(msg));
  api.Front.showBanner(`Downloading ${URL}`);
};

api.mapkey(`${leader}dw`, 'Downlod whole website', () => {
  downloadWholeWebsite(location.href);
});

api.mapkey(`${leader}${leader}b`, 'Show sync engine info', () => {
  chrome.runtime.sendMessage(browserSyncID, {
    actionType: 'getSyncEngineInfo',
  });
});

let copyRangeRoamRange;
let copyRangeRoamStart = true;

api.mapkey(`${leader}e`, 'Copy range for Roam', () => {
  api.Hints.create(
    [...document.querySelectorAll('*')]
      .filter(e => e.textContent.trim().length !== 0)
      .filter(
        e =>
          ![...e.querySelectorAll(':scope > *')].some(
            child => child.textContent.trim() === e.textContent.trim(),
          ),
      ),
    elem => {
      if (copyRangeRoamStart) {
        copyRangeRoamRange = document.createRange();
        copyRangeRoamRange.setStart(elem, 0);
      } else {
        copyRangeRoamRange.setEnd(elem, elem.childNodes.length);
        const sele = document.getSelection();
        sele.removeAllRanges();
        sele.addRange(copyRangeRoamRange);
        copySelectionToRoam();
        sele.removeAllRanges();
        api.Front.showBanner('Copied');
      }
      copyRangeRoamStart = !copyRangeRoamStart;
    },
  );
});

api.mapkey(`${leader}cl`, 'Console log elements', () => {
  api.Hints.create([...document.querySelectorAll('*')], e => {
    const parents = [];
    let parent = e;
    while ((parent = parent?.parentElement)) parents.push(parent);

    parents.reverse().forEach(e => {
      console.log(e);
    });
    console.log(e);
    console.log(...e.children);
  });
});

api.mapkey('yr', 'Copy RSS feed', () => {
  api.Clipboard.write(
    document.querySelector('[type="application/rss+xml"]').href,
  );
});

api.mapkey('ss', 'Search clip on Wikipedia', async () => {
  api.Clipboard.read(clip => {
    location.href =
      'https://en.wikipedia.org/wiki/Special:Search?search=' +
      encodeURIComponent(clip.data);
  });
});

api.mapkey('ss', 'Search clip on Wikipedia', async () => {
  api.Clipboard.read(clip => {
    location.href =
      'https://en.wikipedia.org/wiki/Special:Search?search=' +
      encodeURIComponent(clip.data);
  });
});

api.mapkey(leader + 'yi', 'Copy entire elements', () => {
  api.Hints.create(
    [...document.querySelectorAll('*')]
      .filter(e => e.textContent.trim().length !== 0)
      .filter(
        e =>
          ![...e.querySelectorAll(':scope > *')].some(
            child => child.textContent.trim() === e.textContent.trim(),
          ),
      ),
    e => {
      api.Clipboard.write(e.textContent);
    },
  );
});

api.mapkey(`${leader}drs`, 'Download a repo from selection', () => {
  getRepo(window.getSelection().toString());
});

api.mapkey(`${leader}dri`, 'Download GitHub Repository', () => {
  const repo = 'https://github.com/' + prompt('Enter GitHub repository: ');
  downloadGitHubRepo(repo);
});

api.mapkey(`${leader}dra`, 'Download GitHub Repository', () => {
  api.Hints.create(
    [...document.querySelectorAll('a')].filter(e =>
      e.href.startsWith('https://github.com/'),
    ),
    elem => {
      const repoURL = new URL(elem.href);
      const repo =
        'https://github.com/' +
        repoURL.pathname.split('/').slice(1, 3).join('/');
      downloadGitHubRepo(repo);
    },
    {
      multipleHits: false,
    },
  );
});
