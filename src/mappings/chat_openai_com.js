import { copySelectionToRoam } from '../utils';
import { leader } from '../settings';

if (location.hostname === 'chat.openai.com') {
  api.mapkey(`${leader}${leader}g`, 'Copy last element from ChatGPT', () => {
    const elem = [...document.getElementsByClassName('text-base')].at(-1);
    let copyRangeRoamRange = document.createRange();
    copyRangeRoamRange.setStart(elem, 0);
    copyRangeRoamRange.setEnd(elem, elem.childNodes.length);
    const sele = document.getSelection();
    sele.removeAllRanges();
    sele.addRange(copyRangeRoamRange);
    copySelectionToRoam();
    sele.removeAllRanges();
    api.Front.showBanner('Copied');
  });

  api.mapkey(`${leader}${leader}G`, 'Copy last element from ChatGPT', () => {
    api.Hints.create(
      [...document.getElementsByClassName('text-base')],
      elem => {
        let copyRangeRoamRange = document.createRange();
        copyRangeRoamRange.setStart(elem, 0);
        copyRangeRoamRange.setEnd(elem, elem.childNodes.length);
        const sele = document.getSelection();
        sele.removeAllRanges();
        sele.addRange(copyRangeRoamRange);
        copySelectionToRoam();
        sele.removeAllRanges();
        api.Front.showBanner('Copied');
      },
    );
  });
}
