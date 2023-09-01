import {
  pasteToRoam,
  getElems,
  escapeHTML,
  openSearchRoam,
  addUpDownBinds,
} from '../utils';
import { leader } from '../settings';
import { parseDOMToRoam } from '../domparser';

if (/wikipedia\.org/.test(location.href)) {
  window.addEventListener('DOMContentLoaded', () => {
    addUpDownBinds(
      [...document.querySelectorAll('#content :where(h1, h2, h3, h4)')],
      20,
    );
  });

  api.mapkey('ai', 'Copy image link on Wikipedia', () => {
    api.Hints.create(getElems('img'), element => {
      let link = element.src;
      if (/thumb/.test(link)) {
        link = link.replace(/thumb\//g, '').replace(/\/[^\/]*?$/g, '');
      }

      api.Clipboard.write('![](' + link + ')');
      api.Front.showBanner('Copied link to clipboard');
    });
  });

  api.mapkey(`${leader}t`, 'Open in Roam', async () => {
    openSearchRoam(document.querySelector('#firstHeading').textContent);
  });

  api.mapkey(`${leader}yT`, 'Copy article title in Wikipedia', async () => {
    api.Clipboard.write(document.querySelector('#firstHeading').textContent);
  });

  api.mapkey('gs', 'What links here', () => {
    location.assign(
      location.origin +
        '/wiki/Special:WhatLinksHere/' +
        location.href.split('/').pop(),
    );
  });

  api.mapkey('gr', 'Go to references', () => {
    document.querySelector('#References').scrollIntoView(true);
  });

  api.mapkey('aa', 'Wikipedia to Roam', () => {
    wikipediaToRoam(location.href);
  });

  api.mapkey('aA', 'Wikipedia to Roam', async () => {
    chrome.runtime.sendMessage(
      browserSyncID,
      {
        actionType: 'fetchWikipedia',
        query: location.href,
      },
      async message => {
        console.log('first here');
        const dom = new DOMParser().parseFromString(message.resp, 'text/html');
        const paragraphs = [];
        let elem = dom.querySelector(
          '#mw-content-text > .mw-parser-output > p',
        );
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
          originLocation: location,
        });
        clip += '<li>{{[[iframe]]: ' + message.url + '}}</li>';
        clip += '</ul></li>';
        clip += '</ul>';
        pasteToRoam(clip);
        api.Front.showBanner('Sent Wikipedia page to Roam.');
      },
    );
  });

  api.mapkey(`${leader}a`, 'Wikipedia whole content', () => {
    api.Hints.create(getElems('#mw-content-text .mw-parser-output'), e => {
      const firstHead = document.querySelector('.mw-first-heading');
      const page = window.prompt('Page: ', firstHead.textContent.toTitleCase());
      if (!page) return;
      let clip =
        '<ul><li><span>' + escapeHTML('[[' + page + ']]') + '</span><ul>';

      const url = location.href;
      clip += '<li><span>' + url + '</span></li>';
      clip += '<li><span>{{[[iframe]]: ' + url + '}}</span></li>';

      clip += parseDOMToRoam(
        e,
        'style, .mw-empty-elt, .shortdescription, .hatnote, .sistersitebox, .plainlinks, .infobox, .sidebar, .navbox-inner, .sistersitebox, .metadata > table',
      );

      clip += '<li><h3>' + 'Source' + '</h3></li>';
      clip += '<li>' + location.href + '</li>';

      clip += '</ul></li>';
      [
        ...document
          .getElementById('mw-normal-catlinks')
          .getElementsByTagName('li'),
      ].forEach(e => {
        clip += `<li>#[[child page]] [[${e.textContent}]] [[${firstHead.textContent}]]</li>`;
        clip += `<li><span>[[${e.textContent}]]</span><ul><li>${
          e.querySelector('a').href
        }</li></ul></li>`;
      });
      clip += '</ul>';

      pasteToRoam(clip);
      api.Front.showBanner('Sent Wikipedia page to Roam.');
    });
  });
}

if (/wiktionary\.org/.test(location.href)) {
  let clip = '';
  api.mapkey('ac', 'Go to references', () => {
    api.Hints.create(getElems('#Etymology'), hintElem => {
      const header = hintElem.closest('h3');

      let elem = header.nextElementSibling;
      clip += 'Etymology\n';
      while (elem.tagName !== 'H3') {
        clip += '\t' + elem.innerText.trim() + '\n';
        elem = elem.nextElementSibling;
      }

      api.Clipboard.write(clip);
    });
  });
}
