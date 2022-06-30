(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('flocc')) :
    typeof define === 'function' && define.amd ? define(['exports', 'flocc'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.floccUI = {}, global.flocc));
}(this, (function (exports, flocc) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var numeric = [
        "margin",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "padding",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "fontSize",
        "height",
        "width",
    ];
    function parsePair(key, value) {
        var parsedValue = value;
        if (numeric.indexOf(key) > -1 && +value === value) {
            parsedValue = value.toString() + "px";
        }
        var parsedKey = key.replace(/([A-Z])/g, function (g) { return "-" + g[0].toLowerCase(); });
        return { key: parsedKey, value: parsedValue };
    }

    function createStyle(css, id) {
        if (!document.getElementById(id)) {
            var style = document.createElement("style");
            style.id = id;
            style.innerHTML = css;
            document.head.appendChild(style);
        }
    }

    function globalStyle() {
        createStyle("\n    [class^=\"__floccUI-\"],\n    [class^=\"__floccUI-\"] *,\n    [class^=\"__floccUI-\"]:after,\n    [class^=\"__floccUI-\"]:before {\n        font-family: \"system-ui\", \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n        font-size: 12px;\n        position: relative;\n        box-sizing: border-box;\n        -webkit-box-sizing: border-box;\n    }", "__floccUI-global");
    }

    var Base = /** @class */ (function () {
        function Base() {
            globalStyle();
        }
        Base.prototype.update = function () { };
        return Base;
    }());

    var styles = "\n.__floccUI-slider__container {\n    display: flex;\n    align-items: center;\n    font-size: 12px;\n    margin-bottom: 5px;\n    padding: 2px 0;\n    user-select: none;\n    height: 18px;\n}\n\n.__floccUI-slider__container:last-child {\n    margin-bottom: 0;\n}\n\n.__floccUI-slider__inner {\n    flex-grow: 2;\n    margin-left: 5px;\n    margin-right: 5px;\n}\n\n.__floccUI-slider {\n    appearance: none;\n    -webkit-appearance: none;\n    flex-grow: 2;\n    width: 100%;\n}\n\n.__floccUI-slider::-webkit-slider-thumb {\n    appearance: none;\n    -webkit-appearance: none;\n    border: 1px solid #000000;\n    border-radius: 50%;\n    height: 12px;\n    width: 12px;\n    background: #ffffff;\n    cursor: pointer;\n    margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */\n}\n\n.__floccUI-slider::-webkit-slider-runnable-track {\n    width: 100%;\n    height: 4px;\n    cursor: pointer;\n    background: rgba(0, 0, 0, 0.15);\n    border-radius: 2px;\n}\n\n.__floccUI-slider::-moz-range-track {\n    width: 100%;\n    height: 4px;\n    cursor: pointer;\n    background: rgba(0, 0, 0, 0.15);\n    border-radius: 2px;\n}\n\n.__floccUI-slider::-ms-track {\n    width: 100%;\n    cursor: pointer;\n    background: transparent; \n    border-color: transparent;\n    color: transparent;\n}\n\n.__floccUI-slider__marker {\n    text-align: right;\n}\n";

    var labelStyles = "\n.__floccUI-label {\n    display: block;\n    margin: 8px 0 5px;\n}\n";

    var defaultElementOptions = Object.assign({}, {
        className: "",
    });
    function createElement(tag, opts, contents) {
        if (opts === void 0) { opts = defaultElementOptions; }
        var el = document.createElement(tag);
        for (var key in opts) {
            if (key === "className") {
                opts.className.split(" ").forEach(function (c) {
                    el.classList.add(c);
                });
            }
            else if (key === "checked") {
                // @ts-ignore
                if (opts[key])
                    el.setAttribute("checked", "");
            }
            else {
                // @ts-ignore
                el[key] = opts[key];
            }
        }
        if (contents) {
            var children = contents();
            if (typeof children === "string") {
                el.innerHTML = children;
            }
            else if (children instanceof HTMLElement) {
                el.appendChild(children);
            }
            else if (children) {
                children.forEach(function (child) {
                    if (child instanceof HTMLElement) {
                        el.appendChild(child);
                    }
                    else if (child) {
                        el.innerHTML += child;
                    }
                });
            }
        }
        // @ts-ignore
        return el;
    }
    var createLabel = function (opts, contents) {
        createStyle(labelStyles, "__floccUI-label");
        return createElement("label", Object.assign({ className: "__floccUI-label" }, opts), contents);
    };
    var createDiv = function (opts, contents) {
        return createElement("div", opts, contents);
    };
    var createInput = function (opts, contents) {
        return createElement("input", opts, contents);
    };
    var createButton = function (opts, contents) {
        return createElement("button", opts, contents);
    };
    var createSpan = function (opts, contents) {
        return createElement("span", opts, contents);
    };

    var defaultSliderOptions = {
        min: 0,
        max: 1,
        step: 0.01,
    };
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(opts) {
            var _this = _super.call(this) || this;
            _this.callbacks = [];
            _this.opts = Object.assign({}, defaultSliderOptions);
            Object.assign(_this.opts, opts);
            _this.marker = createLabel({
                className: "__floccUI-slider__marker",
            });
            var fauxMarker = createLabel({
                className: "__floccUI-slider__marker",
            });
            fauxMarker.style.position = "absolute";
            fauxMarker.style.opacity = "0";
            document.body.appendChild(fauxMarker);
            var longestNumString = "";
            for (var v = _this.opts.min; v < _this.opts.max; v += _this.opts.step) {
                // prevent floating-point numbers from getting too long
                v = Math.round(v * 10000) / 10000;
                if (v.toString().length > longestNumString.length) {
                    longestNumString = v.toString();
                }
            }
            fauxMarker.innerHTML = longestNumString;
            requestAnimationFrame(function () {
                _this.marker.style.width = fauxMarker.clientWidth + "px";
                document.body.removeChild(fauxMarker);
            });
            _this.element = createDiv({
                className: "__floccUI-slider__container",
            }, function () {
                return [
                    _this.opts.label || _this.opts.name
                        ? createLabel({}, function () { return _this.opts.label || _this.opts.name; })
                        : null,
                    createDiv({
                        className: "__floccUI-slider__inner",
                    }, function () {
                        _this.input = createInput({
                            classList: "__floccUI-slider",
                            type: "range",
                            min: _this.opts.min.toString(),
                            max: _this.opts.max.toString(),
                            step: _this.opts.step.toString(),
                        });
                        _this.input.addEventListener("input", function () {
                            var _a;
                            var value = +_this.input.value;
                            _this.opts.name && ((_a = _this.environment) === null || _a === void 0 ? void 0 : _a.set(_this.opts.name, value));
                        });
                        return _this.input;
                    }),
                    _this.marker,
                ];
            });
            if (_this.opts.style) {
                for (var key in _this.opts.style) {
                    var value = _this.opts.style[key];
                    var pair = parsePair(key, value);
                    // @ts-ignore
                    _this.element.style[pair.key] = pair.value;
                }
            }
            // add CSS
            createStyle(styles, "__floccUI-slider-css");
            _this.listen();
            return _this;
        }
        Slider.prototype.updateMarker = function () {
            var _a;
            var step = this.opts.step;
            var decimals = (step | 0) === step ? 0 : step.toString().split(".")[1].length || 0;
            var value = (_a = this.environment) === null || _a === void 0 ? void 0 : _a.get(this.opts.name);
            if (value === null || value === undefined)
                return;
            var strValue = value.toString();
            if (decimals > 0 && !strValue.includes(".")) {
                strValue += ".";
                while (strValue.split(".")[1].length < decimals)
                    strValue += "0";
            }
            this.marker.innerHTML = strValue;
        };
        Slider.prototype.listen = function () {
            var _this = this;
            if (this.environment && this.opts.name) {
                this.input.value = this.environment.get(this.opts.name);
                this.updateMarker();
            }
            window.requestAnimationFrame(function () { return _this.listen(); });
        };
        return Slider;
    }(Base));

    var styles$1 = "\n.__floccUI-input__container {\n}\n\n.__floccUI-input {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 1px solid #aaa;\n  border-radius: 3px;\n  display: block;\n  font-size: 12px;\n  padding: 6px 6px;\n  margin-bottom: 5px;\n  width: 100%;\n}\n\n.__floccUI-input__prompt-button {\n  position: absolute;\n  bottom: 3px;\n  right: 3px;\n}";

    var defaultInputOptions = {
        value: "",
        live: false,
    };
    var Input = /** @class */ (function (_super) {
        __extends(Input, _super);
        function Input(opts) {
            var _this = _super.call(this) || this;
            _this.opts = Object.assign({}, defaultInputOptions);
            Object.assign(_this.opts, opts);
            _this.value = _this.opts.value;
            _this.type = +_this.value === _this.value ? "number" : "string";
            _this.element = createDiv({ className: "__floccUI-input__container" }, function () {
                _this.input = createInput({
                    className: "__floccUI-input",
                    type: _this.type === "number" ? "number" : "text",
                    value: _this.value.toString(),
                });
                if (_this.type === "number") {
                    _this.input.step = (_this.opts.step || 1).toString();
                    _this.opts.hasOwnProperty("min") &&
                        (_this.input.min = _this.opts.min.toString());
                    _this.opts.hasOwnProperty("max") &&
                        (_this.input.max = _this.opts.max.toString());
                }
                _this.promptButton = createButton({
                    className: "__floccUI-input__prompt-button",
                    style: "display: none;",
                }, function () { return "⏎"; });
                _this.promptButton.addEventListener("click", function () { return _this.update(); });
                return [
                    _this.opts.label && createLabel({}, function () { return _this.opts.label; }),
                    _this.input,
                    _this.promptButton,
                ];
            });
            if (!_this.opts.live) {
                _this.input.addEventListener("input", function () {
                    var value = _this.value;
                    _this.promptButton.style.display =
                        _this.getInputValue() !== value ? "block" : "none";
                });
                _this.input.addEventListener("keyup", function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        _this.update();
                    }
                });
            }
            else {
                _this.input.addEventListener("keyup", function () { return _this.update(); });
            }
            if (opts.style) {
                for (var key in opts.style) {
                    var value = opts.style[key];
                    var pair = parsePair(key, value);
                    // @ts-ignore
                    _this.element.style[pair.key] = pair.value;
                }
            }
            // add CSS
            createStyle(styles$1, "__floccUI-input-css");
            _this.listen();
            return _this;
        }
        Input.prototype.getInputValue = function () {
            return this.type === "number" ? +this.input.value : this.input.value;
        };
        Input.prototype.listen = function () {
            var _this = this;
            // don't update the input value if the input is focused
            if (document.activeElement !== this.input &&
                document.activeElement !== this.promptButton &&
                this.environment &&
                this.opts.name) {
                this.input.value = this.environment.get(this.opts.name);
            }
            window.requestAnimationFrame(function () { return _this.listen(); });
        };
        Input.prototype.update = function () {
            var _a;
            this.value = this.getInputValue();
            this.input.focus();
            this.promptButton.style.display = "none";
            this.opts.name && ((_a = this.environment) === null || _a === void 0 ? void 0 : _a.set(this.opts.name, this.value));
        };
        return Input;
    }(Base));

    var styles$2 = "\n.__floccUI-button {\n  cursor: pointer;\n  display: block;\n  font-size: 12px;\n  padding: 4px 6px 3px;\n  margin-bottom: 5px;\n  width: 100%;\n}\n";

    var defaultButtonOptions = {
        label: "Click Me",
        onClick: function () { },
    };
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(opts) {
            var _this = _super.call(this) || this;
            _this.opts = Object.assign({}, defaultButtonOptions);
            Object.assign(_this.opts, opts);
            _this.element = createButton({
                className: "__floccUI-button",
            }, function () {
                var label = _this.opts.label;
                return typeof label === "string" ? label : label();
            });
            _this.opts.onClick &&
                _this.element.addEventListener("click", function () {
                    _this.opts.onClick();
                });
            createStyle(styles$2, "__floccUI-button-css");
            _this.listen();
            return _this;
        }
        Button.prototype.listen = function () {
            var _this = this;
            var label = this.opts.label;
            this.element.innerHTML = typeof label === "string" ? label : label();
            window.requestAnimationFrame(function () { return _this.listen(); });
        };
        return Button;
    }(Base));

    var styles$3 = "\n.__floccUI-radio-container {\n    margin-bottom: 5px;\n}\n\n.__floccUI-radio__label {\n    cursor: pointer;\n    display: inline-flex;\n    align-items: center;\n    margin-right: 5px;\n}\n\n.__floccUI-radio__label input {\n    margin: 0 3px 0 0;\n}\n";

    var defaultRadioOptions = {
        choices: [],
        choiceLabels: [],
        label: "",
        name: "",
        value: "",
    };
    var Radio = /** @class */ (function (_super) {
        __extends(Radio, _super);
        function Radio(opts) {
            var _this = _super.call(this) || this;
            _this.opts = Object.assign({}, defaultRadioOptions);
            _this.id = flocc.utils.uuid();
            Object.assign(_this.opts, opts);
            var onChange = function (e) {
                if (!_this.environment)
                    return;
                var input = e.target;
                if (!(input instanceof HTMLInputElement))
                    return;
                var value = input.value;
                _this.opts.name &&
                    _this.environment.set(_this.opts.name, !isNaN(+value) ? +value : value);
            };
            _this.element = createDiv({
                className: "__floccUI-radio-container",
            }, function () {
                var els = [];
                var label = _this.opts.name || _this.opts.label
                    ? [createLabel({}, function () { return _this.opts.name || _this.opts.label; })]
                    : [];
                var choices = _this.opts.choices.map(function (choice, i) {
                    var labelText = _this.opts.choiceLabels[i];
                    return createLabel({
                        className: "__floccUI-radio__label",
                    }, function () {
                        var checked = _this.opts.hasOwnProperty("value")
                            ? _this.opts.value === choice
                            : i === 0;
                        var input = createInput({
                            type: "radio",
                            name: "__floccUI-radio-" + _this.id,
                            value: choice,
                            checked: checked,
                        });
                        input.addEventListener("change", onChange);
                        return [
                            input,
                            createSpan({}, function () { return labelText || choice.toString(); }),
                        ];
                    });
                });
                return els.concat(label).concat(choices);
            });
            createStyle(styles$3, "__floccUI-radio-css");
            _this.listen();
            return _this;
        }
        Radio.prototype.listen = function () {
            var _this = this;
            if (this.environment && this.opts.name) {
                var choices = Array.from(this.element.querySelectorAll("[name=\"__floccUI-radio-" + this.id + "\"]"));
                choices.forEach(function (choice, i) {
                    if (!(choice instanceof HTMLInputElement))
                        return;
                    var value = _this.environment.get(_this.opts.name);
                    choice.checked = value === _this.opts.choices[i];
                });
            }
            window.requestAnimationFrame(function () { return _this.listen(); });
        };
        return Radio;
    }(Base));

    var styles$4 = "\n.__floccUI-panel {\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);\n    position: fixed;\n    top: 0;\n    right: 0;\n    background: #fff;\n    border: 1px solid #aaa;\n    width: 300px;\n}\n\n.__floccUI-panel__toggle-container {\n    background: #eee;\n    display: flex;\n    padding: 5px;\n}\n\n.__floccUI-panel__toggle-container--floating {\n    cursor: move;\n}\n\n.__floccUI-panel__toggle {\n    color: #666;\n    cursor: pointer;\n    height: 20px;\n    padding: 0;\n    font-weight: bold;\n    text-align: center;\n    flex: 0 0 20px;\n    user-select: none;\n    line-height: 0;\n}\n\n.__floccUI-panel--collapsed {\n    height: 32px;\n    overflow: hidden;\n}\n\n.__floccUI-panel__components {\n    padding: 5px;\n}\n\n.__floccUI-panel__components > *:last-child,\n.__floccUI-panel__components > *:last-child > *:last-child,\n.__floccUI-panel__components > *:last-child > *:last-child > *:last-child {\n    margin-bottom: 0;\n}\n";

    var defaultPanelOptions = Object.assign({}, {
        mount: null,
    });
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel(environment, children, opts) {
            if (children === void 0) { children = []; }
            if (opts === void 0) { opts = defaultPanelOptions; }
            var _this = _super.call(this) || this;
            _this.collapsed = false;
            _this.dragging = false;
            _this.toggleButton = createButton({
                className: "__floccUI-panel__toggle",
            }, function () { return "&ndash;"; });
            _this.environment = environment;
            _this.panel = _this;
            var container = document.body;
            if (opts.hasOwnProperty("mount") && opts.mount !== null) {
                container =
                    opts.mount instanceof HTMLElement
                        ? opts.mount
                        : document.querySelector(opts.mount);
                if (container) {
                    _this.floating = false;
                }
                else {
                    console.warn("You passed a selector or element, but it wasn't found on the page. Falling back to a floating Panel instead.");
                    container = document.body;
                    _this.floating = true;
                }
            }
            else {
                _this.floating = true;
            }
            var dragBar = createDiv({
                className: "__floccUI-panel__toggle-container" +
                    (_this.floating ? " __floccUI-panel__toggle-container--floating" : ""),
            }, function () { return _this.toggleButton; });
            var components = createDiv({ className: "__floccUI-panel__components" });
            _this.element = createDiv({ className: "__floccUI-panel" }, function () { return [
                dragBar,
                components,
            ]; });
            container.appendChild(_this.element);
            var dragOn = function () { return (_this.dragging = true); };
            var dragOff = function () { return (_this.dragging = false); };
            if (_this.floating) {
                dragBar.addEventListener("mousedown", dragOn);
                document.body.addEventListener("mouseup", dragOff);
                document.body.addEventListener("mouseleave", dragOff);
                document.body.addEventListener("mousemove", function (e) {
                    // do nothing if we're not currently dragging
                    if (!_this.dragging)
                        return;
                    var _a = _this.element.getBoundingClientRect(), left = _a.left, top = _a.top;
                    _this.element.style.left = left + e.movementX + "px";
                    _this.element.style.top = top + e.movementY + "px";
                });
            }
            // add CSS
            createStyle(styles$4, "__floccUI-panel-css");
            children.forEach(function (child) {
                child.panel = _this;
                child.environment = _this.environment;
                child.update();
                components.appendChild(child.element);
            });
            _this.toggleButton.addEventListener("click", function () {
                _this.toggle();
            });
            _this.update();
            return _this;
        }
        Panel.prototype.toggle = function () {
            this.collapsed = !this.collapsed;
            this.toggleButton.innerHTML = this.collapsed ? "+" : "&ndash;";
            this.update();
        };
        Panel.prototype.update = function () {
            if (this.collapsed) {
                this.element.classList.add("__floccUI-panel--collapsed");
            }
            else {
                this.element.classList.remove("__floccUI-panel--collapsed");
            }
        };
        return Panel;
    }(Base));

    exports.Button = Button;
    exports.Input = Input;
    exports.Panel = Panel;
    exports.Radio = Radio;
    exports.Slider = Slider;

    Object.defineProperty(exports, '__esModule', { value: true });

})));