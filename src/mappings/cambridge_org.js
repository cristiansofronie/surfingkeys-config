import { escapeHTML, pasteToRoam } from '../utils';
import { parseDOMToRoam } from '../domparser';

if (location.hostname === 'dictionary.cambridge.org') {
  api.mapkey('gp', 'Hear pronounciation', () => {
    api.Hints.create('.us.dpron-i .i-volume-up', Hints.dispatchMouseClick);
  });

  api.mapkey('au', 'Copy all word usage examples', () => {
    let examples = '';
    [...document.querySelectorAll('span.deg')].forEach(e => {
      examples += '- ' + e.innerText + '\n';
    });
    api.Clipboard.write(examples);
  });

  api.mapkey('yA', 'Copy current word', () => {
    api.Clipboard.write(document.querySelector('.headword > .hw').innerText);
  });

  api.mapkey('ac', 'Copy word def', () => {
    api.Hints.create(
      [...document.getElementsByClassName('def-block')],
      elem => {
        let word = elem
          .closest('.entry-body')
          .getElementsByClassName('di-title')[0].textContent;
        word = word[0].toUpperCase() + word.slice(1);

        let clip = '<ul><li><span>[[' + word + ' English Word]]</span><ul>';
        clip += parseDOMToRoam(elem, '.dwl');
        clip += `<li>${escapeHTML(location.href)}</li>`;
        clip += '</ul></li>';

        clip += '</ul>';

        console.log(clip);
        pasteToRoam(clip);
      },
    );
  });
}
