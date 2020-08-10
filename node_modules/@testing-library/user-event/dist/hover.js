"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hover = hover;
exports.unhover = unhover;

var _dom = require("@testing-library/dom");

var _utils = require("./utils");

function hover(element, init) {
  if ((0, _utils.isLabelWithInternallyDisabledControl)(element)) return;

  _dom.fireEvent.pointerOver(element, init);

  _dom.fireEvent.pointerEnter(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseOver(element, (0, _utils.getMouseEventOptions)('mouseover', init));

    _dom.fireEvent.mouseEnter(element, (0, _utils.getMouseEventOptions)('mouseenter', init));
  }

  _dom.fireEvent.pointerMove(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseMove(element, (0, _utils.getMouseEventOptions)('mousemove', init));
  }
}

function unhover(element, init) {
  if ((0, _utils.isLabelWithInternallyDisabledControl)(element)) return;

  _dom.fireEvent.pointerMove(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseMove(element, (0, _utils.getMouseEventOptions)('mousemove', init));
  }

  _dom.fireEvent.pointerOut(element, init);

  _dom.fireEvent.pointerLeave(element, init);

  if (!element.disabled) {
    _dom.fireEvent.mouseOut(element, (0, _utils.getMouseEventOptions)('mouseout', init));

    _dom.fireEvent.mouseLeave(element, (0, _utils.getMouseEventOptions)('mouseleave', init));
  }
}