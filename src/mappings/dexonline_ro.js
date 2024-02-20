import { leader } from './../settings';
import { escapeHTML, pasteToRoam, removeAccents } from '../utils';
import { parseDOMToRoam } from '../domparser';

if (location.hostname === 'dexonline.ro') {
  api.mapkey('ac', 'Copy word def', () => {
    api.Hints.create([...document.getElementsByClassName('def')], elem => {
      let word = removeAccents(document.getElementsByTagName('input')[0].value);

      word = word[0].toUpperCase() + word.slice(1);

      let clip = '<ul><li><span>[[' + word + ' Romanian Word]]</span><ul>';
      clip += parseDOMToRoam(elem);
      clip += `<li>${escapeHTML(location.href)}</li>`;
      clip += '</ul></li>';

      clip += '</ul>';

      pasteToRoam(clip);
      api.Front.showBanner('Sent to Roam');
    });
  });
}
