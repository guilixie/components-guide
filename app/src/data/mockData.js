(function(window, $, Mock) {
  function createDigits(n) {
    return Math.floor(Math.random() * +("1.0e+" + n));
  }

  Mock.mock(/\/testJRunningNum\/getNum/, function(config) {
    var figure = config.url.split("figure=")[1];
    return { num: createDigits(figure) };
  });
})(window, window.jQuery, window.Mock);
