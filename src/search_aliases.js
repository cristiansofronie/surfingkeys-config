import { leader } from './settings';

api.unmap('sG');
api.unmap('sg');

api.removeSearchAlias('e');
api.removeSearchAlias('y');
api.removeSearchAlias('s');
api.removeSearchAlias('g');
api.removeSearchAlias('b');
api.removeSearchAlias('d');
api.removeSearchAlias('w');

const handleYoutubeSuggestions = resp => {
  const res = JSON.parse(resp.text.substr(9, resp.text.length - 10));
  return res[1].map(d => d[0]);
};

const googleSuggestion = resp => {
  const res = JSON.parse(resp.text);
  return res[1];
};

api.addSearchAlias(
  'k',
  'Wikipedia',
  'https://en.wikipedia.org/wiki/Special:Search?search=',
  's',
  'https://en.wikipedia.org/w/api.php?action=opensearch&search=',
  resp => {
    const res = JSON.parse(resp.text);
    return res[1];
  },
);
api.addSearchAlias(
  'ub',
  'Github',
  'https://github.com/search?q=',
  's',
  'https://api.github.com/search/repositories?q={0}&per_page=10',
  resp => {
    const res = JSON.parse(resp.text);
    console.log(resp.text);
    console.log(res.items.map(i => i.full_name));
    return res.items.map(i => i.full_name);
  },
);
api.addSearchAlias(
  'ut',
  'Github Topics',
  'https://github.com/search?q={0}&type=topics',
  's',
);
api.addSearchAlias(
  'ur',
  'Github Repos',
  'https://github.com/search?q={0}&type=repositories',
  's',
);
api.addSearchAlias(
  'ug',
  'Github Google search',
  'https://www.google.com/search?q=site%3Agithub.com+',
  's',
);
api.addSearchAlias(
  'ty',
  'TS',
  'https://www.google.com/search?q=site%3awww.typescriptlang.org+',
  's',
);
api.addSearchAlias(
  'bi',
  'Bible',
  'https://www.biblegateway.com/passage/?search={0}&version=NRSVUE',
  's',
);
api.addSearchAlias(
  'bs',
  'Bible',
  'https://www.biblegateway.com/quicksearch/?quicksearch={0}&version=NIV',
  's',
);
api.addSearchAlias(
  'ut',
  'Github Topics',
  'https://github.com/search?q={0}&type=topics',
  's',
);
api.addSearchAlias(
  'up',
  'Github Repos with Certain Package',
  'https://github.com/search?q="{0}"+in%3Apackage.json+language%3Atypescript&type=repositories',
  's',
);
api.addSearchAlias(
  'ur',
  'Github Repos',
  'https://github.com/search?q={0}&type=repositories',
  's',
);
api.addSearchAlias(
  'ug',
  'Github Goole Search',
  'https://www.google.com/search?q=site%3Agithub.com+',
  's',
);
api.addSearchAlias(
  'l',
  'Libre Genesis',
  'https://libgen.rs/search.php?req={0}&sort=year&sortmode=DESC&open=0&res=100&view=simple&column=def',
  's',
);
api.addSearchAlias(
  'ia',
  'Internet Archive',
  'https://archive.org/search.php?query=',
  's',
);
api.addSearchAlias(
  'bo',
  'Google Books',
  'https://www.google.com/search?q={0}&tbm=bks',
  's',
);
api.addSearchAlias(
  'gg',
  'Google',
  'https://www.google.com/search?q=',
  's',
  'https://www.google.com/complete/search?client=chrome-omni&gs_ri=chrome-ext&oit=1&cp=1&pgcl=7&q=',
  googleSuggestion,
);
api.addSearchAlias(
  'gi',
  'Google Images',
  'https://www.google.com/search?q={0}&tbm=isch',
  's',
  'https://www.google.com/complete/search?client=chrome-omni&gs_ri=chrome-ext&oit=1&cp=1&pgcl=7&q=',
  googleSuggestion,
);
api.addSearchAlias(
  'dd',
  'MDN Docs',
  'https://developer.mozilla.org/en-US/search?q=',
  's',
  'https://www.google.com/complete/search?client=chrome-omni&gs_ri=chrome-ext&oit=1&cp=1&pgcl=7&q=',
  googleSuggestion,
);
api.addSearchAlias(
  'dg',
  'Google Developer',
  'https://www.google.com/search?q=site%3Adeveloper.chrome.com+',
  's',
);
api.addSearchAlias(
  'dnd',
  'Node Docs',
  'https://www.google.com/search?q=site%3Anodejs.org+',
  's',
);
api.addSearchAlias(
  'a',
  'Ansible Docs',
  'https://www.google.com/search?q=site%3Adocs.ansible.com/ansible/latest+',
  's',
);
api.addSearchAlias(
  'dt',
  'TS Docs',
  'https://www.google.com/search?q=site%3Awww.typescriptlang.org+',
  's',
);
api.addSearchAlias(
  'dma',
  'Man Pages',
  'https://man.archlinux.org/search?q={0}&go=Go',
  's',
);
api.addSearchAlias(
  'gp',
  'Google Pronounce',
  'https://www.google.com/search?q=pronounce%20',
  's',
);
api.addSearchAlias(
  'c',
  'Cambridge Dicitonary',
  'https://dictionary.cambridge.org/dictionary/english/',
  's',
);
api.addSearchAlias(
  'wd',
  'Wiktionary',
  'https://en.wiktionary.org/w/index.php?search=',
  's',
);
api.addSearchAlias('sc', 'searchcode', 'https://searchcode.com/?q=', 's');

