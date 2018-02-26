(function(window, document, $, _) {
  var TEMPLATE =
    '<div id="JMenu_<%= uuid %>" class="menu-container">\
            <ul>\
                <% _.each(menu, function(item, idx){ %>\
                <li data-id="<%= uuid + idx %>">\
                    <% _.each(item,function(o){ %>\
                        <a href="<%= o.href || \'javascript:void(0);\' %>"><%= o.name %></a>\
                    <% }); %>\
                </li>\
                <% }); %>\
            </ul>\
            <div id="JMenu_sub_<%= uuid %>" class="sub-menu-wrap none">\
                <% _.each(children, function(arr, index){ %>\
                <div class="sub-menu none" id="<%= uuid + index %>">\
                    <% _.each(arr,function(child){ %>\
                    <dl>\
                        <dt>\
                            <a href="<%= child.href || \'javascript:void(0);\' %>"> \
                                <span><%= child.name %></span>\
                                <i class="iconfont icon-qiehuanqiyou"></i>\
                            </a>\
                        </dt>\
                        <dd>\
                            <% _.each(child.children, function(grandChild){ %>\
                            <a href="<%= grandChild.href || \'javascript:void(0);\' %>"> <%= grandChild.name %> </a>\
                            <% }); %>\
                        </dd>\
                    </dl>\
                    <% }); %>\
                </div>\
                <% }); %>\
            </div>\
        </div>';

  /**
   * el: jquery选择器
   * tree: [{
   *     titles: [{
   *         name: '',
   *         href : ''
   *     }, {
   *         name: '',
   *         href : ''
   *     },...],
   *     children: [{
   *         name: '',
   *         href: '',
   *         children: [{
   *             name: '',
   *             href : ''
   *         }, {
   *             name: '',
   *             href : ''
   *         },...]
   *     }, {
   *         name: '',
   *         href: '',
   *         children: [{
   *             name: '',
   *             href : ''
   *         }, {
   *             name: '',
   *             href : ''
   *         },...]
   *     },...]
   * },...]
   */
  var OPTS = {
    el: "",
    tree: []
  };

  var UTILS = {
    genUUID: function() {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = ((d + Math.random() * 16) % 16) | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    handleTree: function(tree) {
      var menu = [],
        children = [];
      if ($.type(tree) !== "array") throw new Error("请传入正确的格式！");
      tree.forEach(function(node, idx) {
        menu.push(node.titles);
        children.push(node.children);
      });
      return {
        menu: menu,
        children: children
      };
    },
    // 向量是终点坐标减去起点坐标
    vector: function(a, b) {
      return {
        x: b.x - a.x,
        y: b.y - a.y
      };
    },
    // 向量的叉乘
    vectorPro: function(v1, v2) {
      return v1.x * v2.y - v1.y * v2.x;
    },
    // 用位运算高效判断符号相同
    sameSign: function(a, b) {
      return (a ^ b) >= 0;
    },
    // 判断点是否在三角形内
    isPointInTranjgle: function(p, a, b, c) {
      var pa = this.vector(p, a);
      var pb = this.vector(p, b);
      var pc = this.vector(p, c);

      var t1 = this.vectorPro(pa, pb);
      var t2 = this.vectorPro(pb, pc);
      var t3 = this.vectorPro(pc, pa);

      return this.sameSign(t1, t2) && this.sameSign(t2, t3);
    },
    // 是否需要延迟
    needDelay: function(ele, curMouse, prevMouse) {
      if (!curMouse || !prevMouse) {
        return;
      }
      var offset = ele.offset();

      // 左上点
      var topleft = {
        x: offset.left,
        y: offset.top
      };
      // 左下点
      var leftbottom = {
        x: offset.left,
        y: offset.top + ele.height()
      };

      return this.isPointInTranjgle(curMouse, prevMouse, topleft, leftbottom);
    }
  };

  function JMenu(config) {
    if (!(this instanceof JMenu)) return new JMenu(config);
    return this.init(config);
  }

  JMenu.prototype = {
    constructor: JMenu,
    version: "1.0.0",
    init: function(config) {
      if (!config || !config.el) throw new Error("请传入一个jquery选择器！");
      this.el = config.el || OPTS.el;
      this.tree = config.tree || OPTS.tree;
      this.uuid = UTILS.genUUID();
      var result = UTILS.handleTree(this.tree);
      this.computedMenu = result.menu || [];
      this.computedChildren = result.children || [];
      return this.render().bindEvent();
    },
    render: function() {
      var html = this.template({
        uuid: this.uuid,
        menu: this.computedMenu,
        children: this.computedChildren
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
    setData: function(tree) {
      var result = UTILS.handleTree(tree);
      result.menu && (this.computedMenu = result.menu);
      result.children && (this.computedChildren = result.children);
      return this.render().bindEvent();
    },
    bindEvent: function() {
      var mainMenu = $("#JMenu_" + this.uuid);
      var subMenu = $("#JMenu_sub_" + this.uuid);
      var activeRow; // 激活的一级菜单
      var activeMenu; // 激活的二级菜单
      var mouseRecords = []; // 记录鼠标位置
      var isMouseInSub = false; // 鼠标是否在子菜单里
      var timer;

      var _active = function(target) {
        activeRow = $(target);
        activeRow.addClass("menu-active");
        activeMenu = $("#" + activeRow.data("id"));
        activeMenu.removeClass("none");
      };

      var _switchActive = function(target) {
        activeRow.removeClass("menu-active");
        activeMenu.addClass("none");
        _active(target);
      };

      // 记录鼠标的位置
      var _mouseMoveHandler = function(e) {
        mouseRecords.push({
          x: e.pageX,
          y: e.pageY
        });
        mouseRecords.length > 3 && mouseRecords.shift(); // 只需要当前点和上一个点
      };

      subMenu
        .css("left", mainMenu.children("ul").width())
        .off("mouseenter")
        .off("mouseleave")
        .on("mouseenter", function() {
          isMouseInSub = true;
        })
        .on("mouseleave", function() {
          isMouseInSub = false;
        });

      // 此处只能给整个菜单注册，而非只给一级菜单加，否则timer中的回调执行时，activeRow已为空
      mainMenu
        .off("mouseenter")
        .off("mouseleave")
        .on("mouseenter", function() {
          $(document).bind("mousemove", _mouseMoveHandler);
        })
        .on("mouseleave", function() {
          subMenu.addClass("none");

          if (activeRow) {
            activeRow.removeClass("menu-active");
            activeRow = null;
          }
          if (activeMenu) {
            activeMenu.addClass("none");
            activeMenu = null;
          }
          if (timer) {
            clearTimeout(timer);
          }

          $(document).unbind("mousemove", _mouseMoveHandler); // 注意解绑，以免影响其他组件
        })
        .on("mouseenter", "li", function(e) {
          subMenu.removeClass("none");

          if (!activeRow) {
            _active(e.target);
            return;
          }
          if (timer) {
            clearTimeout(timer);
          }

          var curMouse = mouseRecords[mouseRecords.length - 1]; // 鼠标当前坐标
          var prevMouse = mouseRecords[mouseRecords.length - 2]; // 鼠标上次坐标

          var delay = UTILS.needDelay(subMenu, curMouse, prevMouse);

          if (delay) {
            // 加入延迟器，解决斜方移动切换，只能折线移动的问题
            timer = setTimeout(function() {
              if (isMouseInSub) return;
              _switchActive(e.target);
              timer = null;
            }, 300);
            return;
          }

          _switchActive(e.target);
        });
    }
  };

  window.JMenu = JMenu;
})(window, window.document, window.jQuery, window._);
