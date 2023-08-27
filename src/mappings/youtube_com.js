import { mapAllClick } from '../utils';
import { leader } from '../settings';

if (location.hostname === 'www.youtube.com') {
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      textContent: `#movie_player {
          overflow: visible;
        }`,
    }),
  );

  api.mapkey('\\', 'Play or pause', () => {
    let video = document
      .getElementById('player')
      .getElementsByTagName('video')[0];
    if (!video) {
      video = document.getElementsByTagName('video')[0];
    }
    if (video.paused) video.play();
    else video.pause();
  });

  mapAllClick(() => [...document.querySelectorAll('#content #video-title')]);

  api.mapkey(`${leader}pl`, 'Add current video to the Music playlist', () => {
    document.querySelector('[aria-label="Save to playlist"]').click();

    window.setTimeout(() => {
      document.querySelector('[title="Infinite Loop"]').click();
      window.setTimeout(() => {
        document.body.click();
      }, 500);
    }, 1000);
  });

  api.mapkey(`${leader}pm`, 'Add current video to the Music playlist', () => {
    document.querySelector('[aria-label="Save to playlist"]').click();

    window.setTimeout(() => {
      document.querySelector('[aria-label="Music Private"]').click();
      window.setTimeout(() => {
        document.body.click();
      }, 50);
    }, 1000);
  });

  api.mapkey(`${leader}pm`, 'Add current video to the Music playlist', () => {
    document.querySelector('[aria-label="Save to playlist"]').click();

    window.setTimeout(() => {
      document.querySelector('[aria-label="Music Private"]').click();
      window.setTimeout(() => {
        document.body.click();
      }, 50);
    }, 1000);
  });

  api.mapkey(leader + 'of', 'Open first YouTube video', () => {
    document.querySelector('#video-title-link').click();
  });

  api.mapkey(leader + 'ov', 'Open YouTube video', () => {
    api.Hints.create(
      getElems('#video-title-link'),
      elem => {
        elem.click();
      },
      {
        multipleHits: false,
      },
    );
  });

  api.mapkey('J', 'Scroll up comments in YouTube', () => {
    document.querySelector('#columns>#secondary').scrollTop +=
      window.innerHeight * 0.9;
  });

  api.mapkey('K', 'Scroll down comments in YouTube', () => {
    document.querySelector('#columns>#secondary').scrollTop -=
      window.innerHeight * 0.9;
  });

  api.mapkey('<Space>fc', 'Expand commens on Youtube', () => {
    api.Hints.create(
      getElems('#more-replies'),
      elem => {
        elem.click();
      },
      {
        multipleHits: false,
      },
    );
  });

  api.mapkey(leader + 'gc', 'Go to the youtube channel', () => {
    document.querySelector('ytd-video-owner-renderer #img').click();
  });

  api.mapkey(leader + 'gv', 'Go to all videos', () => {
    location.href =
      document.querySelector('ytd-video-owner-renderer a[href^="/c/"]').href +
      '/videos?view=57';
  });

  api.mapkey('<Space>gt', 'Show transcripts', () => {
    document.querySelector('[aria-label="More actions"]').click();
    window.setTimeout(() => {
      [...document.querySelectorAll('.ytd-menu-service-item-renderer')]
        .filter(e => e.innerText == 'Show transcript')[0]
        .click();
    }, 100);
  });

  api.mapkey('gc', 'Go to the the chanel page', () => {
    location.href =
      'https://www.youtube.com/channel/' +
      document.querySelector('[itemprop="channelId"]').content;
  });

  api.mapkey('gn', 'Show the notifications', () => {
    document
      .querySelector('#button .ytd-notification-topbar-button-renderer')
      .click();
  });

  api.mapkey('gf', 'Show filters', () => {
    api.Hints.dispatchMouseClick(
      document.querySelector('#text.style-scope.ytd-toggle-button-renderer'),
    );
  });
  api.mapkey('gs', 'Search the channel', () => {
    api.Hints.dispatchMouseClick(
      document.querySelector(
        '.ytd-c4-tabbed-header-renderer [icon="yt-icons:search"]',
      ),
    );
  });

  api.mapkey('gv', 'Go to All Videos', () => {
    location.href =
      'https://www.youtube.com/channel/' +
      document.querySelector('[itemprop="channelId"]').content +
      '/videos';
  });

  api.mapkey('gs', 'Search Youtbue', () => {
    location.href =
      'https://www.youtube.com/channel/' +
      document.querySelector('[itemprop="channelId"]').content +
      '/search?query=';
  });

  api.mapkey('aa', 'Copy info for embedding in Roam Research', () => {
    let title = document.querySelector(
      'h1.ytd-video-primary-info-renderer > yt-formatted-string',
    ).innerText;
    let channel = document.querySelector(
      '.ytd-video-owner-renderer a,.ytd-channel-renderer .ytd-channel-name',
    ).innerText;

    let clip = '';
    clip += title + ' ' + channel + ' [[Youtube Video]]\n';
    clip += '\t{{[[video]]:' + window.location.href + '}}\n';
    clip += '\t\t[[Video Notes]]\n';
    clip += '\t\t\t[[Old Video Notes]]\n';
    clip += '\t\t\t[[<>]]\n';

    api.Clipboard.write(clip);
  });

  api.mapkey('ar', 'Copy info for embedding in Roam Research', () => {
    const title = document.querySelector(
      'h1.ytd-video-primary-info-renderer > yt-formatted-string',
    ).innerText;
    const channel = document.querySelector(
      '.ytd-video-owner-renderer a,.ytd-channel-renderer .ytd-channel-name',
    ).innerText;

    api.Clipboard.write(
      title + '\n\t' + channel + '\n\t{{[[video]]: ' + location.href + '}}',
    );
  });

  api.mapkey('yA', 'Copy title', async () => {
    const title = document.querySelector(
      'h1.ytd-video-primary-info-renderer > yt-formatted-string',
    ).innerText;
    api.Clipboard.write(title);
  });

  api.mapkey('ac', 'Copy title', async () => {
    const channel = document.querySelector(
      '.ytd-video-owner-renderer a,.ytd-channel-renderer .ytd-channel-name',
    ).innerText;
    api.Clipboard.write(channel);
  });

  if (parent[0]) {
    window.onmessage = event => {
      switch (event.data.actionType) {
        case 'selectVideo':
          let video = document.querySelector('video');
          video.focus();
          break;
      }
    };

    api.mapkey('<Alt-q>', 'Focus parent', () => {
      parent.focus();
      parent.postMessage(
        {
          actionType: 'focusFromYoutube',
        },
        '*',
      );
    });
  }
}

if (location.href.startsWith('https://www.youtube.com/shorts/')) {
  api.mapkey('\\', 'Play or pause', () => {
    const video = document.getElementById('0').getElementsByTagName('video')[0];
    if (video.paused) video.play();
    else video.pause();
  });
}
