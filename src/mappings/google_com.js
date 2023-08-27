import { getElems } from '../utils';
import { leader } from '../settings';

const toggleGoogleMasonry = () => {
  let style = document.getElementById('google-masonry');
  if (style) style.remove();
  else {
    style = document.createElement('style');
    style.id = 'google-masonry';
    style.textContent = `
      .CvDJxb {top: 0px !important}
      *, #cnt {padding: 0; !important}
      #result-stats, #appbar, #pTwnEc {display: none;}
      #tsf > div:nth-child(1), #tsf > div:nth-child(1) > div.A8SBwf, input, #tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc, #tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div, #tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb {
        width: 100%;
      }
      #fbar {background: transparent;}
      #center_col {margin: 0;}
      .v7W49e {
          display: flex;
          flex-direction: column;
          height: 100vh;
          flex-wrap: wrap;
      }
      #rso > div, .jtfYYd, .g {
          width: 320px !important;
          overflow: hidden !important;
          height: fit-content !important;
      }
      .g * {
          flex-direction: column !important;
      }
      ::-webkit-scrollbar, #rhs {display: none;}
      em {color: red !important;}
      a:visited {color: red;}
    `;
    document.head.prepend(style);
  }
};

if (/google\.com\/search.*tbm=isch/.test(location.href)) {
  api.mapkey('q', 'Click images', () => {
    api.Hints.create(getElems('#islrg img'), Hints.dispatchMouseClick);
  });

  api.mapkey('Q', 'Click first image', () => {
    api.Hints.dispatchMouseClick(document.querySelector('#islrg img'));
  });
}

if (/google\.com\/maps/.test(location.href)) {
  api.mapkey('zo', 'Zoom out', () => {
    api.Hints.dispatchMouseClick(document.querySelector('#widget-zoom-out'));
  });

  api.mapkey('zi', 'Zoom out', () => {
    api.Hints.dispatchMouseClick(document.querySelector('#widget-zoom-in'));
  });
}

if (location.href.startsWith('https://www.google.com/search')) {
  api.mapkey('gi', 'Focus the first input', () => {
    const input = document.getElementsByTagName('textarea')[0];
    if (input) {
      api.Hints.dispatchMouseClick(input);
    }
  });

  api.mapkey(
    `${leader}t`,
    'Toggle msonry layout on Google',
    toggleGoogleMasonry,
  );
  toggleGoogleMasonry();

  api.mapkey(leader + 'of', 'Open first Google result', () => {
    document.querySelector('#search h3').click();
  });

  setTimeout(() => document.querySelector('button#L2AGLb')?.click(), 500);

  // Automatically add e mark for search
  const mark = {
    url: window.location.href,
    scrollLeft: document.scrollingElement.scrollLeft,
    scrollTop: document.scrollingElement.scrollTop,
  };
  api.RUNTIME('addVIMark', {
    mark: {
      e: mark,
    },
  });

  api.mapkey('l', 'Scroll to right one full screen', () => {
    document.documentElement.scrollLeft += window.innerWidth;
  });

  api.mapkey('h', 'Scroll to right one full screen', () => {
    document.documentElement.scrollLeft -= window.innerWidth;
  });

  api.imapkey('<Ctrl-e>', 'Search current suggestion in new tag', () => {
    const query = document.querySelector('input').value;

    api.RUNTIME('openLink', {
      tab: {
        tabbed: true,
        active: false,
      },
      url: 'https://www.google.com/search?q=' + encodeURIComponent(query),
    });
  });

  window.addEventListener('focus', async () => {
    const url = document.querySelector('input').value;
    let prefix;

    if (url === 'google') {
      prefix = 'https://www.google.com/search?q=';
    } else if (url === 'wikipedia') {
      prefix = 'https://en.wikipedia.org/wiki/Special:Search?search=';
    }

    if (prefix) {
      api.Clipboard.read(resp => {
        let clip = resp.data;
        if (clip !== window.lastClip) {
          RUNTIME('openLink', {
            tab: {
              tabbed: true,
              active: true,
            },
            url: prefix + encodeURIComponent(clip),
          });
        }
      });
    }
  });

  window.addEventListener('blur', async () => {
    api.Clipboard.read(resp => {
      let clip = resp.data;
      window.lastClip = clip;
    });
  });

  api.mapkey('gp', 'Click', async () => {
    await document.querySelector('audio').play();
  });

  api.mapkey('ac', 'Copy word definition', () => {
    api.Hints.create(getElems('.eQJLDd .sY7ric span'), async e => {
      let word = document
        .querySelector('.c8d6zd > span')
        .innerText.replace(/·/g, '');
      tmp += word[0].toUpperCase() + word.slice(1) + ' #[[English Word]]\n';

      tmp += '\t' + e.innerText[0].toUpperCase() + e.innerText.slice(1) + '\n';
      tmp += '\t\t{{[[embed]]: [[<>]]}}\n';
      const src =
        document.querySelector('audio').src ||
        document.querySelector('source').src;
      tmp += '\t{{audio: ' + src + '}}\n';
      tmp += '\t' + location.href + '\n';

      tmp += 'What is the meaning of ' + word + '? #[[sr]]\n';
      tmp += '\t{{[[embed]]: }}\n';

      api.Clipboard.write(tmp);
      tmp = '';
    });
  });
}
