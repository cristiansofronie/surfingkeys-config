import { leader } from '../settings';

if (location.host === 'twitter.com') {
  const style = document.createElement('style');
  style.textContent = `
    [aria-label="New posts are available. Push the period key to go to the them."] {
      display: none;
    }
  `;
  document.body.prepend(style);

  api.mapkey(`${leader}t`, 'Copy tweet', () => {
    api.Hints.create([...document.querySelectorAll('time')], elem => {
      api.Clipboard.write(elem.closest('[href]').href);
    });
  });

  api.mapkey(`${leader}f`, 'Click tweet', () => {
    api.Hints.create(
      [...document.querySelectorAll('[data-testid="tweetText"]')],
      elem => {
        api.Hints.dispatchMouseClick(elem);
      },
    );
  });

  api.mapkey(`${leader}i`, 'Like tweet', () => {
    api.Hints.create(
      [...document.querySelectorAll('[aria-label*="Like"]')],
      elem => {
        elem.click();
      },
    );
  });

  api.mapkey('j', 'Go to next tweet', () => {
    ['keydown', 'keyup', 'keypress'].forEach(event => {
      document.activeElement.dispatchEvent(
        new KeyboardEvent(event, {
          bubbles: true,
          cancellable: true,
          keyCode: 74,
          which: 74,
          code: 'KeyJ',
          key: 'j',
        }),
      );
    });
  });

  api.mapkey('k', 'Go to previous tweet', () => {
    ['keydown', 'keyup', 'keypress'].forEach(event => {
      document.activeElement.dispatchEvent(
        new KeyboardEvent(event, {
          bubbles: true,
          cancellable: true,
          keyCode: 75,
          which: 75,
          code: 'KeyK',
          key: 'k',
        }),
      );
    });
  });
}
