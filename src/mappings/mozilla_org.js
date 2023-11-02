import { getElems, pasteToRoam, setClipboard, escapeHTML } from '../utils';
import { parseDOMToRoam } from '../domparser';
import { leader } from '../settings';

if (location.host === 'developer.mozilla.org') {
  api.mapkey(`${leader}a`, 'Copy whole article in Mozilla', () => {
    api.Hints.create(getElems('article'), e => {
      const prefix = location.pathname.split('/').slice(3, 5).join(' ');

      const firstHead = document.querySelector('.main-page-content h1');
      const page = window.prompt('Page name:', firstHead.innerText.toTitleCase());
      if (!page) return;

      let clip =
        '<ul><li><span>' + escapeHTML(`[[${prefix} ${page}]]`) + '</span><ul>';
      clip += '<li>' + location.href + '</li>';
      clip += '<li>{{[[iframe]]: ' + location.href + '}}</li>';
      clip += parseDOMToRoam(e, '.bc-table');
      clip += '</ul></li>';
      clip += '</ul>';
      clip += `<li>#[[child page]] [[${prefix} ${escapeHTML(
        [...document.querySelectorAll('.breadcrumb')].at(-1).textContent,
      )}]] [[${prefix} ${escapeHTML(firstHead.textContent)}]]</li>`;

      pasteToRoam(clip);
      api.Front.showBanner('Sent MDN page to Roam.');
    });
  });

  api.mapkey(leader + '[[', 'Go to parent page', () => {
    [...document.querySelectorAll('.breadcrumb')].at(-1).click();
  });

  api.mapkey('aa', 'Copy summary from MDN', () => {
    let clip = '';

    clip += '<ul>';

    clip += '<li>';

    const firstHead = document.querySelector(
      '.main-page-content > h1:first-child',
    );
    clip += '<span>' + escapeHTML(firstHead.innerText) + '</span>';

    clip += '<ul>';
    [...firstHead.nextElementSibling.children].forEach(e => {
      if (e.tagName === 'P') clip += '<li>' + escapeHTML(e.innerText) + '</li>';
    });

    if (document.querySelector('#syntax + div pre')) {
      clip +=
        '<span><pre><code>```javascript\n' +
        escapeHTML(document.querySelector('#syntax + div pre').innerText) +
        '```</code></pre></span>';
    }

    const dList = document.querySelector('#parameters + div dl');
    if (dList) {
      clip += '<li>';

      [...dList.children].forEach(e => {
        if (e.tagName === 'DT') {
          clip += '<li>';

          clip += '<span>' + escapeHTML(e.innerText) + '<span>';

          clip += '<ul>';
        } else if (e.tagName === 'DD') {
          e.querySelectorAll('dd > p').forEach(elem => {
            clip += '<li>' + escapeHTML(elem.innerText) + '</li>';
          });

          clip += '</ul>';
          clip += '</li>';
        }
      });

      clip += '</li>';
    }

    clip += '<li><span>' + window.location.href + '</span></li>';

    clip += '</ul>';
    clip += '</li>';
    clip += '</ul>';
    setClipboard(clip);
  });
}
