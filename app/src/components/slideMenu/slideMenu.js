(function(window, document, $, _) {
  // 模板
  var TEMPLATE =
    '<div id="slide_menu_<%= uuid %>" class="guili-slide-menu pos-<%= pos %>">\
        <% _.each(menu, function(v,k){ %>\
        <a href = "<%= v.url %>" class="guili-slide-menu-item">\
            <img class="guili-slide-menu-thumb" src="<%= v.img %>" alt="thumb<%=  k %>" />\
            <span class="guili-slide-menu-title"><%= v.title %></span>\
        </a>\
         <% }); %>\
    </div>';

  /**
   * @description 配置项
   * el: ‘’, jquery选择器,
   * pos: '',   // 位置 left / right / top / bottom
   * deta: 1,   //灵敏度 0-1
   * menu: [{url:'', img:'', title: ''}] // 菜单项
   */
  var OPTS = {
    el: 'body',
    pos: 'left',
    deta: 1,
    menu: []
  };

  // 工具
  var UTILS = {
    genUUID: function() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function(c) {
          var r = ((d + Math.random() * 16) % 16) | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }
  };

  // 构造函数
  function SlideMenu(config) {
    if (!(this instanceof SlideMenu)) return new SlideMenu(config);
    return this.init(config);
  }

  // 原型对象
  SlideMenu.prototype = {
    constructor: SlideMenu,
    version: '1.0.0',
    init: function(config) {
      if (!config || !config.el) throw new Error('请传入一个jquery选择器！');
      this.el = config.el || OPTS.el;
      this.pos = config.pos || OPTS.pos;
      this.menu = config.menu || OPTS.menu;
      this.deta = config.deta || OPTS.deta;
      this.uuid = UTILS.genUUID();
      return this.render().bindEvent();
    },
    render: function() {
      var html = this.template({
        uuid: this.uuid,
        pos: this.pos,
        menu: this.menu
      });
      this.getEl().html(html);
      return this;
    },
    getEl: function() {
      return $(this.el);
    },
    template: function(data) {
      return _.template(TEMPLATE)(data);
    },
    setPosition: function(pos) {
      this.pos = pos;
      return this.render().bindEvent();
    },
    setMenu: function(menu) {
      this.menu = menu;
      return this.render().bindEvent();
    },
    clickShow: function() {
      var el = $('#slide_menu_' + this.uuid);
      var activeCls = 'menu-active';
      !el.hasClass(activeCls) && el.addClass(activeCls);
    },
    clickHide: function() {
      var el = $('#slide_menu_' + this.uuid);
      var activeCls = 'menu-active';
      el.hasClass(activeCls) && el.removeClass(activeCls);
    },
    bindEvent: function() {
      var pos = this.pos;
      var show = this.clickShow.bind(this);
      var hide = this.clickHide.bind(this);
      var w = this.deta * 100;
      // 处理鼠标移动
      var mouseRemoveFn = function(ev) {
        var domWidth = $(window).width(); // 窗口宽度
        var domHeight = $(window).height(); // 窗口高度
        var x = ev.pageX;
        var y = ev.pageY;
        switch (pos) {
          case 'left':
            x <= w ? show() : hide();
            break;
          case 'right':
            x >= domWidth - w ? show() : hide();
            break;
          case 'top':
            y <= w ? show() : hide();
            break;
          case 'bottom':
            y >= domHeight - w ? show() : hide();
            break;
          default:
            break;
        }
      };
      // 绑定鼠标移动事件
      $(document).bind('mousemove', mouseRemoveFn);
      // 鼠标移入菜单取消绑定
      this.getEl()
        .on('mouseenter', function() {
          $(document).unbind('mousemove', mouseRemoveFn);
        })
        .on('mouseleave', function() {
          $(document).bind('mousemove', mouseRemoveFn);
        });
    }
  };

  // 暴露
  window.SlideMenu = SlideMenu;
})(window, window.document, window.jQuery, window._);
