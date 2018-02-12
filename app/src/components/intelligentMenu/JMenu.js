(function(window, document, $, _) {
  var TEMPLATE =
    ' <div id="JMenu_<%= uuid %>" class="menu-container">\
            <ul>\
                <% _.each(menu, function(item, idx){\
                <li data-id="<%= uuid + idx %>" class="menu-active">\
                    <% _.each(item,function(o){\
                        <a href="<%= o.href %>"><%= o.name %></a>\
                    }) %>\
                </li>\
                }); %>\
            </ul>\
            <div id="JMenu_sub_<%= uuid %>" class="sub-menu-wrap none">\
                <% _.each(children, function(arr, index){\
                <div class="sub-menu none" id="<%= uuid + index %>">\
                    <% _.each(arr,function(o){\
                    <dl>\
                        <dt>\
                            <a href="#">\
                                <span>二级菜单1</span>\
                                <i class="iconfont icon-qiehuanqiyou"></i>\
                            </a>\
                        </dt>\
                        <dd>\
                            <a href="#"> 三级菜单 </a>\
                        </dd>\
                    </dl>\
                </div>\
                }); %>\
            </div>\
        </div>';

    var OPTS = {
        el: '',
    };

    var tree = [{
        titles: [{ name: '', href='' }, { name: '', href='' }],
        children: [{
            name: '',
            href: '',
            children: [{ name: '', href='' }, { name: '', href='' }]
        }, {
            name: '',
            href: '',
            children: [{ name: '', href='' }, { name: '', href='' }]
        }]
    }];
    
    // var menu = [[{ name: '', href='' }, { name: '', href='' }], [{ name: '', href='' }, { name: '', href='' }]];
    // var children = [[{
    //     name: '',
    //     href: '',
    //     children: [{ name: '', href='' }, { name: '', href='' }]
    // }, {
    //     name: '',
    //     href: '',
    //     children: [{ name: '', href='' }, { name: '', href='' }]
    // }], [{
    //     name: '',
    //     href: '',
    //     children: [{ name: '', href='' }, { name: '', href='' }]
    // }, {
    //     name: '',
    //     href: '',
    //     children: [{ name: '', href='' }, { name: '', href='' }]
    // }]];

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
    }
  };

  function JMenu(config) {
    if (!(this instanceof JMenu)) return new JMenu(config);
    return this.init(config);
  }

  JMenu.prototype = {
    constructor: JMenu,
    version: "1.0.0",
    init: function (config) {
        if (!config || !config.el) throw new Error('请传入一个jquery选择器！');
        this.el = config.el; 
        this.uuid = UTILS.genUUID();
        return this;  
    },
    render: function() {},
    template: function() {},
    setData: function () {},
    getMenu: function () {},
    getChildren: function () {},
    handleData: function () {}
  };

  window.JMenu = JMenu;
})(window, window.document, window.jQuery, window._);
