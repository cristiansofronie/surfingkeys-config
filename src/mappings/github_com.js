import { pasteToRoam, downloadGitHubRepo, openSrc, addUpDownBinds } from '../utils';
import { leader } from '../settings';

if (location.hostname === 'github.com') {
  addEventListener('DOMContentLoaded', () => {
    addUpDownBinds(
      [...document.getElementsByClassName('TimelineItem')],
      document.getElementsByTagName('header')[0].getBoundingClientRect().height,
    );
  });

  api.mapkey(`${leader}${leader}ga`, 'Copy Github repo name', () => {
    api.Clipboard.write(location.pathname.split('/').slice(1, 3).join('/'));
  });

  api.mapkey(`${leader}ga`, 'Go to the author page', () => {
    document.querySelector('.author a').click();
  });

  api.mapkey('yf', 'Copy iframe of given Github page', () => {
    let clip = '';
    clip += '<ul><li><span>' + escapeHTML('[[<>]]') + '</span><ul>';

    // clip += '<li>{{[[iframe]]: ' + escapeHTML('https://web.archive.org/' + location.href) + '}}</li>'
    clip += '<li>{{[[iframe]]: ' + escapeHTML(location.href) + '}}</li>';
    clip += '<li>' + escapeHTML(location.href) + '</li>';

    clip += '</ul></li>';
    clip += '</ul>';
    setClipboard(clip);
  });

  api.mapkey(`${leader}a`, 'Copy GitHub', () => {
    api.Hints.create(getElems('.markdown-body'), e => {
      const firstHead = document.querySelector('.markdown-body h1:first-child');
      let clip =
        '<ul><li><span>' +
        escapeHTML(firstHead?.innerText || '[[<>]]') +
        '</span><ul>';
      clip += parseDOMToRoam(e);
      clip += '<li>' + location.href + '</li>';
      clip += '<li>{{[[iframe]]: ' + escapeHTML(location.href) + '}}</li>';
      clip += '</ul></li>';
      clip += '</ul>';

      pasteToRoam(clip);
      api.Front.showBanner('Sent Wikipedia page to Roam.');
      // setClipboard(clip);
    });
  });

  api.mapkey('gr', 'Go to repo page', () => {
    api.Hints.create(
      '#repository-container-header strong a',
      api.Hints.dispatchMouseClick,
    );
  });

  api.mapkey(`${leader}drg`, 'Download GitHub Repository', () => {
    downloadGitHubRepo(location.href);
  });

  api.mapkey(`${leader}ss`, 'Search source for current repo', () => {
    const repo = location.pathname.split('/').at(2);
    openSrc(repo);
  });
}
