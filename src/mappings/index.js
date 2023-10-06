import './default_mappings';
import './cambridge_org';
import './mozilla_org';
import './google_com';
import './twitter_com';
import './chat_openai_com';
import './github_com';
import './youtube_com';
import './wiki_archlinux_org';
import './digitalocean_com';
import './wikipedia_org';
import './www_biblegateway_com';

import {
  mapAllClick,
  getElems,
  setClipboard,
  getContent,
  escapeHTML,
  addUpDownBinds,
  pasteToRoam,
} from '../utils';

import { leader } from '../settings';
import { parseDOMToRoam } from '../domparser';

if (location.href.startsWith('https://docs.ansible.com')) {
  const query = '[itemprop=articleBody] > .section';
  const ignore_query = '';
  getContent(ignore_query, query);
}

if (location.href.startsWith('https://nodejs.org')) {
  const query = '#column1';
  const ignore_query = '';
  getContent(ignore_query, query);
}

if (location.href.startsWith('https://www.hashicorp.com')) {
  const query = '.BlogPost_blogPost__YRfVQ';
  const ignore_query = '';
  getContent(ignore_query, query);
}

if (location.href.startsWith('https://dev.mysql.com')) {
  const query = '#docs-body > .section, #docs-main-inner';
  const ignore_query = '#docs-in-page-nav-container, #docs-body-extra';
  getContent(ignore_query, query, false);
}

if (location.href.startsWith('https://docs.docker.com')) {
  const query = '#docs-body > .section';
  const ignore_query = '#docs-in-page-nav-container, #docs-body-extra';
  getContent(ignore_query, query);
}

if (location.href.startsWith('file://')) {
  const query = 'body';
  const ignore_query = '';
  getContent(ignore_query, query);
}

if (location.href.includes('cyberciti.biz')) {
  const ignore_query =
    '.crp_related, .nixcraftcmdtabls, .note.pop, .headline_area, .tutorialrequirements, .headline_area, .amp-wp-7ccff8f';
  getContent(ignore_query);
}

if (location.href.startsWith('https://www.reddit.com')) {
  api.mapkey('ac', 'Copy Reddit post', () => {
    api.Hints.create('._3cjCphgls6DH-irkVaA0GM', async e => {
      tmp = '<ul><span>[[<>]]</span><ul>';

      tmp += '<li>' + escapeHTML(e.innerText) + '</li>';
      tmp += '<li>' + location.href + '</li>';

      tmp += '</ul></li></ul>';
      setClipboard(tmp);
      tmp = '';
    });
  });
}

if (/libgen\.rs\/search\.php/.test(location.href)) {
  const getElems = () => {
    const tds = Array.from(
      document.querySelectorAll('table[cellspacing] td:nth-child(10)'),
    ).filter(td => td.previousElementSibling.innerText === 'pdf');

    return tds.map(td => td.querySelector('a'));
  };

  api.mapkey('gy', 'Open search result in same tab', () => {
    api.Hints.create(
      '[title="Sort results by Year"]',
      api.Hints.dispatchMouseClick,
    );
  });
}

if (location.host === 'library.lol') {
  api.mapkey('aa', 'Copy for download', () => {
    const href = document.querySelector('#download ul li a').href;
    const header = document.querySelector('h1').innerText;
    const name =
      header.toLowerCase().replace(/ /g, '_') + '.' + href.split('.').pop();

    api.Clipboard.write(header);
    api.Clipboard.write(
      `cd ~/Downloads && libgen "${href}" "${name}" && zathura *(om[1])`,
    );
  });

  api.mapkey(leader + 't', 'Copy title', () => {
    api.Clipboard.write(document.querySelector('#info > h1').innerText);
  });
}

if (location.hostname === 'piped.kavin.rocks') {
  api.mapkey('aa', 'Copy info for embedding in Roam Research', () => {
    const video = new URL(location).tearchParams.get('v');
    const url = `https://www.youtube.com/watch?v=${video}`;
    const title = document.querySelector(
      '.w-full > div > div.font-bold',
    ).textContent;
    const channel = document.querySelector('[href^="/channel/"').textContent;
    let markup = '';

    markup += title + ' ' + channel + ' [[Youtube Video]]\n';
    markup += '\t{{[[video]]:' + url + '}}\n';
    markup += '\t\t[[Video Notes]]\n';
    markup += '\t\t\t[[Old Video Notes]]\n';
    markup += '\t\t\t[[<>]]\n';

    api.Clipboard.write(markup);
  });
}

if (/translate\.google\.com/.test(location.href)) {
  api.mapkey('yA', 'Copy title', async () => {
    api.Clipboard.write(
      document.querySelector(
        '[data-language] [data-language-for-alternatives] > span[jsaction]',
      ).innerText,
    );
  });
}

if (/merriam-webster\.com/.test(location.href)) {
  api.mapkey('ac', 'Copy word definition', () => {
    api.Hints.create(getElems('[id^=dictionary-entry-]'), async e => {
      let clip = '';
      console.log(e);
      let word = e.querySelector('.vg-header em').innerText;
      console.log(word);
      clip += word[0].toUpperCase() + word.slice(1) + ' #[[English Word]]\n';

      let def = e.querySelector('.vg .dtText').innerText;
      console.log(def);

      clip += '\t' + def + '\n';
      clip += '\t\t{{[[embed]]: [[<>]]}}\n';
      const src =
        document.querySelector('audio')?.src ||
        document.querySelector('source')?.src;
      if (src) clip += '\t{{audio: ' + src + '}}\n';
      clip += '\t' + location.href + '\n';

      clip += 'What is the meaning of ' + word + '? #[[sr]]\n';
      clip += '\t{{[[embed]]: }}\n';

      api.Clipboard.write(clip);
    });
  });
}

