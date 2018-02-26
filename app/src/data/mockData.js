(function(window, $, Mock) {
  function createDigits(n) {
    return Math.floor(Math.random() * +('1.0e+' + n));
  }
  // 滚动数字
  Mock.mock(/\/testJRunningNum\/getNum/, function(config) {
    var figure = config.url.split('figure=')[1];
    return { num: createDigits(figure) };
  });

  // 智能菜单
  Mock.mock(/\/testJMenu\/getTree/, {
    'result|5-10': [
      {
        'titles|1-3': [{ name: '家用电器' }],
        'children|5-10': [
          {
            'name|1': ['大型家电', '小型家电', '迷你电器'],
            'children|1-10': [
              { name: '冰箱' },
              { name: '洗衣机' },
              { name: '挂烫机' }
            ]
          }
        ]
      }
    ]
  });
})(window, window.jQuery, window.Mock);
