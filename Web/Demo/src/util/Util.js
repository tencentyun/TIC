export default {
  awaitWrap(promise) {
    return promise.then(data => [null, data]).catch(error => [error, null]);
  },

  rgba2hexa(rgbaColor) {
    const rgba = rgbaColor.substring(rgbaColor.indexOf('(') + 1, rgbaColor.lastIndexOf(')'));
    const rgbaArr = rgba.split(',');
    let hexaColor = '';
    rgbaArr.forEach((item, index) => {
      let hexa = '';
      if (index < 3) {
        hexa = Number(item).toString(16);
      } else if (index === 3) { // alpha
        hexa = Math.min(255, Math.floor(+item * 255)).toString(16);
      }
      if (hexa.length === 1) {
        hexa = `0${hexa}`;
      }
      hexaColor += hexa;
    });
    return `#${hexaColor.toUpperCase()}`;
  },
};

