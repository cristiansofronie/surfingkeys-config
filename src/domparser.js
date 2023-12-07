import { escapeHTML } from './utils';

const resolveHref = (e, originLocation = location) => {
  let href = e.getAttribute('href') || location.href;
  if (href.startsWith('/')) {
    href = originLocation.origin + href;
  } else if (href.startsWith('#')) {
    const tmpHref = new URL(originLocation.href);
    tmpHref.hash = href;
    href = tmpHref.href;
  }
  return href;
};

const parseElemChildren = (e, filterQuery, props) => {
  return [...e.childNodes]
    .map(elem => parseDOMToRoam(elem, filterQuery, props))
    .join('');
};

export const parseDOMToRoam = (
  e,
  filterQuery,
  props = {
    originLocation: location,
  },
) => {
  if (Array.isArray(e)) {
    return e.reduce(
      (prev, curr) => prev + parseDOMToRoam(curr, filterQuery, props),
      '',
    );
  }

  if (e.nodeType === 1 && filterQuery && e.matches(filterQuery)) {
    return '';
  }

  switch (e.nodeName) {
    case '#text':
      if (/^\n\s+$/.test(e.nodeValue)) return '';
      return escapeHTML(e.nodeValue.replace(/\n\s*/g, ''));
    case 'AUL':
    case 'SUB':
    case 'Aundefined':
    case 'Atitle':
    case 'svg':
    case 'path':
    case 'TIME':
    case 'SMALL':
    case 'TITLE':
    case 'SUP':
    case 'SCRIBE-SHADOW':
    case 'LABEL':
    case 'INPUT':
      return parseElemChildren(e, filterQuery, props);
    case 'HEADER':
    case 'ASIDE':
    case 'NAV':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'HTML':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'FORM':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'FOOTER':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'BUTTON':
      return parseElemChildren(e, filterQuery, props);
    case 'ABBR':
      return parseElemChildren(e, filterQuery, props);
    case 'CAPTION':
      return parseElemChildren(e, filterQuery, props);
    case 'P':
      // Added here for man pages
      if (
        e.matches('[style*="margin-left:11%;"]') ||
        e.matches('[style="margin-top: 1em"]')
      ) {
        return (
          '<li><h3>' + parseElemChildren(e, filterQuery, props) + '</h3></li>'
        );
      }
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'FONT':
      return '`' + parseElemChildren(e, filterQuery, props) + '`';
    case 'HR':
      return '<li>---' + escapeHTML(e.innerText) + '</li>';
    case 'BLOCKQUOTE':
      return '<li>&gt ' + escapeHTML(e.innerText) + '</li>';
    case 'CODE':
      return '`' + parseElemChildren(e, filterQuery, props) + '`';
    case 'KBD':
      return parseElemChildren(e, filterQuery, props);
    case 'SPAN':
      return parseElemChildren(e, filterQuery, props);
    case 'STRONG':
      return '**' + parseElemChildren(e, filterQuery, props) + '**';
    case 'B':
      return '**' + parseElemChildren(e, filterQuery, props) + '**';
    case 'EM':
      return '__' + parseElemChildren(e, filterQuery, props) + '__';
    case 'I':
      return '__' + parseElemChildren(e, filterQuery, props) + '__';
    case 'BR':
      return '\n';
    case 'A':
      if (!e.querySelector('img')) {
        if (e.innerText)
          return (
            '[' +
            parseElemChildren(e, filterQuery, props).replace(/\[|\]/g, '') +
            '](' +
            resolveHref(e, props.originLocation)
              .replace(/\(/g, '%28')
              .replace(/\)/g, '%29') +
            ')'
          );
        else
          return resolveHref(e, props.originLocation)
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29');
      } else {
        return '![](' + e.querySelector('img').src + ')';
      }
    // case 'IFRAME':
    //   return '<li>' + escapeHTML('{{[[iframe]]: ' + e.src + '}}') + '</li>';
    case 'VIDEO':
      return '<li>' + escapeHTML('{{[[video]]:' + e.src + '}}') + '</li>';
    case 'math':
      return '$$' + escapeHTML(e.getAttribute('alttext')) + '$$';
    case 'IMG':
      if (e.matches('.mwe-math-fallback-image-inline')) return '';
      return '<li>' + escapeHTML('![](' + e.src + ')') + '</li>';
    case 'H1':
      return (
        '<li><h1>' + parseElemChildren(e, filterQuery, props) + '</h1></li>'
      );
    case 'H2':
      return (
        '<li><h2>' + parseElemChildren(e, filterQuery, props) + '</h2></li>'
      );
    case 'H3':
      return (
        '<li><h3>' + parseElemChildren(e, filterQuery, props) + '</h3></li>'
      );
    case 'H4':
      return (
        '<li><h4>' + parseElemChildren(e, filterQuery, props) + '</h4></li>'
      );
    case 'PRE':
      return (
        '<li><pre>```javascript\n' + escapeHTML(e.innerText) + '```<pre></li>'
      );
    case 'UL':
      return '<ul>' + parseElemChildren(e, filterQuery, props) + '</ul>';
    case 'OL':
      return '<ul>' + parseElemChildren(e, filterQuery, props) + '</ul>';
    case 'DL':
      return '<ul>' + parseElemChildren(e, filterQuery, props) + '</ul>';
    case 'DT':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'DD':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'SUMMARY':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'BODY':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'LI':
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
    case 'MARK':
      return parseElemChildren(e, filterQuery, props);
    case 'DETAILS':
      return parseElemChildren(e, filterQuery, props);
    case 'BDI':
      return parseElemChildren(e, filterQuery, props);
    case 'CITE':
      return parseElemChildren(e, filterQuery, props);
    case 'DIV':
      return '<li>' + parseElemChildren(e, filterQuery, props).trim() + '</li>';
    case 'FIGURE':
      return parseElemChildren(e, filterQuery, props);
    case 'MAIN':
      return parseElemChildren(e, filterQuery, props);
    case 'HR':
      return '';
    case 'SECTION':
      return parseElemChildren(e, filterQuery, props);
    case 'STYLE':
      return '';
    case 'META':
      return '';
    case 'LINK':
      return '';
    case 'SCRIPT':
      return '';
    case 'BODY':
      return parseElemChildren(e, filterQuery, props);
    case 'ARTICLE':
      return parseElemChildren(e, filterQuery, props);
    case 'TABLE':
      return '';

      // return (
        // '<li><span>{{[[table]]}}</span><ul>' +
        // parseElemChildren(e, filterQuery, props) +
      //   '</ul></li>'
      // );
    case 'TFOOT':
      return parseElemChildren(e, filterQuery, props);
    case 'TBODY':
      return parseElemChildren(e, filterQuery, props);
    case 'THEAD':
      return parseElemChildren(e, filterQuery, props);
    case 'TR':
      return (
        parseElemChildren(e, filterQuery, props) +
        '</ul></li>'.repeat(
          e.querySelectorAll(':scope > td,:scope > th').length,
        )
      );
    case 'TD':
      if (!e.innerText) return '<li><span>' + ' ' + '</span><ul>';
      return (
        '<li><span>' + parseElemChildren(e, filterQuery, props) + '</span><ul>'
      );
    case 'TH':
      return (
        '<li><span>' + parseElemChildren(e, filterQuery, props) + '</span><ul>'
      );
    default:
      return '<li>' + parseElemChildren(e, filterQuery, props) + '</li>';
  }
};
