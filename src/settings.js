export const leader = '<Space>';

export const setSettings = () => {
  settings.omnibarMaxResults = 30;
  settings.useNeovim = false;
  settings.textAnchorPat = /(^[\n\r\s]*\S+|\b\S+)/g;
  settings.pageUrlRegex = [/(https:\/\/[^\s]+?\/?)(\d+)(\/[^\s]+\/?)/];
  settings.clickableSelector =
    '*.def, *.ddef_block, *.def-block, *.roam-block, *.rm-block-ref, *.rm-title-display';
  settings.hintAlign = 'left';
  settings.nextLinkRegex = /((>>|next|Add highlight)+)/i;
  settings.smoothScroll = true;
  settings.modeAfterYank = 'Normal';
  settings.omnibarHistoryCacheSize = 100;
  settings.richHintsForKeystroke = 100;
  settings.historyMUOrder = false;
  settings.defaultSearchEngine = 'gg';

  settings.theme = `
    .sk_theme {
      background: #100a14dd;
      color: #4f97d7;
    }
    .sk_theme tbody {
      color: #292d;
    }
    .sk_theme input {
      color: #d9dce0;
    }
    .sk_theme .url {
      color: #2d9574;
    }
    .sk_theme .annotation {
      color: #a31db1;
    }
    .sk_theme .omnibar_highlight {
      color: #333;
      background: #ffff00aa;
    }
    .sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
      background: #5d4d7a55;
    }
    .sk_theme #sk_omnibarSearchResult ul li.focused {
      background: #5d4d7aaa;
    }
    .sk_theme #sk_omnibarSearchResult .omnibar_folder {
      color: #a31db1;
    }
    #sk_omnibar {
      max-height: 98vh;
      width: 98vw;
      top: 1%;
      left: 1%;
    }
    #sk_omnibarSearchResult {
      max-height: 90vh;
    }
  `;

  api.Hints.setCharacters('asdfgqwertzxcvbnmyuiop');
};