if (/dexonline\.ro/.test(location.href)) {
  api.mapkey('ac', 'Copy word definition from DEX', () => {
    api.Hints.create('.defWrapper', async e => {
      let clip = '';
      let word = e.querySelector('.def b').innerText;
      clip +=
        word[0].toUpperCase() +
        word.slice(1).toLowerCase() +
        ' #[[Romanian Word]]\n';
      clip += '\t' + e.querySelector('.def').innerText + '\n';
      clip += '\t\t' + '{{[[embed]]: [[<>]]}}' + '\n';
      clip +=
        '\t' +
        e.querySelector('.dropdown-menu > li:nth-child(2) > a').href +
        '\n';
      clip += 'Ce inseamna ' + word.toLowerCase() + '? #[[sr]]\n';
      clip += '\t{{[[embed]]: }}\n';

      api.Clipboard.write(clip);
      clip = '';
    });
  });
}

if (location.hostname === 'www.linkedin.com') {
  api.mapkey(`${leader}cs1`, 'Focus search results', () => {
    document
      .getElementsByClassName('jobs-search-results-list')[0]
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });

  api.mapkey(`${leader}cs2`, 'Focus search results', () => {
    document
      .getElementsByClassName('jobs-search__job-details--container')[0]
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
}

if (
  /stackoverflow\.com/.test(location.href) ||
  /stackexchange\.com/.test(location.href) ||
  location.href.startsWith('https://serverfault.com') ||
  location.href.startsWith('https://superuser.com') ||
  location.href.startsWith('https://askubuntu.com')
) {
  // mapkey('J', 'Next answer', () => {
  //
  // });

  addEventListener('DOMContentLoaded', () => {
    addUpDownBinds(
      [
        ...document.getElementsByClassName('answer'),
        ...document.getElementsByClassName('question'),
      ],
      document.getElementsByClassName('s-topbar')[0].getBoundingClientRect()
        .height,
    );
  });

  api.mapkey('ac', 'Copy answer', () => {
    api.Hints.create(getElems('.s-prose'), elem => {
      const page = window.prompt('Page name:', document.title);
      if (!page) return;
      let clip = '<ul><li><span>' + escapeHTML(`[[${page}]]`) + '</span><ul>';
      clip += parseDOMToRoam(elem, '');

      clip += '<li><h3>' + 'Source' + '</h3></li>';
      clip += '<li>' + location.href + '</li>';

      clip += '</ul></li>';
      clip += '</ul>';

      pasteToRoam(clip);
    });
  });
}

if (location.href.startsWith('https://www.imdb.com')) {
  api.mapkey('aa', 'Copy movie description', () => {
    let clip = '<ul>';
    clip += '<li><span>' + escapeHTML('[[<>]]') + '</span>';
    clip += '<ul>';

    clip +=
      '<li>' +
      escapeHTML(
        document.querySelector(
          '#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-c7f03a63-0.kUbSjY > section > div:nth-child(4) > section > section > div.sc-1cdfe45a-6.hwhwUO > div.sc-1cdfe45a-10.cuzXyh > div.sc-1cdfe45a-8.cuClcw > div.sc-16ede01-9.bbiYSi.sc-1cdfe45a-11.eVPKIU > div.sc-16ede01-7.hrgVKw > span.sc-16ede01-2.gXUyNh',
        ).innerText,
      ) +
      '</li>';
    clip +=
      '<li>' +
      escapeHTML(
        '![](' +
          document.querySelector("head > meta[property='og:image']").content +
          ')',
      ) +
      '</li>';
    console.log(clip);

    clip += '</li>';
    clip += '<li>' + location.href + '</li>';
    clip += '</ul>';
    setClipboard(clip);
    clip = '';
  });
}

if (location.href.startsWith('https://10fastfingers.com')) {
  setTimeout(() => {
    api.Hints.dispatchMouseClick(document.getElementsByTagName('input')[0]);
  }, 1000);
  api.mapkey('f', 'Reload 10fastfingers' + document.domain, () => {
    api.Hints.create(getElems('#reload-btn'), Hints.dispatchMouseClick);
  });
}

if (location.host === 'www.twitch.tv') {
  api.mapkey(`${leader}ga`, 'Go to all videos', () => {
    location.search = '?filter=all&sort=time';
  });

  mapAllClick(() => [...document.querySelectorAll('.tw-media-card-stat')]);

  api.mapkey(`${leader}sm`, 'Show more', () => {
    [...document.querySelectorAll('*')]
      .filter(e => e.textContent === 'Show More' && e.tagName === 'SPAN')[0]
      .click();
  });
}

if (location.href.includes('roamresearch.com/')) {
  api.mapkey(`${leader}t`, 'Test stuff in Roam', () => {
    api.insertJS(async () => {
      window.testHotReload();
    });
  });

  api.mapkey(`${leader}a`, 'Open article in sidebar', () => {
    api.insertJS(async () => {
      const UID = location.href.split('/').pop();
      roamAlphaAPI.ui.rightSidebar.addWindow({
        window: {
          type: 'block',
          'block-uid': UID,
        },
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (
    document.querySelector('[content="GitLab"]') ||
    location.host.includes('gitlab') ||
    document.title.includes('GitLab')
  )
    api.mapkey(`${leader}drg`, 'Download GitLab repository', () => {
      downloadGitHubRepo(location.origin + location.pathname);
    });
});
