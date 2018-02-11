(function(window, document, $, _) {
  var TEMPLATE =
    ' <div id="JMenu_<%= uuid %>" class="menu-container">\
            <ul>\
                <li data-id="<%= uuid %>" class="menu-active">\
                    <a href="#">一级</a>\
                </li>\
            </ul>\
            <div id="JMenu_sub_<%= uuid %>" class="sub-menu-wrap none">\
                <div class="sub-menu none" id="<%= uuid %>">\
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
            </div>\
        </div>';
})(window, window.document, window.jQuery, window._);
