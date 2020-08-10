"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PanelBody;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _PanelContext = _interopRequireDefault(require("../PanelContext"));

function PanelBody(_ref) {
  var prefixCls = _ref.prefixCls,
      disabledDate = _ref.disabledDate,
      onSelect = _ref.onSelect,
      rowNum = _ref.rowNum,
      colNum = _ref.colNum,
      prefixColumn = _ref.prefixColumn,
      rowClassName = _ref.rowClassName,
      baseDate = _ref.baseDate,
      getCellClassName = _ref.getCellClassName,
      getCellText = _ref.getCellText,
      getCellNode = _ref.getCellNode,
      getCellDate = _ref.getCellDate,
      titleCell = _ref.titleCell,
      headerCells = _ref.headerCells;

  var _React$useContext = React.useContext(_PanelContext.default),
      onDateMouseEnter = _React$useContext.onDateMouseEnter,
      onDateMouseLeave = _React$useContext.onDateMouseLeave;

  var cellPrefixCls = "".concat(prefixCls, "-cell"); // =============================== Body ===============================

  var rows = [];

  for (var i = 0; i < rowNum; i += 1) {
    var row = [];
    var rowStartDate = void 0;

    var _loop = function _loop(j) {
      var offset = i * colNum + j;
      var currentDate = getCellDate(baseDate, offset);
      var disabled = disabledDate && disabledDate(currentDate);

      if (j === 0) {
        rowStartDate = currentDate;

        if (prefixColumn) {
          row.push(prefixColumn(rowStartDate));
        }
      }

      row.push(React.createElement("td", {
        key: j,
        title: titleCell && titleCell(currentDate),
        className: (0, _classnames.default)(cellPrefixCls, (0, _objectSpread3.default)((0, _defineProperty2.default)({}, "".concat(cellPrefixCls, "-disabled"), disabled), getCellClassName(currentDate))),
        onClick: function onClick() {
          if (!disabled) {
            onSelect(currentDate);
          }
        },
        onMouseEnter: function onMouseEnter() {
          if (!disabled && onDateMouseEnter) {
            onDateMouseEnter(currentDate);
          }
        },
        onMouseLeave: function onMouseLeave() {
          if (!disabled && onDateMouseLeave) {
            onDateMouseLeave(currentDate);
          }
        }
      }, getCellNode ? getCellNode(currentDate) : React.createElement("div", {
        className: "".concat(cellPrefixCls, "-inner")
      }, getCellText(currentDate))));
    };

    for (var j = 0; j < colNum; j += 1) {
      _loop(j);
    }

    rows.push(React.createElement("tr", {
      key: i,
      className: rowClassName && rowClassName(rowStartDate)
    }, row));
  }

  return React.createElement("div", {
    className: "".concat(prefixCls, "-body")
  }, React.createElement("table", {
    className: "".concat(prefixCls, "-content")
  }, headerCells && React.createElement("thead", null, React.createElement("tr", null, headerCells)), React.createElement("tbody", null, rows)));
}