api.addSearchAlias(
  'gtr',
  'Translate English to Romanian',
  'https://translate.google.com/?sl=en&tl=ro&text={0}%0A&op=translate',
  's',
);

api.addSearchAlias(
  'gte',
  'Translate Romanian to English',
  'https://translate.google.com/?sl=ro&tl=en&text={0}%0A&op=translate',
  's',
);

api.addSearchAlias(
  'r',
  'Reverso',
  'https://www.reverso.net/text-translation#sl=eng&tl=rum&text=',
  's',
);
api.addSearchAlias(
  'n',
  'Google Dictionary',
  'https://www.google.com/search?q={0}%20meaning',
  's',
);
api.addSearchAlias(
  'di',
  'Google Dicitonary',
  'https://www.google.com/search?q=meaning%20',
  's',
);
api.addSearchAlias(
  'pi',
  'Piped',
  'https://piped.kavin.rocks/results?search_query=',
  's',
  'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=cb&q=',
  resp => {
    const res = JSON.parse(resp.text.substr(9, resp.text.length - 10));
    return res[1].map(d => d[0]);
  },
);
api.addSearchAlias(
  'yp',
  'Youtube playlist',
  'https://www.youtube.com/results?search_query={0}&sp=EgIQAw%253D%253D',
  's',
);
api.addSearchAlias(
  'yc',
  'Youtube channel',
  'https://www.youtube.com/results?search_query={0}&sp=EgIQAg%253D%253D',
  's',
);
api.addSearchAlias(
  'yd',
  'Youtube sorted by date',
  'https://www.youtube.com/results?search_query={0}&sp=CAI%253D',
  's',
);
api.addSearchAlias(
  'ys',
  'Youtube',
  'https://www.youtube.com/results?search_query=',
  's',
  'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=cb&q=',
  handleYoutubeSuggestions,
);
api.addSearchAlias(
  'dy',
  'Odysee',
  'https://odysee.com/$/search?q=',
  's',
  'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=cb&q=',
  handleYoutubeSuggestions,
);
api.addSearchAlias(
  'yt',
  'Youtube',
  'https://www.youtube.com/hashtag/',
  's',
  'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=cb&q=',
  handleYoutubeSuggestions,
);
api.addSearchAlias(
  'em',
  'Movies',
  'https://lookmovie2.to/movies/search/?q=',
  's',
);
api.addSearchAlias(
  'py',
  'Python Docs',
  'https://docs.python.org/3/search.html?q={0}&check_keywords=yes&area=default',
  's',
);
api.addSearchAlias(
  'de',
  'DEX',
  'https://dexonline.ro/definitie/{0}/definitii',
  's',
);
// api.addSearchAlias('o', 'readthedocs', 'https://readthedocs.org/search/?q=', 's');
api.addSearchAlias(
  '..',
  'Same Site Search',
  'https://www.google.com/search?q=site%3a' + location.host + '+',
  's',
);
api.addSearchAlias(
  '.h',
  'Same HREF Search',
  'https://www.google.com/search?q=site%3a' + location.href + '+',
  's',
);
api.addSearchAlias(
  '.m',
  'Same Site Search Last Month',
  'https://www.google.com/search?q=site%3a' + location.host + '+{0}&tbs=qdr:m',
  's',
);
api.addSearchAlias(
  '.y',
  'Same Site Search Last Year',
  'https://www.google.com/search?q=site%3a' + location.host + '+{0}&tbs=qdr:y',
  's',
);
api.addSearchAlias(
  '/',
  'Search in Current Page/Folder',
  'https://www.google.com/search?q=site%3a' +
    location.origin +
    location.pathname +
    '+',
  's',
);
api.addSearchAlias(
  'ex',
  'Search for Chrome extensions',
  'https://www.google.com/search?q=chrome+extension+',
  's',
);
api.addSearchAlias(
  'sb',
  'EMAG',
  'https://www.emag.ro/search/{0}?ref=effective_search',
  's',
  null,
  null,
  {
    favicon_url: 'https://www.emag.ro/favicon.ico',
  },
);
api.addSearchAlias(
  'ss',
  'Sourcegraph',
  'https://sourcegraph.com/search?q=context:global+{0}&patternType=literal',
  's',
);
api.addSearchAlias(
  'sr',
  'Sourcegraph Repo Search',
  'https://sourcegraph.com/search?q=context:global+repo:{0}&patternType=literal',
  's',
);

