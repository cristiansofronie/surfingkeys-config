import { leader } from '../settings'
import { parseDOMToRoam } from '../domparser';
import { escapeHTML, pasteToRoam } from '../utils';

if (location.hostname === 'wiki.archlinux.org') {
  api.mapkey(`${leader}a`, 'Archlinux whole content', () => {
    api.Hints.create(getElems('.mw-parser-output'), e => {
      const firstHead = document.querySelector('#firstHeading');
      let clip =
        '<ul><li><span>' +
        escapeHTML(
          '[[' +
            firstHead.innerText
              .match(/^[^()]*/)[0]
              .trim()
              .toTitleCase() +
            ']]',
        ) +
        '</span><ul>';

      clip += parseDOMToRoam(e);

      clip += '<li><h3>' + 'Source' + '</h3></li>';
      clip += '<li>' + location.href + '</li>';

      clip += '</ul></li>';
      clip += '</ul>';

      pasteToRoam(clip);
      api.Front.showBanner('Sent Wikipedia page to Roam.');
    });
  });
}
