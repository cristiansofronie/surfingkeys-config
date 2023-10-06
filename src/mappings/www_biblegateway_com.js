import { leader } from '../settings';

if (location.hostname === 'www.biblegateway.com') {
  api.mapkey(`${leader}gc`, 'Go to chapter from input', () => {
    const input = document.getElementsByTagName('input')[0];
    input.value = input.value.split(':')[0];
    document.getElementsByTagName('form')[0].submit();
  });
}
