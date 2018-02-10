/**********************************************************************************************
 * @name JRunningNum
 * @author Jackie-Xie
 * @date 2018-01-25
 * @description 监控屏的滚动数字插件
 * 配置格式要求：
 *      1. el：容器节点，是常用的jquery选择器，例如 'p'、'#id'、'.class'，必填项，默认会在‘body’中加代码；
 *      2. size：固定显示的位数，包括小数点和小数位数在内，例如‘123.456’的size为7，默认size为6；
 *      3. splitChar：整数部分每个几位的分隔符，和 splitBit 配合使用，默认为''，即不分隔；
 *      4. splitBit：每隔几位分隔，和 splitChar 配合使用，默认是3；
 *      5. data： 数据，支持小数，默认为0；
 *      6. cellClass：类名，写自定义样式，用于覆盖内部样式的类，默认为''；
 *      7. toFixed:：保留几位小数，默认为0，即不保留小数；
 * @example
 *      JRunningNum({
 *            el: 'selector',
 *            cellClass: 'my-num-cell',
 *            size: 10,
 *            splitChar: ',',
 *            splitBit: 3,
 *            data: '7758521.12',
 *            toFixed: 2
 *       });
 **********************************************************************************************/
(function(window, document, $, undefined) {
  "use strict";

  var hasJquery = !!$;
  var seeds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "."];
  var OPTS = {
    el: "body",
    cellClass: "",
    size: 6,
    splitChar: "",
    splitBit: 3,
    data: 0,
    toFixed: 0
  };

  function JRunningNum(config) {
    if (!(this instanceof JRunningNum)) return new JRunningNum(config);
    return this.init(config);
  }

  JRunningNum.prototype = {
    constructor: JRunningNum,
    version: "2.0.0",
    init: function(config) {
      handleOpts(config, this);
      return this.setDom().running();
    },
    setDom: function() {
      var elems = getEl(this.el);
      var atom = createAtomStr(this);
      var splitFlag = 'class="num-cell';
      var atomSplitArr = atom.split(splitFlag);
      var dom = "";
      // 遍历所有容器元素
      for (var i = 0; i < elems.length; i++) {
        // 生成computedSize个
        for (var j = 0; j < this.computedSize; j++) {
          dom +=
            atomSplitArr[0] +
            'data-id="cell_' +
            j +
            '" ' +
            splitFlag +
            atomSplitArr[1];
        }
        elems[i].innerHTML = dom;
        elems[i].className += " num-cell-cont";
      }
      return this;
    },
    setContSize: function(config) {
      //  设置容器的width和height
      var elems = getEl(this.el);
      for (var i = 0; i < elems.length; i++) {
        elems[i].style.width = config.width;
        elems[i].style.height = config.height;
      }
    },
    running: function() {
      // 设置滚动到具体值
      var numStr = splitNum(this.computedData, this.splitChar, this.splitBit);
      var makeUpDataArr = makeUp(this, numStr);
      var elems = getEl(this.el);
      // 实现数字滚动
      var items,
        cellItems,
        tmpVal,
        curPos = -1,
        curMgt = 0;
      for (var n = 0; n < elems.length; n++) {
        items = elems[n];
        for (var j = 0; j < makeUpDataArr.length; j++) {
          cellItems = items.children[j].children;
          tmpVal = isNaN(makeUpDataArr[j])
            ? makeUpDataArr[j]
            : +makeUpDataArr[j];
          curPos = seeds.indexOf(tmpVal);
          curMgt = getPosition(cellItems, curPos);
          cellItems[0].style.marginTop = "-" + curMgt + "px";
        }
      }
    },
    setOpts: function(opts) {
      if (
        !opts.el &&
        opts.el !== "" &&
        !opts.cellClass &&
        opts.cellClass !== "" &&
        isNaN(opts.size) &&
        !opts.splitChar &&
        opts.splitChar !== "" &&
        isNaN(opts.splitBit) &&
        isNaN(opts.toFixed)
      ) {
        if (!isNaN(opts.data)) {
          this.data = opts.data;
          this.computedData = computeData(this);
          this.running();
        }
        return;
      }
      handleOpts(opts, this);
      this.setDom().running();
    },
    setData: function(data) {
      this.setOpts({ data: data });
    }
  };

  /**
   * 获取滚动的位置
   */
  function getPosition(cellItems, curPos) {
    var curMgt = 0;
    for (var i = 0; i < curPos; i++) {
      curMgt += cellItems[i].clientHeight;
    }
    return curMgt;
  }

  /**
   * 按照计算的位数补全零，生成数组
   */
  function makeUp(vm, numStr) {
    var originArr = [];
    var tmpArr = numStr.split("");
    var computedSize = vm.computedSize;
    var len = tmpArr.length;
    if (computedSize < len) throw new Error("数据超出配置的位数，请核对！");
    for (var i = 0; i < computedSize; i++) {
      originArr.push(0);
    }
    // 将number放入数组
    for (var j = 0; j < len; j++) {
      originArr[computedSize - len + j] = tmpArr[j];
    }
    return originArr;
  }

  /**
   * 生成元DOM结构
   */
  function createAtomStr(vm) {
    var atom = '<ul class="num-cell ' + vm.cellClass + '">';
    vm.splitChar && vm.splitBit && seeds.push(vm.splitChar);
    // 拼接DOM结构(数字0-9、小数点和分隔符)
    for (var i = 0; i < seeds.length; i++) {
      atom += "<li>" + seeds[i] + "</li>";
    }
    return atom + "</ul>";
  }

  /**
   * 计算正式数据
   */
  function computeData(vm) {
    var res = isNaN(vm.data) ? OPTS.data : +vm.data;
    return res.toFixed(vm.toFixed);
  }

  /**
   * 计算实际位数
   */
  function computeSize(vm) {
    var detaSize =
      vm.splitBit && vm.splitChar ? Math.ceil(vm.size / vm.splitBit) - 1 : 0;
    return vm.size + detaSize;
  }

  /**
   * 处理数据
   */
  function handleOpts(config, vm) {
    if (!config.el) throw new Error("请传入正确的选择器");
    vm.el = (config && config.el) || vm.el || OPTS.el;
    vm.cellClass =
      config && (config.cellClass || config.cellClass === "")
        ? config.cellClass
        : vm.cellClass || OPTS.cellClass;
    vm.size =
      config && !isNaN(config.size) ? config.size : vm.size || OPTS.size;
    vm.splitChar =
      config && (config.splitChar || config.splitChar === "")
        ? config.splitChar
        : vm.splitChar || OPTS.splitChar;
    vm.splitBit =
      config && !isNaN(config.splitBit)
        ? config.splitBit
        : vm.splitBit || OPTS.splitBit;
    vm.data =
      config && !isNaN(config.data) ? config.data : vm.data || OPTS.data;
    vm.toFixed =
      config && !isNaN(config.toFixed)
        ? config.toFixed
        : vm.toFixed || OPTS.toFixed;
    // 是否小数
    vm.isDecimal = (vm.data + "").indexOf(".") > -1;
    // 计算总位数
    vm.computedSize = computeSize(vm);
    // 计算数据
    vm.computedData = computeData(vm);
  }

  /**
   * 获取元素
   */
  function getEl(selector) {
    return hasJquery ? $(selector) : document.querySelectorAll(selector);
  }

  /**
   * 数字几位加分隔符，num:数字，split:分隔符，splitSpace:每几位分隔
   */
  function splitNum(num, split, splitSpace) {
    var it = num + "";
    if (!it || isNaN(it)) {
      return num;
    }
    var regStr =
      "\\d{1," + splitSpace + "}(?=(\\d{" + splitSpace + "})+(\\.\\d*)?$)";
    var reg = new RegExp("" + regStr + "", "g");
    var rep = "$&" + split;
    var splitIt = it.split(".");
    var res = splitIt[0].replace(reg, rep);
    return splitIt[1] ? res + "." + splitIt[1] : res;
  }

  // 暴露构造函数
  window.JRunningNum = JRunningNum;
})(window, document, window.jQuery);
