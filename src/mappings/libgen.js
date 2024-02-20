import { pasteToRoam, downloadRepo, openSrc, addUpDownBinds } from '../utils';
import { leader } from '../settings';

if (location.hostname === 'libgen.li') {
  api.mapkey(`${leader}${leader}ga`, 'Copy Github repo name', () => {
    api.Clipboard.write(document.querySelector('#main a').href);
  });
}