api.addSearchAlias(
  'ts',
  'Twitter Search',
  'https://twitter.com/search?q={0}&src=typed_query&f=live',
  's',
);
api.addSearchAlias(
  'tl',
  'Twitter Lists',
  'https://www.google.com/search?q=site%3Ahttps%3A%2F%2Ftwitter.com%2Fi%2Flists%2F%20',
  's',
);

api.addSearchAlias(
  'sl',
  'LinkedIn',
  'https://www.linkedin.com/search/results/all/?keywords=',
  's',
);
api.addSearchAlias(
  'dne',
  'NextJS Search',
  'https://www.google.com/search?q=site%3Ahttps://nextjs.org/docs+',
  's',
);
api.addSearchAlias(
  'dl',
  'Lua Search',
  'https://www.google.com/search?q=site%3Ahttps://www.lua.org/manual/5.4/+',
  's',
);
api.addSearchAlias(
  'dnp',
  'NPM Search',
  'https://www.npmjs.com/search?q={0}&page=1&perPage=20',
  's',
);
api.addSearchAlias(
  'fs',
  'freeCodeCamp',
  'https://www.freecodecamp.org/news/search?query=',
  's',
);
api.addSearchAlias(
  'ft',
  'freeCodeCamp',
  'https://www.freecodecamp.org/news/tag/',
  's',
);
api.addSearchAlias(
  'wc',
  'W3C',
  'https://www.google.com/search?q=site%3Ahttps://www.w3.org+',
  's',
);
api.addSearchAlias(
  `${leader}a`,
  'Arch GitLab',
  'https://gitlab.archlinux.org/archlinux/packaging/packages?filter=',
  's',
);
api.addSearchAlias(
  'gn',
  'GNU',
  'https://www.google.com/search?q=site%3Awww.gnu.org+',
  's',
);
api.addSearchAlias(
  'gr',
  'Gumroad',
  'https://discover.gumroad.com/?query=',
  's',
);
api.addSearchAlias(
  'gr',
  'Gumroad',
  'https://discover.gumroad.com/?query=',
  's',
);

api.mapkey(`${leader}su`, 'Custom URLs', () => {
  const entries = [
    {
      title: 'First',
      url: 'https://api.stackexchange.com/docs/authentication',
    },
    {
      title: 'Second',
      url: 'https://api.stackexchange.com/docs/authentication',
    },
    {
      title: 'Third',
      url: 'https://api.stackexchange.com/docs/authentication',
    },
  ];

  api.Front.openOmnibar({
    type: 'UserURLs',
    extra: entries,
  });
});

api.mapkey(`${leader}ogi`, 'Incremental Google Search', () => {
  api.Front.openOmnibar({
    type: 'SearchEngine',
    extra: 'gg',
    pref: 'something',
  });
});
