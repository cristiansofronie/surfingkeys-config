import { getElems, UIGuard, textRange, getVisibleElems } from './utils';
import { leader } from './settings';

if (location.host === 'roampdf.web.app') {
  window.addEventListener('blur', () => {
    document.querySelector('body').style.outline = '';
  });

  window.addEventListener('focus', () => {
    document.querySelector('body').style.outline = '20px solid red';
  });

  api.mapkey(`${leader}pc`, 'Search for Roam pages', async () => {
    const str = await textRange(/\w+/g, /\w+/g);
    parent.postMessage(
      {
        actionType: 'searchInRoamTitles',
        str,
      },
      '*',
    );
  });

  api.mapkey(`${leader}sv`, 'Scroll line to the top', () => {
    let elems = [...document.getElementsByTagName('span')].sort(
      (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
    );

    elems = elems.filter(e => {
      const top = e.getBoundingClientRect().top;
      return top >= 0 && top <= window.innerHeight;
    });

    let i = 0;
    while (i < elems.length - 1) {
      if (
        elems[i + 1].getBoundingClientRect().top -
          elems[i].getBoundingClientRect().top <
        20
      ) {
        elems.splice(i + 1, 1);
      } else {
        i++;
      }
    }
    api.Hints.create(elems, elem => {
      elem.scrollIntoView(true);
    });
  });

  api.mapkey('gh', 'Highlight selection in last block', () => {
    let sele = document.getSelection().toString();
    parent.postMessage(
      {
        actionType: 'highLastHi',
        seleTxt: sele,
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  api.mapkey('gr', 'Highlight selection in last block', () => {
    let sele = document.getSelection().toString();
    parent.postMessage(
      {
        actionType: 'addMeta',
        seleTxt: sele,
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  // api.mapkey('gT', 'Go to table of contents', () => {
  //   parent.postMessage({
  //     actionType: 'goTblCont',
  //   }, '*');
  // });

  api.mapkey('gv', 'Scroll last block to top', () => {
    parent.postMessage(
      {
        actionType: 'scrollToTopLastBlk',
      },
      '*',
    );
  });

  api.mapkey('<F2>', 'Toggle timer', () => {
    parent.postMessage(
      {
        actionType: 'toggleTimer',
      },
      '*',
    );
  });

  api.mapkey('gH', 'Go to last highlight', () => {
    parent.postMessage(
      {
        actionType: 'focusPdfHigh',
      },
      '*',
    );
  });

  api.mapkey('<Alt-q>', 'Focus parent', () => {
    parent.focus();
    parent.postMessage(
      {
        actionType: 'focus',
      },
      '*',
    );
  });

  api.mapkey('<Alt-Q>', 'Focus parent', () => {
    parent.postMessage({ actionType: 'focusSecondToLastHighGroup' }, '*');
  });

  api.mapkey('ge', 'Escape last', () => {
    parent.postMessage(
      {
        actionType: 'escapeLast',
      },
      '*',
    );
  });

  // api.mapkey('gm', 'More left', () => {
  //   parent.postMessage({
  //     actionType: 'moreLeft'
  //   }, '*');
  // });

  api.mapkey('gl', 'Hover highlight', () => {
    api.Hints.create(
      getElems('.ColorfulAreaHighlight, .Highlight__part'),
      elem => {
        elem.dispatchEvent(
          new Event('mouseover', {
            bubbles: true,
          }),
        );
      },
      {
        multipleHits: false,
      },
    );
  });

  api.mapkey('gx', 'Remove highlight', () => {
    const observer = new MutationObserver(mList => {
      observer.disconnect();
      mList[0].addedNodes[0].querySelector('button.remove').dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      );
      window.getSelection().removeAllRanges();
      document.querySelector('[touch-action]').dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      );
    });
    observer.observe(document.querySelector('.PdfHighlighter'), {
      childList: true,
    });

    api.Hints.create(
      getElems('.ColorfulAreaHighlight, .Highlight__part'),
      elem => {
        elem.dispatchEvent(
          new Event('mouseover', {
            bubbles: true,
          }),
        );
      },
      {
        multipleHits: false,
      },
    );
  });

  api.mapkey('gu', 'Word usage', async () => {
    const sele = await textRange(/\w+/g, /\w+/g);
    await addWordUsageQueue();
    await makeHighs();
    parent.postMessage(
      {
        actionType: 'wordUsage',
        seleTxt: sele,
      },
      '*',
    );
    parent.postMessage(
      {
        actionType: 'nestHigh',
      },
      '*',
    );
  });

  // api.mapkey('gt', 'Nest with tag', () => {
  //   parent.postMessage({
  //     actionType: 'nestWithTag',
  //   }, '*');
  //   window.getSelection().removeAllRanges();
  //   document.querySelector('[touch-action]').dispatchEvent(new Event('pointerdown', {
  //     bubbles: true
  //   }));
  // });

  api.mapkey('gS', 'Selection as header', () => {
    let sele = document.getSelection().toString().trim().replace(/ {2,}/g, ' ');
    parent.postMessage(
      {
        actionType: 'seleHead',
        seleTxt: sele,
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  api.mapkey('gs', 'Selection as header smartly', () => {
    let sele = document.getSelection().toString().trim().replace(/ {2,}/g, ' ');
    parent.postMessage(
      {
        actionType: 'seleHeadSmart',
        seleTxt: sele,
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  const addNewHeaderTag = () => {
    let sele = document.getSelection().toString().trim().replace(/ {2,}/g, ' ');
    parent.postMessage(
      {
        actionType: 'addNewTag',
        seleTxt: sele,
      },
      '*',
    );
  };

  api.mapkey('gA', 'Add new header tag', addNewHeaderTag);
  api.vmapkey('gA', 'Add new header tag', addNewHeaderTag);

  const addHeaderSmart = () => {
    const sele = document
      .getSelection()
      .toString()
      .trim()
      .replace(/ {2,}/g, ' ')
      .replace(/s|es|,$/, '')
      .trim()
      .toTitleCase();
    parent.postMessage(
      {
        actionType: 'smartAddNewTag',
        seleTxt: sele,
      },
      '*',
    );
  };

  api.mapkey('ga', 'Add new header tag in a smart way', addHeaderSmart);
  api.vmapkey('ga', 'Add new header tag in a smart way', addHeaderSmart);

  // api.mapkey('gP', 'Pop pane', () => {
  //   parent.postMessage(
  //     {
  //       actionType: 'popPane',
  //     },
  //     '*',
  //   );
  // });

  api.mapkey('gn', 'Nest PDF Highlights', () => {
    parent.postMessage(
      {
        actionType: 'nestHigh',
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  api.mapkey('gN', 'Nest PDF Highlights', () => {
    parent.postMessage(
      {
        actionType: 'nestHighUnderPrevGroup',
      },
      '*',
    );
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  api.mapkey('q', 'Highlight selection', () => {
    const tip = document.querySelector('.Tip__compact');
    api.Hints.dispatchMouseClick(tip);

    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]').dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  });

  api.mapkey('zi', 'Zoom in', () => {
    api.Hints.dispatchMouseClick(document.querySelector('#zoom-in'));
  });

  var range = document.createRange();

  api.mapkey('C', 'Automation highlight making', () => {
    seleQueue = [];
  });

  // let lastMouseMove = {
  //   target: null,
  //   pageX: -1,
  //   pageY: -1,
  //   clientX: -1,
  //   clientY: -1
  // };

  // document.addEventListener('pointermove', (e) => {
  //   lastMouseMove.target = e.target;
  //   lastMouseMove.pageX = e.pageX;
  //   lastMouseMove.pageY = e.pageY;
  //   lastMouseMove.clientX = e.clientX;
  //   lastMouseMove.clientY = e.clientY;
  // });

  let seleQueue = [];

  const createAreaHints = () => {
    document.querySelectorAll('.page').forEach(e => {
      const r = e.getBoundingClientRect();
      if (
        (r.bottom >= 0 && r.bottom <= window.innerHeight) ||
        (r.top >= 0 && r.top <= window.innerHeight) ||
        (r.top < 0 && r.bottom > 0)
      ) {
        const currTextLayer = e;
        const hintsWrapper = document.createElement('div');
        hintsWrapper.className = 'touchrm-hints-wrapper';
        hintsWrapper.attachShadow({
          mode: 'open',
        });

        const hintsStyle = document.createElement('style');
        hintsStyle.innerHTML = `
          section div {
            position: absolute;
            z-index: 9999999;
            background-color: black;
            width: 10px;
            height: 10px;
          }

          section {
            height: 100%;
            width: 100%;
          }
        `;
        hintsWrapper.shadowRoot.appendChild(hintsStyle);
        hintsWrapper.style.width = '100%';
        hintsWrapper.style.height = '100%';

        currTextLayer.appendChild(hintsWrapper);

        const holder = document.createElement('section');
        holder.innerHTML = '';

        const page = currTextLayer.getBoundingClientRect();

        for (let y = 0; y <= page.height; y += 25) {
          const hint1 = document.createElement('div');
          const hint2 = document.createElement('div');

          // hint1.style.left = page.left + 'px';
          hint1.style.left = 0 + 'px';
          hint1.style.top = y + 'px';

          // hint2.style.left = page.right + 'px';
          hint2.style.right = 0 + 'px';
          hint2.style.top = y + 'px';

          holder.appendChild(hint1);
          holder.appendChild(hint2);
        }
        const hint1 = document.createElement('div');
        const hint2 = document.createElement('div');

        // hint1.style.left = page.left + 'px';
        hint1.style.left = 0 + 'px';
        hint1.style.top = page.height + 'px';

        // hint2.style.left = page.right + 'px';
        hint2.style.right = 0 + 'px';
        hint2.style.top = page.height + 'px';

        holder.appendChild(hint1);
        holder.appendChild(hint2);

        hintsWrapper.shadowRoot.appendChild(holder);
      }
    });
  };

  const createAreaHigh = (downEvent, upEvent, target, currentScroll) => {
    return new Promise((resolve, reject) => {
      const pdfHighlighter = document.querySelector('.PdfHighlighter');
      const observer = new MutationObserver(async mList => {
        observer.disconnect();
        const tip = mList[0].addedNodes[0].querySelector('.Tip__compact');
        tip.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
          }),
        );

        window.getSelection().removeAllRanges();
        const touchAction = document.querySelector('[touch-action]');
        touchAction?.dispatchEvent(
          new Event('pointerdown', {
            bubbles: true,
          }),
        );
        target.dispatchEvent(
          new Event('mousedown', {
            bubbles: true,
          }),
        );

        pdfHighlighter.scrollTop = currentScroll;

        function handleAddedReceived(event) {
          if (event.data.actionType === 'addedReceived') {
            console.log('addedReceived');
            window.removeEventListener('message', handleAddedReceived);
            resolve();
          }
        }
        window.addEventListener('message', handleAddedReceived);
      });
      observer.observe(document.querySelector('.PdfHighlighter'), {
        childList: true,
      });

      pdfHighlighter.scrollTop = downEvent.scroll;
      target.dispatchEvent(downEvent.event);
      pdfHighlighter.scrollTop = upEvent.scroll;
      target.dispatchEvent(upEvent.event);
    });
  };

  const createHigh = (endElem, startElem) => {
    return new Promise((resolve, reject) => {
      const range = document.createRange();
      range.setEnd(endElem.elem, 1);

      const observer = new MutationObserver(async mList => {
        observer.disconnect();
        const tip = mList[0].addedNodes[0].querySelector('.Tip__compact');
        tip.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
          }),
        );

        window.getSelection().removeAllRanges();
        document.querySelector('[touch-action]').dispatchEvent(
          new Event('pointerdown', {
            bubbles: true,
          }),
        );

        function handleAddedReceived(event) {
          if (event.data.actionType === 'addedReceived') {
            console.log('addedReceived');
            window.removeEventListener('message', handleAddedReceived);
            resolve();
          }
        }
        window.addEventListener('message', handleAddedReceived);
      });
      observer.observe(document.querySelector('.PdfHighlighter'), {
        childList: true,
      });

      range.setStart(startElem.elem, 0);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  };

  async function makeHighs() {
    const localSeleQueue = seleQueue;
    seleQueue = [];

    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]')?.dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );

    document.querySelectorAll('.selected').forEach(elem => {
      elem.style.outline = '';
      elem.classList.remove('selected');
    });

    document.querySelectorAll('.touchrm-hints-wrapper').forEach(e => {
      e.remove();
    });

    for (let i = 0; i < localSeleQueue.length; i += 2) {
      if (localSeleQueue[i].type === 'text')
        await createHigh(localSeleQueue[i + 1], localSeleQueue[i]);
      else {
        const pdfHighlighter = document.querySelector('.PdfHighlighter');
        const currentScroll = pdfHighlighter.scrollTop;
        await createAreaHigh(
          localSeleQueue[i],
          localSeleQueue[i + 1],
          localSeleQueue[i].target,
          currentScroll,
        );
      }
    }
  }

  api.mapkey('T', 'Make selections', async () => {
    UIGuard(
      () =>
        new Promise(async (resolve, reject) => {
          await makeHighs();

          resolve();
          setTimeout(() => {
            parent.postMessage(
              {
                actionType: 'nestHighUnderPrevGroup',
              },
              '*',
            );
          });
        }),
      '',
    );
  });

  // api.mapkey('gt', 'Make selections', async () => {
  //   await makeHighs();

  //   setTimeout(() => {
  //     parent.postMessage({
  //       actionType: 'nestPartHigh'
  //     }, '*');
  //   });
  // });

  api.mapkey('gq', 'Fast single highlight', async () => {
    await addSeleQueueTwice();
    await makeHighs();
    setTimeout(() => {
      parent.postMessage(
        {
          actionType: 'nestHigh',
        },
        '*',
      );
      window.getSelection().removeAllRanges();
      document.querySelector('[touch-action]')?.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      );
    });
  });

  api.mapkey('gM', 'Fast highlight', async () => {
    await addSeleQueuePromise();
    await addSeleQueuePromise();
    await makeHighs();
    setTimeout(() => {
      parent.postMessage(
        {
          actionType: 'nestHigh',
        },
        '*',
      );
      window.getSelection().removeAllRanges();
      document.querySelector('[touch-action]')?.dispatchEvent(
        new Event('pointerdown', {
          bubbles: true,
        }),
      );
    });
  });

  api.mapkey('gm', 'Set mark', async () => {
    await addSeleQueueTwice();
    await makeHighs();

    setTimeout(() => {
      parent.postMessage(
        {
          actionType: 'moveMarkMeta',
        },
        '*',
      );
    });
  });

  function removeSelection() {
    window.getSelection().removeAllRanges();
    document.querySelector('[touch-action]')?.dispatchEvent(
      new Event('pointerdown', {
        bubbles: true,
      }),
    );
  }

  // api.mapkey('<Space>sc', 'Search Cambridge Dictionary', async () => {
  //   const txt = await textRange(/\w+/g, /\w+/g);
  //   prevSearchQuery = txt;
  //   searchCambridge(txt);
  //   searchRoam(txt.replace(/(s|ed|es)$/g, '') + ' english word');
  // });

  // api.mapkey('gw', 'Word usage highlight', async () => {
  //   await addWordUsageQueue();
  //   await makeHighs();
  //   setTimeout(() => {
  //     parent.postMessage({
  //       actionType: 'nestHigh'
  //     }, '*');
  //     removeSelection();
  //   });
  // });

  api.mapkey('gt', 'Scroll to highlight', async () => {
    setTimeout(() => {
      parent.postMessage(
        {
          actionType: 'scrollToHigh',
        },
        '*',
      );
    });
  });

  api.mapkey('t', 'Make selections', async () => {
    UIGuard(
      () =>
        new Promise(async (resolve, reject) => {
          await makeHighs();

          resolve();
          setTimeout(() => {
            parent.postMessage(
              {
                actionType: 'nestHigh',
              },
              '*',
            );
          });
        }),
      '',
    );
  });

  api.mapkey('gT', 'Make selections', () => {
    makeHighs();
  });

  const handleSeleQueueElem = elem => {
    if (elem.matches('.textLayer span')) {
      if (elem.classList.contains('selected'))
        elem.style.outline = 'solid gray';
      else {
        elem.style.outline = 'solid black';
        elem.classList.add('selected');
      }
      seleQueue.push({
        type: 'text',
        elem: elem,
      });
    } else {
      elem.classList.add('area-high');
      const lastElem = seleQueue[seleQueue.length - 1];
      const elemCoords = elem.getBoundingClientRect();

      if (
        seleQueue.length == 0 ||
        lastElem.type === 'text' ||
        lastElem.eventType === 'mouseup'
      ) {
        seleQueue.push({
          elem: elem,
          type: 'area',
          scroll: document.querySelector('.PdfHighlighter').scrollTop,
          eventType: 'mousedown',
          target: elem
            .getRootNode()
            .host.closest('.page')
            .querySelector('.textLayer'),
          event: new MouseEvent('mousedown', {
            bubbles: true,
            altKey: true,
            pageX: elemCoords.x,
            pageY: elemCoords.y,
            clientX: elemCoords.x,
            clientY: elemCoords.y,
          }),
        });
      } else {
        seleQueue.push({
          elem: elem,
          type: 'area',
          scroll: document.querySelector('.PdfHighlighter').scrollTop,
          eventType: 'mouseup',
          event: new MouseEvent('mouseup', {
            bubbles: true,
            altKey: true,
            pageX: elemCoords.x + 10,
            pageY: elemCoords.y,
            clientX: elemCoords.x + 10,
            clientY: elemCoords.y,
          }),
        });
      }
    }
  };

  const addSeleQueue = () => {
    createAreaHints();

    const getAreaEnds = () => {
      return [...document.querySelectorAll('.touchrm-hints-wrapper')].reduce(
        (prev, curr) => {
          return prev.concat(
            ...curr.shadowRoot.querySelectorAll('section div'),
          );
        },
        [],
      );
    };

    const getHighEnds = () => {
      const highEnds = [];
      highEnds.push(...document.querySelectorAll('.textLayer span'));
      highEnds.push(...getAreaEnds());

      return highEnds;
    };

    const observer = new MutationObserver(mList => {
      if (mList[0]?.removedNodes?.[0]?.matches('.surfingkeys_hints_host')) {
        getAreaEnds().forEach(e => {
          if (!e.classList.contains('area-high')) {
            e.remove();
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
    });

    api.Hints.create(getHighEnds(), handleSeleQueueElem);
  };

  const addSeleQeueMulti = () => {
    createAreaHints();

    const getAreaEnds = () => {
      return [...document.querySelectorAll('.touchrm-hints-wrapper')].reduce(
        (prev, curr) => {
          return prev.concat(
            ...curr.shadowRoot.querySelectorAll('section div'),
          );
        },
        [],
      );
    };

    const getHighEnds = () => {
      const highEnds = [];
      highEnds.push(...document.querySelectorAll('.textLayer span'));
      highEnds.push(...getAreaEnds());

      return highEnds;
    };

    const observer = new MutationObserver(mList => {
      if (mList[0]?.removedNodes?.[0]?.matches('.surfingkeys_hints_host')) {
        getAreaEnds().forEach(e => {
          if (!e.classList.contains('area-high')) {
            e.remove();
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
    });

    api.Hints.create(getHighEnds(), handleSeleQueueElem);
  };

  const addSeleQueuePromise = () => {
    return new Promise((res, rej) => {
      createAreaHints();

      const getAreaEnds = () => {
        return [...document.querySelectorAll('.touchrm-hints-wrapper')].reduce(
          (prev, curr) => {
            return prev.concat(
              ...curr.shadowRoot.querySelectorAll('section div'),
            );
          },
          [],
        );
      };

      const getHighEnds = () => {
        const highEnds = [];
        highEnds.push(...document.querySelectorAll('.textLayer span'));
        highEnds.push(...getAreaEnds());

        return highEnds;
      };

      const observer = new MutationObserver(mList => {
        if (mList[0]?.removedNodes?.[0]?.matches('.surfingkeys_hints_host')) {
          getAreaEnds().forEach(e => {
            if (!e.classList.contains('area-high')) {
              e.remove();
            }
          });
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
      });

      api.Hints.create(getHighEnds(), elem => {
        handleSeleQueueElem(elem);
        setTimeout(res, 100);
      });
    });
  };

  const addWordUsageQueue = async () => {
    createAreaHints();

    const getAreaEnds = () => {
      return [...document.querySelectorAll('.touchrm-hints-wrapper')].reduce(
        (prev, curr) => {
          return prev.concat(
            ...curr.shadowRoot.querySelectorAll('section div'),
          );
        },
        [],
      );
    };

    const getHighEnds = () => {
      const highEnds = [];
      highEnds.push(...document.querySelectorAll('.textLayer span'));
      highEnds.push(...getAreaEnds());

      return highEnds;
    };

    const observer = new MutationObserver(mList => {
      if (mList[0]?.removedNodes?.[0]?.matches('.surfingkeys_hints_host')) {
        getAreaEnds().forEach(e => {
          if (!e.classList.contains('area-high')) {
            e.remove();
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
    });

    await hintsPromise(getHighEnds(), elem => {
      handleSeleQueueElem(
        elem.previousElementSibling?.previousElementSibling ||
          elem.previousElementSibling,
      );
      handleSeleQueueElem(
        elem.nextElementSibling?.nextElementSibling || elem.nextElementSibling,
      );
    });
  };

  const addSeleQueueTwice = async () => {
    createAreaHints();

    const getAreaEnds = () => {
      return [...document.querySelectorAll('.touchrm-hints-wrapper')].reduce(
        (prev, curr) => {
          return prev.concat(
            ...curr.shadowRoot.querySelectorAll('section div'),
          );
        },
        [],
      );
    };

    const getHighEnds = () => {
      const highEnds = [];
      highEnds.push(...document.querySelectorAll('.textLayer span'));
      highEnds.push(...getAreaEnds());

      return highEnds;
    };

    const observer = new MutationObserver(mList => {
      if (mList[0]?.removedNodes?.[0]?.matches('.surfingkeys_hints_host')) {
        getAreaEnds().forEach(e => {
          if (!e.classList.contains('area-high')) {
            e.remove();
          }
        });
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
    });

    await hintsPromise(getHighEnds(), elem => {
      handleSeleQueueElem(elem);
      handleSeleQueueElem(elem);
    });
  };

  api.mapkey('f', 'Add selection to queue', addSeleQueue);
  api.mapkey('gf', 'Add selection to queue', addSeleQueueTwice);

  const isNewLineSpan = (span, medianLineHeight) => {
    if (
      span.previousElementSibling &&
      span.previousElementSibling.tagName === 'SPAN'
    ) {
      const diff = Math.floor(
        parseFloat(span.style.top) -
          parseFloat(span.previousElementSibling.style.top),
      );
      console.log('diff', diff, medianLineHeight);
      if (diff > medianLineHeight * 0.9) return true;
      return false;
    } else {
      console.log('First elem is a new line starter');
      return true;
    }
  };

  const getParaLimits = () => {
    const paras = [];
    getVisibleElems(document.querySelectorAll('.textLayer')).forEach(
      txtLayer => {
        const limit = 10;
        const elems = [...txtLayer.querySelectorAll('span')].sort(
          (a, b) => parseFloat(a.style.top) - parseFloat(b.style.top) + limit
        );

        const lineHeights = elems.map(e => e.getBoundingClientRect().height);

        const medianLineHeight =
          lineHeights[Math.floor(lineHeights.length / 2)];

        const leftRightSortedElems = elems
          .slice()
          .sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));

        const mostLeftElem = leftRightSortedElems[0];
        console.log('mostLeftElem', mostLeftElem);

        const lineStarts = leftRightSortedElems.filter(e =>
          isNewLineSpan(e, medianLineHeight),
        );

        console.log(
          'lineStarts',
          lineStarts
            .slice()
            .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top))
            .map(e => e.textContent),
        );

        const firstParaStart = lineStarts.find(
          e =>
            Math.abs(
              parseFloat(e.style.left) - parseFloat(mostLeftElem.style.left),
            ) > limit,
        );
        console.log('firstParaStart', firstParaStart);

        let paraStartElems = new Set();

        lineStarts.sort(
          (a, b) => parseFloat(a.style.top) - parseFloat(b.style.top),
        );

        lineStarts.forEach((e, i, arr) => {
          if (i === 0) {
            paraStartElems.add(arr[0]);
          } else if (
            Math.abs(
              parseFloat(arr[i].style.left) - parseFloat(arr[i - 1].style.left),
            ) > limit
          ) {
            if (firstParaStart) {
              if (
                !(
                  Math.abs(
                    parseFloat(firstParaStart.style.left) -
                      parseFloat(arr[i - 1].style.left),
                  ) < limit &&
                  Math.abs(
                    parseFloat(mostLeftElem.style.left) -
                      parseFloat(arr[i].style.left),
                  ) < limit
                )
              ) {
                paraStartElems.add(arr[i]);
              }
            }
          }
        });

        paraStartElems = [...paraStartElems].sort(
          (a, b) => parseFloat(a.style.top) - parseFloat(b.style.top),
        );

        console.log(
          'paraStartElems',
          paraStartElems.map(e => e.textContent),
        );

        paraStartElems.forEach((e, i, arr) => {
          paras.push(e);

          if (i + 1 < arr.length) {
            paras.push(arr[i + 1].previousElementSibling);
          } else {
            paras.push(elems.at(-1));
          }
        });
      },
    );

    return paras;
  };

  const getParaLimitsForPage = txtLayer => {
    const paras = [];
    const limit = 10;
    const elems = [...txtLayer.querySelectorAll('span')];

    const lineHeights = elems.map(e => e.getBoundingClientRect().height);

    const medianLineHeight = lineHeights[Math.floor(lineHeights.length / 2)];

    const leftRightSortedElems = elems
      .slice()
      .sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left));

    const mostLeftElem = leftRightSortedElems[0];
    console.log('mostLeftElem', mostLeftElem);

    const lineStarts = leftRightSortedElems.filter(e =>
      isNewLineSpan(e, medianLineHeight),
    );

    console.log(
      'lineStarts',
      lineStarts
        .slice()
        .sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top))
        .map(e => e.textContent),
    );

    const firstParaStart = lineStarts.find(
      e =>
        Math.abs(
          parseFloat(e.style.left) - parseFloat(mostLeftElem.style.left),
        ) > limit,
    );
    console.log('firstParaStart', firstParaStart);

    let paraStartElems = new Set();

    lineStarts.sort(
      (a, b) => parseFloat(a.style.top) - parseFloat(b.style.top),
    );

    lineStarts.forEach((e, i, arr) => {
      if (i === 0) {
        paraStartElems.add(arr[0]);
      } else if (
        Math.abs(
          parseFloat(arr[i].style.left) - parseFloat(arr[i - 1].style.left),
        ) > limit
      ) {
        if (firstParaStart) {
          if (
            !(
              Math.abs(
                parseFloat(firstParaStart.style.left) -
                  parseFloat(arr[i - 1].style.left),
              ) < limit &&
              Math.abs(
                parseFloat(mostLeftElem.style.left) -
                  parseFloat(arr[i].style.left),
              ) < limit
            )
          ) {
            paraStartElems.add(arr[i]);
          }
        }
      }
    });

    paraStartElems = [...paraStartElems].sort(
      (a, b) => parseFloat(a.style.top) - parseFloat(b.style.top),
    );

    console.log(
      'paraStartElems',
      paraStartElems.map(e => e.textContent),
    );

    paraStartElems.forEach((e, i, arr) => {
      paras.push(e);

      if (i + 1 < arr.length) {
        paras.push(arr[i + 1].previousElementSibling);
      } else {
        paras.push(elems.at(-1));
      }
    });

    return paras;
  };

  const addParaQueue = () => {
    const paras = getParaLimits();
    api.Hints.create(
      paras.filter((e, i) => i % 2 == 0),
      elem => {
        // console.log(elem);
        handleSeleQueueElem(elem);
        const paraEnd = paras[paras.findIndex(e => e === elem) + 1];
        // console.log(paraEnd);
        handleSeleQueueElem(paraEnd);
      },
    );
  };

  const addMultiParaQueue = () => {
    api.Hints.create(
      getParaLimits().filter((e, i) => i % 2 == 0),
      elem => {
        const paras = getParaLimits();
        // console.log(elem);
        handleSeleQueueElem(elem);
        const paraEnd = paras[paras.findIndex(e => e === elem) + 1];
        // console.log(paraEnd);
        handleSeleQueueElem(paraEnd);
      },
      {
        multipleHits: true,
      },
    );
  };

  const addAllPagesParas = () => {
    api.Hints.create([...document.querySelectorAll('.textLayer')], elem => {
      const paras = getParaLimitsForPage(elem);
      for (let i = 0; i < paras.length - 1; i += 2) {
        handleSeleQueueElem(paras[i]);
        handleSeleQueueElem(paras[i + 1]);
      }
    });
  };

  api.mapkey('gp', 'Add paragraph to queue', addParaQueue);

  api.mapkey('gP', 'Add muliple paragraphs to queue', addMultiParaQueue);

  api.mapkey(
    `${leader}gp`,
    'Add all the paragraphs on page to queue',
    addAllPagesParas,
  );

  api.mapkey('R', 'Clear selection queue', async () => {
    seleQueue = [];
    document.querySelectorAll('.selected').forEach(elem => {
      elem.style.outline = '';
      elem.classList.remove('selected');
    });
  });

  api.mapkey('r', 'Clear selection queue', async () => {
    const lstElem = seleQueue.pop();

    if (lstElem.type === 'text') {
      lstElem.elem.style.outline = '';
      lstElem.elem.classList.remove('selected');
    } else {
      lstElem.elem.remove();
    }
  });

  api.mapkey('gr', 'Remove hints', () => {
    document.querySelectorAll('.touchrm-hints-wrapper').forEach(e => {
      e.remove();
    });
  });

  api.mapkey('zo', 'Zoom out', () => {
    api.Hints.dispatchMouseClick(document.querySelector('#zoom-out'));
  });

  api.mapkey('o', 'Open block', () => {
    api.Hints.create(getElems('.Highlight__part'), elem => {
      elem.dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
        }),
      );
      document.querySelector('button.openBlock').dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
        }),
      );
    });
  });

  api.mapkey('gi', 'Highlight block', () => {
    api.Hints.dispatchMouseClick(document.querySelector('button.hl-col2'));
  });

  api.mapkey('x', 'Remove highlight', () => {
    api.Hints.dispatchMouseClick(document.querySelector('button.remove'));
  });

  api.mapkey('c', 'Copy ref', () => {
    api.Hints.dispatchMouseClick(document.querySelector('button.copyBlockRf'));
  });
}
