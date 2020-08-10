import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import * as React from 'react';
import classNames from 'classnames';
import PanelContext from '../PanelContext';
export default function PanelBody(_ref) {
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

  var _React$useContext = React.useContext(PanelContext),
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
        className: classNames(cellPrefixCls, _objectSpread(_defineProperty({}, "".concat(cellPrefixCls, "-disabled"), disabled), getCellClassName(currentDate))),
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