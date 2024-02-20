if (location.hostname === 'www.oracle.com') {
  api.mapkey('[[', 'Go prev', () => {
    document.getElementsByClassName('cn15l')[0].firstElementChild.click();
  });

  api.mapkey(']]', 'Go next', () => {
    document.getElementsByClassName('cn15r')[0].firstElementChild.click();
  });
}
