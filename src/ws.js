const PORT = 8181;
window.wsOpen = false;

export const connectSock = () => {
  window.ws = new WebSocket(`ws://localhost:${PORT}`);
  window.ws.onopen = () => {
    window.wsOpen = false;
  };

  window.ws.onmessage = async e => {
    const res = JSON.parse(e.data);
    if (res.actionType === 'openTabInSearchWindow') {
      console.log('openTabInSearchWindow', res);
      if (window.searchWindow) {
        console.log('openLink', res.link);
        api.RUNTIME('openLink', {
          tab: {
            tabbed: true,
            active: true,
          },
          url: res.link,
        });
      }
    } else if (res.actionType === 'searchWithChatGPT') {
      document.querySelector('textarea').value = res.query;
      [...document.querySelectorAll('form > div > div > button')]
        .at(-1)
        .click();
    }
  };

  window.ws.onclose = () => {
    wsOpen = false;
    setTimeout(connectSock, 1000);
  };
  window.ws.onerror = () => {};
};
