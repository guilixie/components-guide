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
      var html = this.template()({
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
    template: function() {
      return _.template(TEMPLATE);
    },
    setData: function(tree) {
      var result = UTILS.handleTree(tree);
      result.menu && (this.computedMenu = result.menu);
      result.children && (this.computedChildren = result.children);
    },
    bindEvent: function() {}
  };

  window.JMenu = JMenu;
})(window, window.document, window.jQuery, window._);
