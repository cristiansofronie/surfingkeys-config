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
        let word = elem.closest('.entry-body').getElementsByClassName('di-title')[0].textContent;
        word = word[0].toUpperCase() + word.slice(1);

        let clip = '<ul><li><span>' + word + ' #[[English Word]]</span><ul>';
        clip += parseDOMToRoam(elem, '.dwl');
        clip += `<li>${escapeHTML(location.href)}</li>`
        clip += '</ul></li>';

        clip += '</ul>';

        console.log(clip);
        pasteToRoam(clip);
      },
    );
  });

  // api.mapkey(
  //   'ac',
  //   'Copy the definition of a word/phrase from Cambridge Dictionary',
  //   () => {
  //     api.Hints.create('*.def-block', element => {
  //       let wordDef = element.querySelector('.def').innerText;
  //       wordDef = wordDef.charAt(0).toUpperCase() + wordDef.slice(1);
  //       wordDef = wordDef.replace(/:/gm, '');
  //       let wordUsages = element.querySelectorAll('.def-body .examp');
  //       let allUsages = '';
  //       if (wordUsages !== null)
  //         for (let i = 0; i < wordUsages.length; i = i + 1) {
  //           usage = wordUsages[i].innerText;
  //           usage = usage.charAt(0).toUpperCase() + usage.slice(1);
  //           usage = usage.replace(/\./gm, '');
  //           allUsages += usage;
  //           if (i < wordUsages.length - 1) allUsages += '\n\t\t';
  //         }
  //       let entry =
  //         element.closest('.entry') || element.closest('.idiom-block');
  //       let wordAudio = entry.querySelector('.us source');
  //       if (wordAudio !== null) wordAudio = '{{audio: ' + wordAudio.src + '}}';
  //       else wordAudio = '';
  //       let wordTitle = '';
  //       let phrase = element.closest('.phrase-block');
  //       if (phrase !== null)
  //         wordTitle = phrase.querySelector('.phrase-head > span').innerText;
  //       else wordTitle = entry.querySelector('.di-title').innerText;

  //       const word = wordTitle;
  //       // let wordHref = "[^](" + window.location.href + ")";
  //       let actWordTitle =
  //         wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1);
  //       wordTitle =
  //         wordTitle.charAt(0).toUpperCase() +
  //         wordTitle.slice(1) +
  //         ' #[[English Word]]';
  //       let finalTxt = '';
  //       let image = element.querySelector('img');
  //       if (image !== null) {
  //         image = image.src;
  //         image = image.replace(/\/thumb\//g, '/full/');
  //         image = '![](' + image + ')';
  //         finalTxt =
  //           wordTitle +
  //           '\n' +
  //           '\t' +
  //           wordDef +
  //           '\n' +
  //           '\t\t' +
  //           '{{[[embed]]: [[<>]]}}\n' +
  //           '\t\t' +
  //           allUsages +
  //           '\n' +
  //           '\t\t' +
  //           wordAudio +
  //           '\n' +
  //           '\t\tImage' +
  //           '\n' +
  //           '\t\t\t' +
  //           image +
  //           '\n' +
  //           'What is the meaning of ' +
  //           word +
  //           '? #[[sr]]\n' +
  //           '\t{{[[embed]]: }}\n';
  //       } else {
  //         finalTxt =
  //           wordTitle +
  //           '\n' +
  //           '\t' +
  //           wordDef +
  //           '\n' +
  //           '\t\t' +
  //           '{{[[embed]]: [[<>]]}}\n' +
  //           '\t\t' +
  //           allUsages +
  //           '\n' +
  //           '\t\t' +
  //           wordAudio +
  //           '\n' +
  //           'What is the meaning of ' +
  //           word +
  //           '? #[[sr]]\n' +
  //           '\t{{[[embed]]: }}\n';
  //       }

  //       api.Clipboard.write(finalTxt);
  //     });
  //   },
  // );
}
