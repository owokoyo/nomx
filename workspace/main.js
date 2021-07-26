"use strict";
/**
 * # Nomx
 * The most advanced framework for Applab. Ever.
 * - Build components via class extension as well and native types.
 * - Features an object oriented system that supports JSX syntax and full typescript support.
 * - Built-in html parser and extensive use of getAttribute gives access to previously off limit properties, such as:
 *   * The channelId of the app.
 *   * The children of an element.
 *   * The screens and active screen of a project.
 *   * And more!
 *
 * NOTE: Nomx works best with cdo-sync, in order to provide proper autofills and jsx support.
 *
 *
 * @example //This requires typescript with react syntax
 * //Creates a new class that extends Container (div element). It has a method that adds a message to it.
 * class ChatContainerSingleton extends Nomx.Container {
 * 		addMessage(message: string){
 * 			this.addChildren(<div>{message}</div>)
 * 		}
 * }
 *
 * // Create an instance of ChatContainer with styles, and adds 2 messages to it.
 * const chatContainer = <ChatContainerSingleton style="position: absolute; width: 100%; height: 100%; overflow: auto"/> as ChatContainerSingleton
 * chatContainer.addMessage("hi, how are you");
 * chatContainer.addMessage("I'm fine");
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Nomx = void 0;
require("./types/applab");
var Nomx;
(function (Nomx) {
    var prefix = "Nomx_Gen_";
    var counter = 0;
    Nomx.ElementsById = {};
    ;
    var parser = (function () {
        // Regular Expressions for parsing tags and attributes
        var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Z-a-z0-9_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/, attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, attr2 = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/;
        var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");
        var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
        function makeMap(str) {
            var obj = {}, items = str.split(",");
            for (var i = 0; i < items.length; i++)
                obj[items[i]] = true;
            return obj;
        }
        function parseFragments(html) {
            var parsedTags = [];
            while (true) {
                var match = html.match(startTag);
                if (match) {
                    parsedTags.push([match[1], match[2]]);
                    html = html.substring(match[0].length);
                }
                else {
                    var matchEnd = html.match(endTag);
                    if (matchEnd) {
                        parsedTags.push([matchEnd[1]]);
                        html = html.substring(matchEnd[0].length);
                    }
                    else {
                        var index = html.indexOf("<");
                        if (index >= 0) {
                            //parsedTags.push(html.slice(0, index))
                            html = html.substring(index);
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            return parsedTags;
        }
        function parse(parsedTags) {
            var stack = [{ tagName: "", attributes: {}, children: [] }];
            for (var _i = 0, parsedTags_1 = parsedTags; _i < parsedTags_1.length; _i++) {
                var fragment = parsedTags_1[_i];
                if (typeof fragment === "string") {
                    //never
                    //stack[stack.length - 1].children.push(fragment)
                }
                else if (fragment.length === 2) {
                    var node = { tagName: "", attributes: {}, children: [] };
                    node.tagName = fragment[0];
                    for (var _a = 0, _b = fragment[1].match(attr) || []; _a < _b.length; _a++) {
                        var attribute = _b[_a];
                        var attrmatch = attribute.match(attr2);
                        node.attributes[attrmatch[1]] = attrmatch[2];
                    }
                    stack[stack.length - 1].children.push(node);
                    if (!empty[node.tagName] && !closeSelf[node.tagName]) {
                        stack.push(node);
                    }
                }
                else {
                    stack.pop();
                }
            }
            return stack[0].children;
        }
        //why the fuck this not working
        function getIds(parsedTags) {
            var stack = [];
            for (var _i = 0, parsedTags_2 = parsedTags; _i < parsedTags_2.length; _i++) {
                var fragment = parsedTags_2[_i];
                if (typeof fragment === "string") {
                    //stack[stack.length - 1].children.push(fragment)
                }
                else if (fragment.length === 2) {
                    var node = { tagName: "", attributes: {}, children: [] };
                    node.tagName = fragment[0];
                    for (var _a = 0, _b = fragment[1].match(attr) || []; _a < _b.length; _a++) {
                        var attribute = _b[_a];
                        var attrmatch = attribute.match(attr2);
                        node.attributes[attrmatch[1]] = attrmatch[2];
                    }
                    stack.push(node);
                }
            }
            return stack;
        }
        return { nodes: function (html) { return getIds(parseFragments(html)); }, tree: function (html) { return parse(parseFragments(html)); } };
    })();
    var StyleDeclaration = /** @class */ (function () {
        function StyleDeclaration(element) {
            this._computedStyleObj = {};
            this.lastStyle = "";
            this.element = element;
        }
        Object.defineProperty(StyleDeclaration.prototype, "additiveSymbols", {
            get: function () { return this.get("additive-symbols"); },
            set: function (v) { this.set("additive-symbols: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "alignContent", {
            get: function () { return this.get("align-content"); },
            set: function (v) { this.set("align-content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "alignItems", {
            get: function () { return this.get("align-items"); },
            set: function (v) { this.set("align-items: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "alignSelf", {
            get: function () { return this.get("align-self"); },
            set: function (v) { this.set("align-self: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "alignmentBaseline", {
            get: function () { return this.get("alignment-baseline"); },
            set: function (v) { this.set("alignment-baseline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animation", {
            get: function () { return this.get("animation"); },
            set: function (v) { this.set("animation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationDelay", {
            get: function () { return this.get("animation-delay"); },
            set: function (v) { this.set("animation-delay: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationDirection", {
            get: function () { return this.get("animation-direction"); },
            set: function (v) { this.set("animation-direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationDuration", {
            get: function () { return this.get("animation-duration"); },
            set: function (v) { this.set("animation-duration: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationFillMode", {
            get: function () { return this.get("animation-fill-mode"); },
            set: function (v) { this.set("animation-fill-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationIterationCount", {
            get: function () { return this.get("animation-iteration-count"); },
            set: function (v) { this.set("animation-iteration-count: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationName", {
            get: function () { return this.get("animation-name"); },
            set: function (v) { this.set("animation-name: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationPlayState", {
            get: function () { return this.get("animation-play-state"); },
            set: function (v) { this.set("animation-play-state: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "animationTimingFunction", {
            get: function () { return this.get("animation-timing-function"); },
            set: function (v) { this.set("animation-timing-function: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "appearance", {
            get: function () { return this.get("appearance"); },
            set: function (v) { this.set("appearance: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "ascentOverride", {
            get: function () { return this.get("ascent-override"); },
            set: function (v) { this.set("ascent-override: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "aspectRatio", {
            get: function () { return this.get("aspect-ratio"); },
            set: function (v) { this.set("aspect-ratio: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backdropFilter", {
            get: function () { return this.get("backdrop-filter"); },
            set: function (v) { this.set("backdrop-filter: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backfaceVisibility", {
            get: function () { return this.get("backface-visibility"); },
            set: function (v) { this.set("backface-visibility: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "background", {
            get: function () { return this.get("background"); },
            set: function (v) { this.set("background: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundAttachment", {
            get: function () { return this.get("background-attachment"); },
            set: function (v) { this.set("background-attachment: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundBlendMode", {
            get: function () { return this.get("background-blend-mode"); },
            set: function (v) { this.set("background-blend-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundClip", {
            get: function () { return this.get("background-clip"); },
            set: function (v) { this.set("background-clip: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundColor", {
            get: function () { return this.get("background-color"); },
            set: function (v) { this.set("background-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundImage", {
            get: function () { return this.get("background-image"); },
            set: function (v) { this.set("background-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundOrigin", {
            get: function () { return this.get("background-origin"); },
            set: function (v) { this.set("background-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundPosition", {
            get: function () { return this.get("background-position"); },
            set: function (v) { this.set("background-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundPositionX", {
            get: function () { return this.get("background-position-x"); },
            set: function (v) { this.set("background-position-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundPositionY", {
            get: function () { return this.get("background-position-y"); },
            set: function (v) { this.set("background-position-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundRepeat", {
            get: function () { return this.get("background-repeat"); },
            set: function (v) { this.set("background-repeat: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundRepeatX", {
            get: function () { return this.get("background-repeat-x"); },
            set: function (v) { this.set("background-repeat-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundRepeatY", {
            get: function () { return this.get("background-repeat-y"); },
            set: function (v) { this.set("background-repeat-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "backgroundSize", {
            get: function () { return this.get("background-size"); },
            set: function (v) { this.set("background-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "baselineShift", {
            get: function () { return this.get("baseline-shift"); },
            set: function (v) { this.set("baseline-shift: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "blockSize", {
            get: function () { return this.get("block-size"); },
            set: function (v) { this.set("block-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "border", {
            get: function () { return this.get("border"); },
            set: function (v) { this.set("border: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlock", {
            get: function () { return this.get("border-block"); },
            set: function (v) { this.set("border-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockColor", {
            get: function () { return this.get("border-block-color"); },
            set: function (v) { this.set("border-block-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockEnd", {
            get: function () { return this.get("border-block-end"); },
            set: function (v) { this.set("border-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockEndColor", {
            get: function () { return this.get("border-block-end-color"); },
            set: function (v) { this.set("border-block-end-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockEndStyle", {
            get: function () { return this.get("border-block-end-style"); },
            set: function (v) { this.set("border-block-end-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockEndWidth", {
            get: function () { return this.get("border-block-end-width"); },
            set: function (v) { this.set("border-block-end-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockStart", {
            get: function () { return this.get("border-block-start"); },
            set: function (v) { this.set("border-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockStartColor", {
            get: function () { return this.get("border-block-start-color"); },
            set: function (v) { this.set("border-block-start-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockStartStyle", {
            get: function () { return this.get("border-block-start-style"); },
            set: function (v) { this.set("border-block-start-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockStartWidth", {
            get: function () { return this.get("border-block-start-width"); },
            set: function (v) { this.set("border-block-start-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockStyle", {
            get: function () { return this.get("border-block-style"); },
            set: function (v) { this.set("border-block-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBlockWidth", {
            get: function () { return this.get("border-block-width"); },
            set: function (v) { this.set("border-block-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottom", {
            get: function () { return this.get("border-bottom"); },
            set: function (v) { this.set("border-bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottomColor", {
            get: function () { return this.get("border-bottom-color"); },
            set: function (v) { this.set("border-bottom-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottomLeftRadius", {
            get: function () { return this.get("border-bottom-left-radius"); },
            set: function (v) { this.set("border-bottom-left-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottomRightRadius", {
            get: function () { return this.get("border-bottom-right-radius"); },
            set: function (v) { this.set("border-bottom-right-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottomStyle", {
            get: function () { return this.get("border-bottom-style"); },
            set: function (v) { this.set("border-bottom-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderBottomWidth", {
            get: function () { return this.get("border-bottom-width"); },
            set: function (v) { this.set("border-bottom-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderCollapse", {
            get: function () { return this.get("border-collapse"); },
            set: function (v) { this.set("border-collapse: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderColor", {
            get: function () { return this.get("border-color"); },
            set: function (v) { this.set("border-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderEndEndRadius", {
            get: function () { return this.get("border-end-end-radius"); },
            set: function (v) { this.set("border-end-end-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderEndStartRadius", {
            get: function () { return this.get("border-end-start-radius"); },
            set: function (v) { this.set("border-end-start-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImage", {
            get: function () { return this.get("border-image"); },
            set: function (v) { this.set("border-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImageOutset", {
            get: function () { return this.get("border-image-outset"); },
            set: function (v) { this.set("border-image-outset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImageRepeat", {
            get: function () { return this.get("border-image-repeat"); },
            set: function (v) { this.set("border-image-repeat: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImageSlice", {
            get: function () { return this.get("border-image-slice"); },
            set: function (v) { this.set("border-image-slice: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImageSource", {
            get: function () { return this.get("border-image-source"); },
            set: function (v) { this.set("border-image-source: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderImageWidth", {
            get: function () { return this.get("border-image-width"); },
            set: function (v) { this.set("border-image-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInline", {
            get: function () { return this.get("border-inline"); },
            set: function (v) { this.set("border-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineColor", {
            get: function () { return this.get("border-inline-color"); },
            set: function (v) { this.set("border-inline-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineEnd", {
            get: function () { return this.get("border-inline-end"); },
            set: function (v) { this.set("border-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineEndColor", {
            get: function () { return this.get("border-inline-end-color"); },
            set: function (v) { this.set("border-inline-end-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineEndStyle", {
            get: function () { return this.get("border-inline-end-style"); },
            set: function (v) { this.set("border-inline-end-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineEndWidth", {
            get: function () { return this.get("border-inline-end-width"); },
            set: function (v) { this.set("border-inline-end-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineStart", {
            get: function () { return this.get("border-inline-start"); },
            set: function (v) { this.set("border-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineStartColor", {
            get: function () { return this.get("border-inline-start-color"); },
            set: function (v) { this.set("border-inline-start-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineStartStyle", {
            get: function () { return this.get("border-inline-start-style"); },
            set: function (v) { this.set("border-inline-start-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineStartWidth", {
            get: function () { return this.get("border-inline-start-width"); },
            set: function (v) { this.set("border-inline-start-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineStyle", {
            get: function () { return this.get("border-inline-style"); },
            set: function (v) { this.set("border-inline-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderInlineWidth", {
            get: function () { return this.get("border-inline-width"); },
            set: function (v) { this.set("border-inline-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderLeft", {
            get: function () { return this.get("border-left"); },
            set: function (v) { this.set("border-left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderLeftColor", {
            get: function () { return this.get("border-left-color"); },
            set: function (v) { this.set("border-left-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderLeftStyle", {
            get: function () { return this.get("border-left-style"); },
            set: function (v) { this.set("border-left-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderLeftWidth", {
            get: function () { return this.get("border-left-width"); },
            set: function (v) { this.set("border-left-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderRadius", {
            get: function () { return this.get("border-radius"); },
            set: function (v) { this.set("border-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderRight", {
            get: function () { return this.get("border-right"); },
            set: function (v) { this.set("border-right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderRightColor", {
            get: function () { return this.get("border-right-color"); },
            set: function (v) { this.set("border-right-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderRightStyle", {
            get: function () { return this.get("border-right-style"); },
            set: function (v) { this.set("border-right-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderRightWidth", {
            get: function () { return this.get("border-right-width"); },
            set: function (v) { this.set("border-right-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderSpacing", {
            get: function () { return this.get("border-spacing"); },
            set: function (v) { this.set("border-spacing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderStartEndRadius", {
            get: function () { return this.get("border-start-end-radius"); },
            set: function (v) { this.set("border-start-end-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderStartStartRadius", {
            get: function () { return this.get("border-start-start-radius"); },
            set: function (v) { this.set("border-start-start-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderStyle", {
            get: function () { return this.get("border-style"); },
            set: function (v) { this.set("border-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTop", {
            get: function () { return this.get("border-top"); },
            set: function (v) { this.set("border-top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTopColor", {
            get: function () { return this.get("border-top-color"); },
            set: function (v) { this.set("border-top-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTopLeftRadius", {
            get: function () { return this.get("border-top-left-radius"); },
            set: function (v) { this.set("border-top-left-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTopRightRadius", {
            get: function () { return this.get("border-top-right-radius"); },
            set: function (v) { this.set("border-top-right-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTopStyle", {
            get: function () { return this.get("border-top-style"); },
            set: function (v) { this.set("border-top-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderTopWidth", {
            get: function () { return this.get("border-top-width"); },
            set: function (v) { this.set("border-top-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "borderWidth", {
            get: function () { return this.get("border-width"); },
            set: function (v) { this.set("border-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "bottom", {
            get: function () { return this.get("bottom"); },
            set: function (v) { this.set("bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "boxShadow", {
            get: function () { return this.get("box-shadow"); },
            set: function (v) { this.set("box-shadow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "boxSizing", {
            get: function () { return this.get("box-sizing"); },
            set: function (v) { this.set("box-sizing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "breakAfter", {
            get: function () { return this.get("break-after"); },
            set: function (v) { this.set("break-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "breakBefore", {
            get: function () { return this.get("break-before"); },
            set: function (v) { this.set("break-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "breakInside", {
            get: function () { return this.get("break-inside"); },
            set: function (v) { this.set("break-inside: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "bufferedRendering", {
            get: function () { return this.get("buffered-rendering"); },
            set: function (v) { this.set("buffered-rendering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "captionSide", {
            get: function () { return this.get("caption-side"); },
            set: function (v) { this.set("caption-side: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "caretColor", {
            get: function () { return this.get("caret-color"); },
            set: function (v) { this.set("caret-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "clear", {
            get: function () { return this.get("clear"); },
            set: function (v) { this.set("clear: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "clip", {
            get: function () { return this.get("clip"); },
            set: function (v) { this.set("clip: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "clipPath", {
            get: function () { return this.get("clip-path"); },
            set: function (v) { this.set("clip-path: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "clipRule", {
            get: function () { return this.get("clip-rule"); },
            set: function (v) { this.set("clip-rule: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "color", {
            get: function () { return this.get("color"); },
            set: function (v) { this.set("color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "colorInterpolation", {
            get: function () { return this.get("color-interpolation"); },
            set: function (v) { this.set("color-interpolation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "colorInterpolationFilters", {
            get: function () { return this.get("color-interpolation-filters"); },
            set: function (v) { this.set("color-interpolation-filters: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "colorRendering", {
            get: function () { return this.get("color-rendering"); },
            set: function (v) { this.set("color-rendering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "colorScheme", {
            get: function () { return this.get("color-scheme"); },
            set: function (v) { this.set("color-scheme: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnCount", {
            get: function () { return this.get("column-count"); },
            set: function (v) { this.set("column-count: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnFill", {
            get: function () { return this.get("column-fill"); },
            set: function (v) { this.set("column-fill: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnGap", {
            get: function () { return this.get("column-gap"); },
            set: function (v) { this.set("column-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnRule", {
            get: function () { return this.get("column-rule"); },
            set: function (v) { this.set("column-rule: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnRuleColor", {
            get: function () { return this.get("column-rule-color"); },
            set: function (v) { this.set("column-rule-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnRuleStyle", {
            get: function () { return this.get("column-rule-style"); },
            set: function (v) { this.set("column-rule-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnRuleWidth", {
            get: function () { return this.get("column-rule-width"); },
            set: function (v) { this.set("column-rule-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnSpan", {
            get: function () { return this.get("column-span"); },
            set: function (v) { this.set("column-span: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columnWidth", {
            get: function () { return this.get("column-width"); },
            set: function (v) { this.set("column-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "columns", {
            get: function () { return this.get("columns"); },
            set: function (v) { this.set("columns: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "contain", {
            get: function () { return this.get("contain"); },
            set: function (v) { this.set("contain: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "containIntrinsicSize", {
            get: function () { return this.get("contain-intrinsic-size"); },
            set: function (v) { this.set("contain-intrinsic-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "content", {
            get: function () { return this.get("content"); },
            set: function (v) { this.set("content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "contentVisibility", {
            get: function () { return this.get("content-visibility"); },
            set: function (v) { this.set("content-visibility: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "counterIncrement", {
            get: function () { return this.get("counter-increment"); },
            set: function (v) { this.set("counter-increment: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "counterReset", {
            get: function () { return this.get("counter-reset"); },
            set: function (v) { this.set("counter-reset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "counterSet", {
            get: function () { return this.get("counter-set"); },
            set: function (v) { this.set("counter-set: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "cursor", {
            get: function () { return this.get("cursor"); },
            set: function (v) { this.set("cursor: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "cx", {
            get: function () { return this.get("cx"); },
            set: function (v) { this.set("cx: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "cy", {
            get: function () { return this.get("cy"); },
            set: function (v) { this.set("cy: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "d", {
            get: function () { return this.get("d"); },
            set: function (v) { this.set("d: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "descentOverride", {
            get: function () { return this.get("descent-override"); },
            set: function (v) { this.set("descent-override: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "direction", {
            get: function () { return this.get("direction"); },
            set: function (v) { this.set("direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "display", {
            get: function () { return this.get("display"); },
            set: function (v) { this.set("display: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "dominantBaseline", {
            get: function () { return this.get("dominant-baseline"); },
            set: function (v) { this.set("dominant-baseline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "emptyCells", {
            get: function () { return this.get("empty-cells"); },
            set: function (v) { this.set("empty-cells: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fallback", {
            get: function () { return this.get("fallback"); },
            set: function (v) { this.set("fallback: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fill", {
            get: function () { return this.get("fill"); },
            set: function (v) { this.set("fill: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fillOpacity", {
            get: function () { return this.get("fill-opacity"); },
            set: function (v) { this.set("fill-opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fillRule", {
            get: function () { return this.get("fill-rule"); },
            set: function (v) { this.set("fill-rule: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "filter", {
            get: function () { return this.get("filter"); },
            set: function (v) { this.set("filter: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flex", {
            get: function () { return this.get("flex"); },
            set: function (v) { this.set("flex: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexBasis", {
            get: function () { return this.get("flex-basis"); },
            set: function (v) { this.set("flex-basis: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexDirection", {
            get: function () { return this.get("flex-direction"); },
            set: function (v) { this.set("flex-direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexFlow", {
            get: function () { return this.get("flex-flow"); },
            set: function (v) { this.set("flex-flow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexGrow", {
            get: function () { return this.get("flex-grow"); },
            set: function (v) { this.set("flex-grow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexShrink", {
            get: function () { return this.get("flex-shrink"); },
            set: function (v) { this.set("flex-shrink: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "flexWrap", {
            get: function () { return this.get("flex-wrap"); },
            set: function (v) { this.set("flex-wrap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "float", {
            get: function () { return this.get("float"); },
            set: function (v) { this.set("float: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "floodColor", {
            get: function () { return this.get("flood-color"); },
            set: function (v) { this.set("flood-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "floodOpacity", {
            get: function () { return this.get("flood-opacity"); },
            set: function (v) { this.set("flood-opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "font", {
            get: function () { return this.get("font"); },
            set: function (v) { this.set("font: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontDisplay", {
            get: function () { return this.get("font-display"); },
            set: function (v) { this.set("font-display: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontFamily", {
            get: function () { return this.get("font-family"); },
            set: function (v) { this.set("font-family: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontFeatureSettings", {
            get: function () { return this.get("font-feature-settings"); },
            set: function (v) { this.set("font-feature-settings: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontKerning", {
            get: function () { return this.get("font-kerning"); },
            set: function (v) { this.set("font-kerning: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontOpticalSizing", {
            get: function () { return this.get("font-optical-sizing"); },
            set: function (v) { this.set("font-optical-sizing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontSize", {
            get: function () { return this.get("font-size"); },
            set: function (v) { this.set("font-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontStretch", {
            get: function () { return this.get("font-stretch"); },
            set: function (v) { this.set("font-stretch: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontStyle", {
            get: function () { return this.get("font-style"); },
            set: function (v) { this.set("font-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariant", {
            get: function () { return this.get("font-variant"); },
            set: function (v) { this.set("font-variant: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariantCaps", {
            get: function () { return this.get("font-variant-caps"); },
            set: function (v) { this.set("font-variant-caps: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariantEastAsian", {
            get: function () { return this.get("font-variant-east-asian"); },
            set: function (v) { this.set("font-variant-east-asian: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariantLigatures", {
            get: function () { return this.get("font-variant-ligatures"); },
            set: function (v) { this.set("font-variant-ligatures: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariantNumeric", {
            get: function () { return this.get("font-variant-numeric"); },
            set: function (v) { this.set("font-variant-numeric: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontVariationSettings", {
            get: function () { return this.get("font-variation-settings"); },
            set: function (v) { this.set("font-variation-settings: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "fontWeight", {
            get: function () { return this.get("font-weight"); },
            set: function (v) { this.set("font-weight: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "forcedColorAdjust", {
            get: function () { return this.get("forced-color-adjust"); },
            set: function (v) { this.set("forced-color-adjust: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gap", {
            get: function () { return this.get("gap"); },
            set: function (v) { this.set("gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "grid", {
            get: function () { return this.get("grid"); },
            set: function (v) { this.set("grid: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridArea", {
            get: function () { return this.get("grid-area"); },
            set: function (v) { this.set("grid-area: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridAutoColumns", {
            get: function () { return this.get("grid-auto-columns"); },
            set: function (v) { this.set("grid-auto-columns: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridAutoFlow", {
            get: function () { return this.get("grid-auto-flow"); },
            set: function (v) { this.set("grid-auto-flow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridAutoRows", {
            get: function () { return this.get("grid-auto-rows"); },
            set: function (v) { this.set("grid-auto-rows: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridColumn", {
            get: function () { return this.get("grid-column"); },
            set: function (v) { this.set("grid-column: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridColumnEnd", {
            get: function () { return this.get("grid-column-end"); },
            set: function (v) { this.set("grid-column-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridColumnGap", {
            get: function () { return this.get("grid-column-gap"); },
            set: function (v) { this.set("grid-column-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridColumnStart", {
            get: function () { return this.get("grid-column-start"); },
            set: function (v) { this.set("grid-column-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridGap", {
            get: function () { return this.get("grid-gap"); },
            set: function (v) { this.set("grid-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridRow", {
            get: function () { return this.get("grid-row"); },
            set: function (v) { this.set("grid-row: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridRowEnd", {
            get: function () { return this.get("grid-row-end"); },
            set: function (v) { this.set("grid-row-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridRowGap", {
            get: function () { return this.get("grid-row-gap"); },
            set: function (v) { this.set("grid-row-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridRowStart", {
            get: function () { return this.get("grid-row-start"); },
            set: function (v) { this.set("grid-row-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridTemplate", {
            get: function () { return this.get("grid-template"); },
            set: function (v) { this.set("grid-template: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridTemplateAreas", {
            get: function () { return this.get("grid-template-areas"); },
            set: function (v) { this.set("grid-template-areas: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridTemplateColumns", {
            get: function () { return this.get("grid-template-columns"); },
            set: function (v) { this.set("grid-template-columns: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "gridTemplateRows", {
            get: function () { return this.get("grid-template-rows"); },
            set: function (v) { this.set("grid-template-rows: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "height", {
            get: function () { return this.get("height"); },
            set: function (v) { this.set("height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "hyphens", {
            get: function () { return this.get("hyphens"); },
            set: function (v) { this.set("hyphens: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "imageOrientation", {
            get: function () { return this.get("image-orientation"); },
            set: function (v) { this.set("image-orientation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "imageRendering", {
            get: function () { return this.get("image-rendering"); },
            set: function (v) { this.set("image-rendering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "inherits", {
            get: function () { return this.get("inherits"); },
            set: function (v) { this.set("inherits: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "initialValue", {
            get: function () { return this.get("initial-value"); },
            set: function (v) { this.set("initial-value: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "inlineSize", {
            get: function () { return this.get("inline-size"); },
            set: function (v) { this.set("inline-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "inset", {
            get: function () { return this.get("inset"); },
            set: function (v) { this.set("inset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetBlock", {
            get: function () { return this.get("inset-block"); },
            set: function (v) { this.set("inset-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetBlockEnd", {
            get: function () { return this.get("inset-block-end"); },
            set: function (v) { this.set("inset-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetBlockStart", {
            get: function () { return this.get("inset-block-start"); },
            set: function (v) { this.set("inset-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetInline", {
            get: function () { return this.get("inset-inline"); },
            set: function (v) { this.set("inset-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetInlineEnd", {
            get: function () { return this.get("inset-inline-end"); },
            set: function (v) { this.set("inset-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "insetInlineStart", {
            get: function () { return this.get("inset-inline-start"); },
            set: function (v) { this.set("inset-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "isolation", {
            get: function () { return this.get("isolation"); },
            set: function (v) { this.set("isolation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "justifyContent", {
            get: function () { return this.get("justify-content"); },
            set: function (v) { this.set("justify-content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "justifyItems", {
            get: function () { return this.get("justify-items"); },
            set: function (v) { this.set("justify-items: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "justifySelf", {
            get: function () { return this.get("justify-self"); },
            set: function (v) { this.set("justify-self: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "left", {
            get: function () { return this.get("left"); },
            set: function (v) { this.set("left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "letterSpacing", {
            get: function () { return this.get("letter-spacing"); },
            set: function (v) { this.set("letter-spacing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "lightingColor", {
            get: function () { return this.get("lighting-color"); },
            set: function (v) { this.set("lighting-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "lineBreak", {
            get: function () { return this.get("line-break"); },
            set: function (v) { this.set("line-break: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "lineGapOverride", {
            get: function () { return this.get("line-gap-override"); },
            set: function (v) { this.set("line-gap-override: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "lineHeight", {
            get: function () { return this.get("line-height"); },
            set: function (v) { this.set("line-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "listStyle", {
            get: function () { return this.get("list-style"); },
            set: function (v) { this.set("list-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "listStyleImage", {
            get: function () { return this.get("list-style-image"); },
            set: function (v) { this.set("list-style-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "listStylePosition", {
            get: function () { return this.get("list-style-position"); },
            set: function (v) { this.set("list-style-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "listStyleType", {
            get: function () { return this.get("list-style-type"); },
            set: function (v) { this.set("list-style-type: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "margin", {
            get: function () { return this.get("margin"); },
            set: function (v) { this.set("margin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginBlock", {
            get: function () { return this.get("margin-block"); },
            set: function (v) { this.set("margin-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginBlockEnd", {
            get: function () { return this.get("margin-block-end"); },
            set: function (v) { this.set("margin-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginBlockStart", {
            get: function () { return this.get("margin-block-start"); },
            set: function (v) { this.set("margin-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginBottom", {
            get: function () { return this.get("margin-bottom"); },
            set: function (v) { this.set("margin-bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginInline", {
            get: function () { return this.get("margin-inline"); },
            set: function (v) { this.set("margin-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginInlineEnd", {
            get: function () { return this.get("margin-inline-end"); },
            set: function (v) { this.set("margin-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginInlineStart", {
            get: function () { return this.get("margin-inline-start"); },
            set: function (v) { this.set("margin-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginLeft", {
            get: function () { return this.get("margin-left"); },
            set: function (v) { this.set("margin-left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginRight", {
            get: function () { return this.get("margin-right"); },
            set: function (v) { this.set("margin-right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marginTop", {
            get: function () { return this.get("margin-top"); },
            set: function (v) { this.set("margin-top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "marker", {
            get: function () { return this.get("marker"); },
            set: function (v) { this.set("marker: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "markerEnd", {
            get: function () { return this.get("marker-end"); },
            set: function (v) { this.set("marker-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "markerMid", {
            get: function () { return this.get("marker-mid"); },
            set: function (v) { this.set("marker-mid: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "markerStart", {
            get: function () { return this.get("marker-start"); },
            set: function (v) { this.set("marker-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "mask", {
            get: function () { return this.get("mask"); },
            set: function (v) { this.set("mask: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maskType", {
            get: function () { return this.get("mask-type"); },
            set: function (v) { this.set("mask-type: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maxBlockSize", {
            get: function () { return this.get("max-block-size"); },
            set: function (v) { this.set("max-block-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maxHeight", {
            get: function () { return this.get("max-height"); },
            set: function (v) { this.set("max-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maxInlineSize", {
            get: function () { return this.get("max-inline-size"); },
            set: function (v) { this.set("max-inline-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maxWidth", {
            get: function () { return this.get("max-width"); },
            set: function (v) { this.set("max-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "maxZoom", {
            get: function () { return this.get("max-zoom"); },
            set: function (v) { this.set("max-zoom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "minBlockSize", {
            get: function () { return this.get("min-block-size"); },
            set: function (v) { this.set("min-block-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "minHeight", {
            get: function () { return this.get("min-height"); },
            set: function (v) { this.set("min-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "minInlineSize", {
            get: function () { return this.get("min-inline-size"); },
            set: function (v) { this.set("min-inline-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "minWidth", {
            get: function () { return this.get("min-width"); },
            set: function (v) { this.set("min-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "minZoom", {
            get: function () { return this.get("min-zoom"); },
            set: function (v) { this.set("min-zoom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "mixBlendMode", {
            get: function () { return this.get("mix-blend-mode"); },
            set: function (v) { this.set("mix-blend-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "negative", {
            get: function () { return this.get("negative"); },
            set: function (v) { this.set("negative: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "objectFit", {
            get: function () { return this.get("object-fit"); },
            set: function (v) { this.set("object-fit: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "objectPosition", {
            get: function () { return this.get("object-position"); },
            set: function (v) { this.set("object-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "offset", {
            get: function () { return this.get("offset"); },
            set: function (v) { this.set("offset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "offsetDistance", {
            get: function () { return this.get("offset-distance"); },
            set: function (v) { this.set("offset-distance: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "offsetPath", {
            get: function () { return this.get("offset-path"); },
            set: function (v) { this.set("offset-path: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "offsetRotate", {
            get: function () { return this.get("offset-rotate"); },
            set: function (v) { this.set("offset-rotate: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "opacity", {
            get: function () { return this.get("opacity"); },
            set: function (v) { this.set("opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "order", {
            get: function () { return this.get("order"); },
            set: function (v) { this.set("order: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "orientation", {
            get: function () { return this.get("orientation"); },
            set: function (v) { this.set("orientation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "orphans", {
            get: function () { return this.get("orphans"); },
            set: function (v) { this.set("orphans: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "outline", {
            get: function () { return this.get("outline"); },
            set: function (v) { this.set("outline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "outlineColor", {
            get: function () { return this.get("outline-color"); },
            set: function (v) { this.set("outline-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "outlineOffset", {
            get: function () { return this.get("outline-offset"); },
            set: function (v) { this.set("outline-offset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "outlineStyle", {
            get: function () { return this.get("outline-style"); },
            set: function (v) { this.set("outline-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "outlineWidth", {
            get: function () { return this.get("outline-width"); },
            set: function (v) { this.set("outline-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflow", {
            get: function () { return this.get("overflow"); },
            set: function (v) { this.set("overflow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflowAnchor", {
            get: function () { return this.get("overflow-anchor"); },
            set: function (v) { this.set("overflow-anchor: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflowClipMargin", {
            get: function () { return this.get("overflow-clip-margin"); },
            set: function (v) { this.set("overflow-clip-margin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflowWrap", {
            get: function () { return this.get("overflow-wrap"); },
            set: function (v) { this.set("overflow-wrap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflowX", {
            get: function () { return this.get("overflow-x"); },
            set: function (v) { this.set("overflow-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overflowY", {
            get: function () { return this.get("overflow-y"); },
            set: function (v) { this.set("overflow-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overscrollBehavior", {
            get: function () { return this.get("overscroll-behavior"); },
            set: function (v) { this.set("overscroll-behavior: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overscrollBehaviorBlock", {
            get: function () { return this.get("overscroll-behavior-block"); },
            set: function (v) { this.set("overscroll-behavior-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overscrollBehaviorInline", {
            get: function () { return this.get("overscroll-behavior-inline"); },
            set: function (v) { this.set("overscroll-behavior-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overscrollBehaviorX", {
            get: function () { return this.get("overscroll-behavior-x"); },
            set: function (v) { this.set("overscroll-behavior-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "overscrollBehaviorY", {
            get: function () { return this.get("overscroll-behavior-y"); },
            set: function (v) { this.set("overscroll-behavior-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pad", {
            get: function () { return this.get("pad"); },
            set: function (v) { this.set("pad: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "padding", {
            get: function () { return this.get("padding"); },
            set: function (v) { this.set("padding: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingBlock", {
            get: function () { return this.get("padding-block"); },
            set: function (v) { this.set("padding-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingBlockEnd", {
            get: function () { return this.get("padding-block-end"); },
            set: function (v) { this.set("padding-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingBlockStart", {
            get: function () { return this.get("padding-block-start"); },
            set: function (v) { this.set("padding-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingBottom", {
            get: function () { return this.get("padding-bottom"); },
            set: function (v) { this.set("padding-bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingInline", {
            get: function () { return this.get("padding-inline"); },
            set: function (v) { this.set("padding-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingInlineEnd", {
            get: function () { return this.get("padding-inline-end"); },
            set: function (v) { this.set("padding-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingInlineStart", {
            get: function () { return this.get("padding-inline-start"); },
            set: function (v) { this.set("padding-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingLeft", {
            get: function () { return this.get("padding-left"); },
            set: function (v) { this.set("padding-left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingRight", {
            get: function () { return this.get("padding-right"); },
            set: function (v) { this.set("padding-right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paddingTop", {
            get: function () { return this.get("padding-top"); },
            set: function (v) { this.set("padding-top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "page", {
            get: function () { return this.get("page"); },
            set: function (v) { this.set("page: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pageBreakAfter", {
            get: function () { return this.get("page-break-after"); },
            set: function (v) { this.set("page-break-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pageBreakBefore", {
            get: function () { return this.get("page-break-before"); },
            set: function (v) { this.set("page-break-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pageBreakInside", {
            get: function () { return this.get("page-break-inside"); },
            set: function (v) { this.set("page-break-inside: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pageOrientation", {
            get: function () { return this.get("page-orientation"); },
            set: function (v) { this.set("page-orientation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "paintOrder", {
            get: function () { return this.get("paint-order"); },
            set: function (v) { this.set("paint-order: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "perspective", {
            get: function () { return this.get("perspective"); },
            set: function (v) { this.set("perspective: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "perspectiveOrigin", {
            get: function () { return this.get("perspective-origin"); },
            set: function (v) { this.set("perspective-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "placeContent", {
            get: function () { return this.get("place-content"); },
            set: function (v) { this.set("place-content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "placeItems", {
            get: function () { return this.get("place-items"); },
            set: function (v) { this.set("place-items: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "placeSelf", {
            get: function () { return this.get("place-self"); },
            set: function (v) { this.set("place-self: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "pointerEvents", {
            get: function () { return this.get("pointer-events"); },
            set: function (v) { this.set("pointer-events: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "position", {
            get: function () { return this.get("position"); },
            set: function (v) { this.set("position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "prefix", {
            get: function () { return this.get("prefix"); },
            set: function (v) { this.set("prefix: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "quotes", {
            get: function () { return this.get("quotes"); },
            set: function (v) { this.set("quotes: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "r", {
            get: function () { return this.get("r"); },
            set: function (v) { this.set("r: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "range", {
            get: function () { return this.get("range"); },
            set: function (v) { this.set("range: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "resize", {
            get: function () { return this.get("resize"); },
            set: function (v) { this.set("resize: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "right", {
            get: function () { return this.get("right"); },
            set: function (v) { this.set("right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "rowGap", {
            get: function () { return this.get("row-gap"); },
            set: function (v) { this.set("row-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "rubyPosition", {
            get: function () { return this.get("ruby-position"); },
            set: function (v) { this.set("ruby-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "rx", {
            get: function () { return this.get("rx"); },
            set: function (v) { this.set("rx: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "ry", {
            get: function () { return this.get("ry"); },
            set: function (v) { this.set("ry: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollBehavior", {
            get: function () { return this.get("scroll-behavior"); },
            set: function (v) { this.set("scroll-behavior: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMargin", {
            get: function () { return this.get("scroll-margin"); },
            set: function (v) { this.set("scroll-margin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginBlock", {
            get: function () { return this.get("scroll-margin-block"); },
            set: function (v) { this.set("scroll-margin-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginBlockEnd", {
            get: function () { return this.get("scroll-margin-block-end"); },
            set: function (v) { this.set("scroll-margin-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginBlockStart", {
            get: function () { return this.get("scroll-margin-block-start"); },
            set: function (v) { this.set("scroll-margin-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginBottom", {
            get: function () { return this.get("scroll-margin-bottom"); },
            set: function (v) { this.set("scroll-margin-bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginInline", {
            get: function () { return this.get("scroll-margin-inline"); },
            set: function (v) { this.set("scroll-margin-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginInlineEnd", {
            get: function () { return this.get("scroll-margin-inline-end"); },
            set: function (v) { this.set("scroll-margin-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginInlineStart", {
            get: function () { return this.get("scroll-margin-inline-start"); },
            set: function (v) { this.set("scroll-margin-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginLeft", {
            get: function () { return this.get("scroll-margin-left"); },
            set: function (v) { this.set("scroll-margin-left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginRight", {
            get: function () { return this.get("scroll-margin-right"); },
            set: function (v) { this.set("scroll-margin-right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollMarginTop", {
            get: function () { return this.get("scroll-margin-top"); },
            set: function (v) { this.set("scroll-margin-top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPadding", {
            get: function () { return this.get("scroll-padding"); },
            set: function (v) { this.set("scroll-padding: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingBlock", {
            get: function () { return this.get("scroll-padding-block"); },
            set: function (v) { this.set("scroll-padding-block: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingBlockEnd", {
            get: function () { return this.get("scroll-padding-block-end"); },
            set: function (v) { this.set("scroll-padding-block-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingBlockStart", {
            get: function () { return this.get("scroll-padding-block-start"); },
            set: function (v) { this.set("scroll-padding-block-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingBottom", {
            get: function () { return this.get("scroll-padding-bottom"); },
            set: function (v) { this.set("scroll-padding-bottom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingInline", {
            get: function () { return this.get("scroll-padding-inline"); },
            set: function (v) { this.set("scroll-padding-inline: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingInlineEnd", {
            get: function () { return this.get("scroll-padding-inline-end"); },
            set: function (v) { this.set("scroll-padding-inline-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingInlineStart", {
            get: function () { return this.get("scroll-padding-inline-start"); },
            set: function (v) { this.set("scroll-padding-inline-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingLeft", {
            get: function () { return this.get("scroll-padding-left"); },
            set: function (v) { this.set("scroll-padding-left: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingRight", {
            get: function () { return this.get("scroll-padding-right"); },
            set: function (v) { this.set("scroll-padding-right: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollPaddingTop", {
            get: function () { return this.get("scroll-padding-top"); },
            set: function (v) { this.set("scroll-padding-top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollSnapAlign", {
            get: function () { return this.get("scroll-snap-align"); },
            set: function (v) { this.set("scroll-snap-align: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollSnapStop", {
            get: function () { return this.get("scroll-snap-stop"); },
            set: function (v) { this.set("scroll-snap-stop: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "scrollSnapType", {
            get: function () { return this.get("scroll-snap-type"); },
            set: function (v) { this.set("scroll-snap-type: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "shapeImageThreshold", {
            get: function () { return this.get("shape-image-threshold"); },
            set: function (v) { this.set("shape-image-threshold: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "shapeMargin", {
            get: function () { return this.get("shape-margin"); },
            set: function (v) { this.set("shape-margin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "shapeOutside", {
            get: function () { return this.get("shape-outside"); },
            set: function (v) { this.set("shape-outside: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "shapeRendering", {
            get: function () { return this.get("shape-rendering"); },
            set: function (v) { this.set("shape-rendering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "size", {
            get: function () { return this.get("size"); },
            set: function (v) { this.set("size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "speak", {
            get: function () { return this.get("speak"); },
            set: function (v) { this.set("speak: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "speakAs", {
            get: function () { return this.get("speak-as"); },
            set: function (v) { this.set("speak-as: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "src", {
            get: function () { return this.get("src"); },
            set: function (v) { this.set("src: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "stopColor", {
            get: function () { return this.get("stop-color"); },
            set: function (v) { this.set("stop-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "stopOpacity", {
            get: function () { return this.get("stop-opacity"); },
            set: function (v) { this.set("stop-opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "stroke", {
            get: function () { return this.get("stroke"); },
            set: function (v) { this.set("stroke: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeDasharray", {
            get: function () { return this.get("stroke-dasharray"); },
            set: function (v) { this.set("stroke-dasharray: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeDashoffset", {
            get: function () { return this.get("stroke-dashoffset"); },
            set: function (v) { this.set("stroke-dashoffset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeLinecap", {
            get: function () { return this.get("stroke-linecap"); },
            set: function (v) { this.set("stroke-linecap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeLinejoin", {
            get: function () { return this.get("stroke-linejoin"); },
            set: function (v) { this.set("stroke-linejoin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeMiterlimit", {
            get: function () { return this.get("stroke-miterlimit"); },
            set: function (v) { this.set("stroke-miterlimit: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeOpacity", {
            get: function () { return this.get("stroke-opacity"); },
            set: function (v) { this.set("stroke-opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "strokeWidth", {
            get: function () { return this.get("stroke-width"); },
            set: function (v) { this.set("stroke-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "suffix", {
            get: function () { return this.get("suffix"); },
            set: function (v) { this.set("suffix: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "symbols", {
            get: function () { return this.get("symbols"); },
            set: function (v) { this.set("symbols: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "syntax", {
            get: function () { return this.get("syntax"); },
            set: function (v) { this.set("syntax: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "system", {
            get: function () { return this.get("system"); },
            set: function (v) { this.set("system: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "tabSize", {
            get: function () { return this.get("tab-size"); },
            set: function (v) { this.set("tab-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "tableLayout", {
            get: function () { return this.get("table-layout"); },
            set: function (v) { this.set("table-layout: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textAlign", {
            get: function () { return this.get("text-align"); },
            set: function (v) { this.set("text-align: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textAlignLast", {
            get: function () { return this.get("text-align-last"); },
            set: function (v) { this.set("text-align-last: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textAnchor", {
            get: function () { return this.get("text-anchor"); },
            set: function (v) { this.set("text-anchor: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textCombineUpright", {
            get: function () { return this.get("text-combine-upright"); },
            set: function (v) { this.set("text-combine-upright: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecoration", {
            get: function () { return this.get("text-decoration"); },
            set: function (v) { this.set("text-decoration: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecorationColor", {
            get: function () { return this.get("text-decoration-color"); },
            set: function (v) { this.set("text-decoration-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecorationLine", {
            get: function () { return this.get("text-decoration-line"); },
            set: function (v) { this.set("text-decoration-line: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecorationSkipInk", {
            get: function () { return this.get("text-decoration-skip-ink"); },
            set: function (v) { this.set("text-decoration-skip-ink: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecorationStyle", {
            get: function () { return this.get("text-decoration-style"); },
            set: function (v) { this.set("text-decoration-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textDecorationThickness", {
            get: function () { return this.get("text-decoration-thickness"); },
            set: function (v) { this.set("text-decoration-thickness: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textIndent", {
            get: function () { return this.get("text-indent"); },
            set: function (v) { this.set("text-indent: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textOrientation", {
            get: function () { return this.get("text-orientation"); },
            set: function (v) { this.set("text-orientation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textOverflow", {
            get: function () { return this.get("text-overflow"); },
            set: function (v) { this.set("text-overflow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textRendering", {
            get: function () { return this.get("text-rendering"); },
            set: function (v) { this.set("text-rendering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textShadow", {
            get: function () { return this.get("text-shadow"); },
            set: function (v) { this.set("text-shadow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textSizeAdjust", {
            get: function () { return this.get("text-size-adjust"); },
            set: function (v) { this.set("text-size-adjust: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textTransform", {
            get: function () { return this.get("text-transform"); },
            set: function (v) { this.set("text-transform: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textUnderlineOffset", {
            get: function () { return this.get("text-underline-offset"); },
            set: function (v) { this.set("text-underline-offset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "textUnderlinePosition", {
            get: function () { return this.get("text-underline-position"); },
            set: function (v) { this.set("text-underline-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "top", {
            get: function () { return this.get("top"); },
            set: function (v) { this.set("top: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "touchAction", {
            get: function () { return this.get("touch-action"); },
            set: function (v) { this.set("touch-action: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transform", {
            get: function () { return this.get("transform"); },
            set: function (v) { this.set("transform: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transformBox", {
            get: function () { return this.get("transform-box"); },
            set: function (v) { this.set("transform-box: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transformOrigin", {
            get: function () { return this.get("transform-origin"); },
            set: function (v) { this.set("transform-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transformStyle", {
            get: function () { return this.get("transform-style"); },
            set: function (v) { this.set("transform-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transition", {
            get: function () { return this.get("transition"); },
            set: function (v) { this.set("transition: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transitionDelay", {
            get: function () { return this.get("transition-delay"); },
            set: function (v) { this.set("transition-delay: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transitionDuration", {
            get: function () { return this.get("transition-duration"); },
            set: function (v) { this.set("transition-duration: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transitionProperty", {
            get: function () { return this.get("transition-property"); },
            set: function (v) { this.set("transition-property: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "transitionTimingFunction", {
            get: function () { return this.get("transition-timing-function"); },
            set: function (v) { this.set("transition-timing-function: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "unicodeBidi", {
            get: function () { return this.get("unicode-bidi"); },
            set: function (v) { this.set("unicode-bidi: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "unicodeRange", {
            get: function () { return this.get("unicode-range"); },
            set: function (v) { this.set("unicode-range: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "userSelect", {
            get: function () { return this.get("user-select"); },
            set: function (v) { this.set("user-select: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "userZoom", {
            get: function () { return this.get("user-zoom"); },
            set: function (v) { this.set("user-zoom: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "vectorEffect", {
            get: function () { return this.get("vector-effect"); },
            set: function (v) { this.set("vector-effect: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "verticalAlign", {
            get: function () { return this.get("vertical-align"); },
            set: function (v) { this.set("vertical-align: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "visibility", {
            get: function () { return this.get("visibility"); },
            set: function (v) { this.set("visibility: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAlignContent", {
            get: function () { return this.get("webkit-align-content"); },
            set: function (v) { this.set("webkit-align-content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAlignItems", {
            get: function () { return this.get("webkit-align-items"); },
            set: function (v) { this.set("webkit-align-items: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAlignSelf", {
            get: function () { return this.get("webkit-align-self"); },
            set: function (v) { this.set("webkit-align-self: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimation", {
            get: function () { return this.get("webkit-animation"); },
            set: function (v) { this.set("webkit-animation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationDelay", {
            get: function () { return this.get("webkit-animation-delay"); },
            set: function (v) { this.set("webkit-animation-delay: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationDirection", {
            get: function () { return this.get("webkit-animation-direction"); },
            set: function (v) { this.set("webkit-animation-direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationDuration", {
            get: function () { return this.get("webkit-animation-duration"); },
            set: function (v) { this.set("webkit-animation-duration: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationFillMode", {
            get: function () { return this.get("webkit-animation-fill-mode"); },
            set: function (v) { this.set("webkit-animation-fill-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationIterationCount", {
            get: function () { return this.get("webkit-animation-iteration-count"); },
            set: function (v) { this.set("webkit-animation-iteration-count: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationName", {
            get: function () { return this.get("webkit-animation-name"); },
            set: function (v) { this.set("webkit-animation-name: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationPlayState", {
            get: function () { return this.get("webkit-animation-play-state"); },
            set: function (v) { this.set("webkit-animation-play-state: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAnimationTimingFunction", {
            get: function () { return this.get("webkit-animation-timing-function"); },
            set: function (v) { this.set("webkit-animation-timing-function: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAppRegion", {
            get: function () { return this.get("webkit-app-region"); },
            set: function (v) { this.set("webkit-app-region: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitAppearance", {
            get: function () { return this.get("webkit-appearance"); },
            set: function (v) { this.set("webkit-appearance: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBackfaceVisibility", {
            get: function () { return this.get("webkit-backface-visibility"); },
            set: function (v) { this.set("webkit-backface-visibility: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBackgroundClip", {
            get: function () { return this.get("webkit-background-clip"); },
            set: function (v) { this.set("webkit-background-clip: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBackgroundOrigin", {
            get: function () { return this.get("webkit-background-origin"); },
            set: function (v) { this.set("webkit-background-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBackgroundSize", {
            get: function () { return this.get("webkit-background-size"); },
            set: function (v) { this.set("webkit-background-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderAfter", {
            get: function () { return this.get("webkit-border-after"); },
            set: function (v) { this.set("webkit-border-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderAfterColor", {
            get: function () { return this.get("webkit-border-after-color"); },
            set: function (v) { this.set("webkit-border-after-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderAfterStyle", {
            get: function () { return this.get("webkit-border-after-style"); },
            set: function (v) { this.set("webkit-border-after-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderAfterWidth", {
            get: function () { return this.get("webkit-border-after-width"); },
            set: function (v) { this.set("webkit-border-after-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBefore", {
            get: function () { return this.get("webkit-border-before"); },
            set: function (v) { this.set("webkit-border-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBeforeColor", {
            get: function () { return this.get("webkit-border-before-color"); },
            set: function (v) { this.set("webkit-border-before-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBeforeStyle", {
            get: function () { return this.get("webkit-border-before-style"); },
            set: function (v) { this.set("webkit-border-before-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBeforeWidth", {
            get: function () { return this.get("webkit-border-before-width"); },
            set: function (v) { this.set("webkit-border-before-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBottomLeftRadius", {
            get: function () { return this.get("webkit-border-bottom-left-radius"); },
            set: function (v) { this.set("webkit-border-bottom-left-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderBottomRightRadius", {
            get: function () { return this.get("webkit-border-bottom-right-radius"); },
            set: function (v) { this.set("webkit-border-bottom-right-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderEnd", {
            get: function () { return this.get("webkit-border-end"); },
            set: function (v) { this.set("webkit-border-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderEndColor", {
            get: function () { return this.get("webkit-border-end-color"); },
            set: function (v) { this.set("webkit-border-end-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderEndStyle", {
            get: function () { return this.get("webkit-border-end-style"); },
            set: function (v) { this.set("webkit-border-end-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderEndWidth", {
            get: function () { return this.get("webkit-border-end-width"); },
            set: function (v) { this.set("webkit-border-end-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderHorizontalSpacing", {
            get: function () { return this.get("webkit-border-horizontal-spacing"); },
            set: function (v) { this.set("webkit-border-horizontal-spacing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderImage", {
            get: function () { return this.get("webkit-border-image"); },
            set: function (v) { this.set("webkit-border-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderRadius", {
            get: function () { return this.get("webkit-border-radius"); },
            set: function (v) { this.set("webkit-border-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderStart", {
            get: function () { return this.get("webkit-border-start"); },
            set: function (v) { this.set("webkit-border-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderStartColor", {
            get: function () { return this.get("webkit-border-start-color"); },
            set: function (v) { this.set("webkit-border-start-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderStartStyle", {
            get: function () { return this.get("webkit-border-start-style"); },
            set: function (v) { this.set("webkit-border-start-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderStartWidth", {
            get: function () { return this.get("webkit-border-start-width"); },
            set: function (v) { this.set("webkit-border-start-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderTopLeftRadius", {
            get: function () { return this.get("webkit-border-top-left-radius"); },
            set: function (v) { this.set("webkit-border-top-left-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderTopRightRadius", {
            get: function () { return this.get("webkit-border-top-right-radius"); },
            set: function (v) { this.set("webkit-border-top-right-radius: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBorderVerticalSpacing", {
            get: function () { return this.get("webkit-border-vertical-spacing"); },
            set: function (v) { this.set("webkit-border-vertical-spacing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxAlign", {
            get: function () { return this.get("webkit-box-align"); },
            set: function (v) { this.set("webkit-box-align: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxDecorationBreak", {
            get: function () { return this.get("webkit-box-decoration-break"); },
            set: function (v) { this.set("webkit-box-decoration-break: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxDirection", {
            get: function () { return this.get("webkit-box-direction"); },
            set: function (v) { this.set("webkit-box-direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxFlex", {
            get: function () { return this.get("webkit-box-flex"); },
            set: function (v) { this.set("webkit-box-flex: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxOrdinalGroup", {
            get: function () { return this.get("webkit-box-ordinal-group"); },
            set: function (v) { this.set("webkit-box-ordinal-group: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxOrient", {
            get: function () { return this.get("webkit-box-orient"); },
            set: function (v) { this.set("webkit-box-orient: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxPack", {
            get: function () { return this.get("webkit-box-pack"); },
            set: function (v) { this.set("webkit-box-pack: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxReflect", {
            get: function () { return this.get("webkit-box-reflect"); },
            set: function (v) { this.set("webkit-box-reflect: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxShadow", {
            get: function () { return this.get("webkit-box-shadow"); },
            set: function (v) { this.set("webkit-box-shadow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitBoxSizing", {
            get: function () { return this.get("webkit-box-sizing"); },
            set: function (v) { this.set("webkit-box-sizing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitClipPath", {
            get: function () { return this.get("webkit-clip-path"); },
            set: function (v) { this.set("webkit-clip-path: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnBreakAfter", {
            get: function () { return this.get("webkit-column-break-after"); },
            set: function (v) { this.set("webkit-column-break-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnBreakBefore", {
            get: function () { return this.get("webkit-column-break-before"); },
            set: function (v) { this.set("webkit-column-break-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnBreakInside", {
            get: function () { return this.get("webkit-column-break-inside"); },
            set: function (v) { this.set("webkit-column-break-inside: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnCount", {
            get: function () { return this.get("webkit-column-count"); },
            set: function (v) { this.set("webkit-column-count: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnGap", {
            get: function () { return this.get("webkit-column-gap"); },
            set: function (v) { this.set("webkit-column-gap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnRule", {
            get: function () { return this.get("webkit-column-rule"); },
            set: function (v) { this.set("webkit-column-rule: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnRuleColor", {
            get: function () { return this.get("webkit-column-rule-color"); },
            set: function (v) { this.set("webkit-column-rule-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnRuleStyle", {
            get: function () { return this.get("webkit-column-rule-style"); },
            set: function (v) { this.set("webkit-column-rule-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnRuleWidth", {
            get: function () { return this.get("webkit-column-rule-width"); },
            set: function (v) { this.set("webkit-column-rule-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnSpan", {
            get: function () { return this.get("webkit-column-span"); },
            set: function (v) { this.set("webkit-column-span: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumnWidth", {
            get: function () { return this.get("webkit-column-width"); },
            set: function (v) { this.set("webkit-column-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitColumns", {
            get: function () { return this.get("webkit-columns"); },
            set: function (v) { this.set("webkit-columns: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFilter", {
            get: function () { return this.get("webkit-filter"); },
            set: function (v) { this.set("webkit-filter: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlex", {
            get: function () { return this.get("webkit-flex"); },
            set: function (v) { this.set("webkit-flex: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexBasis", {
            get: function () { return this.get("webkit-flex-basis"); },
            set: function (v) { this.set("webkit-flex-basis: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexDirection", {
            get: function () { return this.get("webkit-flex-direction"); },
            set: function (v) { this.set("webkit-flex-direction: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexFlow", {
            get: function () { return this.get("webkit-flex-flow"); },
            set: function (v) { this.set("webkit-flex-flow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexGrow", {
            get: function () { return this.get("webkit-flex-grow"); },
            set: function (v) { this.set("webkit-flex-grow: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexShrink", {
            get: function () { return this.get("webkit-flex-shrink"); },
            set: function (v) { this.set("webkit-flex-shrink: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFlexWrap", {
            get: function () { return this.get("webkit-flex-wrap"); },
            set: function (v) { this.set("webkit-flex-wrap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFontFeatureSettings", {
            get: function () { return this.get("webkit-font-feature-settings"); },
            set: function (v) { this.set("webkit-font-feature-settings: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitFontSmoothing", {
            get: function () { return this.get("webkit-font-smoothing"); },
            set: function (v) { this.set("webkit-font-smoothing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitHighlight", {
            get: function () { return this.get("webkit-highlight"); },
            set: function (v) { this.set("webkit-highlight: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitHyphenateCharacter", {
            get: function () { return this.get("webkit-hyphenate-character"); },
            set: function (v) { this.set("webkit-hyphenate-character: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitJustifyContent", {
            get: function () { return this.get("webkit-justify-content"); },
            set: function (v) { this.set("webkit-justify-content: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitLineBreak", {
            get: function () { return this.get("webkit-line-break"); },
            set: function (v) { this.set("webkit-line-break: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitLineClamp", {
            get: function () { return this.get("webkit-line-clamp"); },
            set: function (v) { this.set("webkit-line-clamp: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitLocale", {
            get: function () { return this.get("webkit-locale"); },
            set: function (v) { this.set("webkit-locale: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitLogicalHeight", {
            get: function () { return this.get("webkit-logical-height"); },
            set: function (v) { this.set("webkit-logical-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitLogicalWidth", {
            get: function () { return this.get("webkit-logical-width"); },
            set: function (v) { this.set("webkit-logical-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMarginAfter", {
            get: function () { return this.get("webkit-margin-after"); },
            set: function (v) { this.set("webkit-margin-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMarginBefore", {
            get: function () { return this.get("webkit-margin-before"); },
            set: function (v) { this.set("webkit-margin-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMarginEnd", {
            get: function () { return this.get("webkit-margin-end"); },
            set: function (v) { this.set("webkit-margin-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMarginStart", {
            get: function () { return this.get("webkit-margin-start"); },
            set: function (v) { this.set("webkit-margin-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMask", {
            get: function () { return this.get("webkit-mask"); },
            set: function (v) { this.set("webkit-mask: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImage", {
            get: function () { return this.get("webkit-mask-box-image"); },
            set: function (v) { this.set("webkit-mask-box-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImageOutset", {
            get: function () { return this.get("webkit-mask-box-image-outset"); },
            set: function (v) { this.set("webkit-mask-box-image-outset: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImageRepeat", {
            get: function () { return this.get("webkit-mask-box-image-repeat"); },
            set: function (v) { this.set("webkit-mask-box-image-repeat: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImageSlice", {
            get: function () { return this.get("webkit-mask-box-image-slice"); },
            set: function (v) { this.set("webkit-mask-box-image-slice: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImageSource", {
            get: function () { return this.get("webkit-mask-box-image-source"); },
            set: function (v) { this.set("webkit-mask-box-image-source: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskBoxImageWidth", {
            get: function () { return this.get("webkit-mask-box-image-width"); },
            set: function (v) { this.set("webkit-mask-box-image-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskClip", {
            get: function () { return this.get("webkit-mask-clip"); },
            set: function (v) { this.set("webkit-mask-clip: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskComposite", {
            get: function () { return this.get("webkit-mask-composite"); },
            set: function (v) { this.set("webkit-mask-composite: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskImage", {
            get: function () { return this.get("webkit-mask-image"); },
            set: function (v) { this.set("webkit-mask-image: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskOrigin", {
            get: function () { return this.get("webkit-mask-origin"); },
            set: function (v) { this.set("webkit-mask-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskPosition", {
            get: function () { return this.get("webkit-mask-position"); },
            set: function (v) { this.set("webkit-mask-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskPositionX", {
            get: function () { return this.get("webkit-mask-position-x"); },
            set: function (v) { this.set("webkit-mask-position-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskPositionY", {
            get: function () { return this.get("webkit-mask-position-y"); },
            set: function (v) { this.set("webkit-mask-position-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskRepeat", {
            get: function () { return this.get("webkit-mask-repeat"); },
            set: function (v) { this.set("webkit-mask-repeat: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskRepeatX", {
            get: function () { return this.get("webkit-mask-repeat-x"); },
            set: function (v) { this.set("webkit-mask-repeat-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskRepeatY", {
            get: function () { return this.get("webkit-mask-repeat-y"); },
            set: function (v) { this.set("webkit-mask-repeat-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaskSize", {
            get: function () { return this.get("webkit-mask-size"); },
            set: function (v) { this.set("webkit-mask-size: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaxLogicalHeight", {
            get: function () { return this.get("webkit-max-logical-height"); },
            set: function (v) { this.set("webkit-max-logical-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMaxLogicalWidth", {
            get: function () { return this.get("webkit-max-logical-width"); },
            set: function (v) { this.set("webkit-max-logical-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMinLogicalHeight", {
            get: function () { return this.get("webkit-min-logical-height"); },
            set: function (v) { this.set("webkit-min-logical-height: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitMinLogicalWidth", {
            get: function () { return this.get("webkit-min-logical-width"); },
            set: function (v) { this.set("webkit-min-logical-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitOpacity", {
            get: function () { return this.get("webkit-opacity"); },
            set: function (v) { this.set("webkit-opacity: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitOrder", {
            get: function () { return this.get("webkit-order"); },
            set: function (v) { this.set("webkit-order: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPaddingAfter", {
            get: function () { return this.get("webkit-padding-after"); },
            set: function (v) { this.set("webkit-padding-after: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPaddingBefore", {
            get: function () { return this.get("webkit-padding-before"); },
            set: function (v) { this.set("webkit-padding-before: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPaddingEnd", {
            get: function () { return this.get("webkit-padding-end"); },
            set: function (v) { this.set("webkit-padding-end: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPaddingStart", {
            get: function () { return this.get("webkit-padding-start"); },
            set: function (v) { this.set("webkit-padding-start: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPerspective", {
            get: function () { return this.get("webkit-perspective"); },
            set: function (v) { this.set("webkit-perspective: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPerspectiveOrigin", {
            get: function () { return this.get("webkit-perspective-origin"); },
            set: function (v) { this.set("webkit-perspective-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPerspectiveOriginX", {
            get: function () { return this.get("webkit-perspective-origin-x"); },
            set: function (v) { this.set("webkit-perspective-origin-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPerspectiveOriginY", {
            get: function () { return this.get("webkit-perspective-origin-y"); },
            set: function (v) { this.set("webkit-perspective-origin-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitPrintColorAdjust", {
            get: function () { return this.get("webkit-print-color-adjust"); },
            set: function (v) { this.set("webkit-print-color-adjust: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitRtlOrdering", {
            get: function () { return this.get("webkit-rtl-ordering"); },
            set: function (v) { this.set("webkit-rtl-ordering: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitRubyPosition", {
            get: function () { return this.get("webkit-ruby-position"); },
            set: function (v) { this.set("webkit-ruby-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitShapeImageThreshold", {
            get: function () { return this.get("webkit-shape-image-threshold"); },
            set: function (v) { this.set("webkit-shape-image-threshold: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitShapeMargin", {
            get: function () { return this.get("webkit-shape-margin"); },
            set: function (v) { this.set("webkit-shape-margin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitShapeOutside", {
            get: function () { return this.get("webkit-shape-outside"); },
            set: function (v) { this.set("webkit-shape-outside: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTapHighlightColor", {
            get: function () { return this.get("webkit-tap-highlight-color"); },
            set: function (v) { this.set("webkit-tap-highlight-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextCombine", {
            get: function () { return this.get("webkit-text-combine"); },
            set: function (v) { this.set("webkit-text-combine: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextDecorationsInEffect", {
            get: function () { return this.get("webkit-text-decorations-in-effect"); },
            set: function (v) { this.set("webkit-text-decorations-in-effect: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextEmphasis", {
            get: function () { return this.get("webkit-text-emphasis"); },
            set: function (v) { this.set("webkit-text-emphasis: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextEmphasisColor", {
            get: function () { return this.get("webkit-text-emphasis-color"); },
            set: function (v) { this.set("webkit-text-emphasis-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextEmphasisPosition", {
            get: function () { return this.get("webkit-text-emphasis-position"); },
            set: function (v) { this.set("webkit-text-emphasis-position: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextEmphasisStyle", {
            get: function () { return this.get("webkit-text-emphasis-style"); },
            set: function (v) { this.set("webkit-text-emphasis-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextFillColor", {
            get: function () { return this.get("webkit-text-fill-color"); },
            set: function (v) { this.set("webkit-text-fill-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextOrientation", {
            get: function () { return this.get("webkit-text-orientation"); },
            set: function (v) { this.set("webkit-text-orientation: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextSecurity", {
            get: function () { return this.get("webkit-text-security"); },
            set: function (v) { this.set("webkit-text-security: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextSizeAdjust", {
            get: function () { return this.get("webkit-text-size-adjust"); },
            set: function (v) { this.set("webkit-text-size-adjust: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextStroke", {
            get: function () { return this.get("webkit-text-stroke"); },
            set: function (v) { this.set("webkit-text-stroke: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextStrokeColor", {
            get: function () { return this.get("webkit-text-stroke-color"); },
            set: function (v) { this.set("webkit-text-stroke-color: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTextStrokeWidth", {
            get: function () { return this.get("webkit-text-stroke-width"); },
            set: function (v) { this.set("webkit-text-stroke-width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransform", {
            get: function () { return this.get("webkit-transform"); },
            set: function (v) { this.set("webkit-transform: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransformOrigin", {
            get: function () { return this.get("webkit-transform-origin"); },
            set: function (v) { this.set("webkit-transform-origin: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransformOriginX", {
            get: function () { return this.get("webkit-transform-origin-x"); },
            set: function (v) { this.set("webkit-transform-origin-x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransformOriginY", {
            get: function () { return this.get("webkit-transform-origin-y"); },
            set: function (v) { this.set("webkit-transform-origin-y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransformOriginZ", {
            get: function () { return this.get("webkit-transform-origin-z"); },
            set: function (v) { this.set("webkit-transform-origin-z: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransformStyle", {
            get: function () { return this.get("webkit-transform-style"); },
            set: function (v) { this.set("webkit-transform-style: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransition", {
            get: function () { return this.get("webkit-transition"); },
            set: function (v) { this.set("webkit-transition: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransitionDelay", {
            get: function () { return this.get("webkit-transition-delay"); },
            set: function (v) { this.set("webkit-transition-delay: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransitionDuration", {
            get: function () { return this.get("webkit-transition-duration"); },
            set: function (v) { this.set("webkit-transition-duration: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransitionProperty", {
            get: function () { return this.get("webkit-transition-property"); },
            set: function (v) { this.set("webkit-transition-property: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitTransitionTimingFunction", {
            get: function () { return this.get("webkit-transition-timing-function"); },
            set: function (v) { this.set("webkit-transition-timing-function: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitUserDrag", {
            get: function () { return this.get("webkit-user-drag"); },
            set: function (v) { this.set("webkit-user-drag: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitUserModify", {
            get: function () { return this.get("webkit-user-modify"); },
            set: function (v) { this.set("webkit-user-modify: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitUserSelect", {
            get: function () { return this.get("webkit-user-select"); },
            set: function (v) { this.set("webkit-user-select: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "webkitWritingMode", {
            get: function () { return this.get("webkit-writing-mode"); },
            set: function (v) { this.set("webkit-writing-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "whiteSpace", {
            get: function () { return this.get("white-space"); },
            set: function (v) { this.set("white-space: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "widows", {
            get: function () { return this.get("widows"); },
            set: function (v) { this.set("widows: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "width", {
            get: function () { return this.get("width"); },
            set: function (v) { this.set("width: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "willChange", {
            get: function () { return this.get("will-change"); },
            set: function (v) { this.set("will-change: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "wordBreak", {
            get: function () { return this.get("word-break"); },
            set: function (v) { this.set("word-break: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "wordSpacing", {
            get: function () { return this.get("word-spacing"); },
            set: function (v) { this.set("word-spacing: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "wordWrap", {
            get: function () { return this.get("word-wrap"); },
            set: function (v) { this.set("word-wrap: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "writingMode", {
            get: function () { return this.get("writing-mode"); },
            set: function (v) { this.set("writing-mode: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "x", {
            get: function () { return this.get("x"); },
            set: function (v) { this.set("x: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "y", {
            get: function () { return this.get("y"); },
            set: function (v) { this.set("y: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "zIndex", {
            get: function () { return this.get("z-index"); },
            set: function (v) { this.set("z-index: " + v); },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(StyleDeclaration.prototype, "zoom", {
            get: function () { return this.get("zoom"); },
            set: function (v) { this.set("zoom: " + v); },
            enumerable: false,
            configurable: true
        });
        StyleDeclaration.prototype.get = function (prop) {
            return this.computedStyleObj[prop];
        };
        StyleDeclaration.prototype.set = function (style) {
            this.element.setStyle(style);
        };
        Object.defineProperty(StyleDeclaration.prototype, "computedStyleObj", {
            get: function () {
                var _this = this;
                if (this.element.style !== this.lastStyle) {
                    this._computedStyleObj = {};
                    this.element.style.split(/;\s*/g).forEach(function (s) {
                        var p = s.match(/([a-z]+(?:\-[a-z]+)*):\s*(.+)/);
                        _this._computedStyleObj[p[1]] = p[2];
                    });
                }
                return this._computedStyleObj;
            },
            enumerable: false,
            configurable: true
        });
        return StyleDeclaration;
    }());
    // #Element
    var Element = /** @class */ (function () {
        /** Given a transformer function, sort an array of elements which will become it's new children. */
        // Too hard to implement		
        // reorder(callback: (elements: (DestructibleElement)[]) => {}) {
        // }
        function Element(isNew, id) {
            this.props = {};
            this._lastouterHTML = "";
            this.id = id;
            //wtf
            Object.defineProperty(this, "styleDeclaration", {
                value: new StyleDeclaration(this),
                enumerable: false
            });
        }
        Object.defineProperty(Element.prototype, "outerHTMLTree", {
            get: function () {
                if (this._lastouterHTML === this.outerHTML) {
                    return this._outerHTMLTree;
                }
                else {
                    this._lastouterHTML = this.outerHTML;
                    this._outerHTMLTree = parser.tree(this.outerHTML)[0];
                    return this._outerHTMLTree;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "childElementCount", {
            /**
             * Returns children count
             * Use this over Element.children.length!! children.length re-parses the html which is heavy on the client!
             */
            get: function () {
                return parseInt(this.getAttribute("childElementCount"));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "className", {
            get: function () {
                return this.getAttribute("className");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "childrenRaw", {
            /** array of elements. can include a Node if the child's id is not provided. Use .children instead to filter out id-less nodes */
            get: function () {
                return this.outerHTMLTree.children.map(function (e) { return e.attributes.id ? get(e.attributes.id, "container") : e; });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "children", {
            /** array of elements, id-less nodes are ignored. */
            get: function () {
                return this.childrenRaw.filter(function (e) { return "id" in e; });
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Adds event listener; Equivalent to onEvent(element.id, eventName, callback);
         */
        Element.prototype.on = function (t, callback) {
            onEvent(this.id, t, callback);
        };
        /** setStyle; equivalent to setStyle(element.id, style) */
        Element.prototype.setStyle = function (style) {
            setStyle(this.id, style);
        };
        Object.defineProperty(Element.prototype, "backgroundColor", {
            get: function () {
                return getProperty(this.id, "background-color");
            },
            /** background color */
            set: function (color) {
                setProperty(this.id, "background-color", color);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "tagName", {
            /** element tag name; ex: DIV | BUTTON | IMG */
            get: function () {
                return this.getAttribute("tagName");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "style", {
            get: function () {
                return this.outerHTMLTree.attributes.style || "";
            },
            /**
             * Resetting the style will not overwrite all styles, you must know which are currently active and do "style: unset;" in order to reset
             */
            set: function (style) {
                this.setStyle(style);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "outerHTML", {
            /** includes the element itself ex: <div id="ELEMENTID"><div id = "CHILD">HI</div></div> */
            get: function () {
                return this.getAttribute("outerHTML");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "innerHTML", {
            /** includes only the children of the element ex: <div id = "CHILD">HI</div> */
            get: function () {
                return this.getAttribute("innerHTML");
            },
            set: function (innerhtml) {
                innerHTML(this.id, innerhtml);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "scrollHeight", {
            /** Height of element, includes parts that are hidden beyond the scroll bar */
            get: function () {
                return getAttribute(this.id, "scrollHeight");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "scrollTop", {
            /** Location of scroll bar */
            get: function () {
                return parseInt(getAttribute(this.id, "scrollTop"));
            },
            set: function (y) {
                setAttribute(this.id, "scrollTop", y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "borderWidth", {
            /** CSS border width */
            get: function () {
                return getProperty(this.id, "border-width");
            },
            set: function (value) {
                setProperty(this.id, "border-width", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "borderColor", {
            /** CSS border color */
            get: function () {
                return getProperty(this.id, "border-color");
            },
            set: function (value) {
                setProperty(this.id, "border-color", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "display", {
            /** CSS display; to get the current value do element.styleDeclaration.display */
            set: function (display) {
                this.setStyle("display: " + display);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "padding", {
            /** CSS padding; element.styleDeclaration.padding */
            set: function (value) {
                this.setStyle("padding: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Element.prototype, "margin", {
            /** CSS margin; element.styleDeclaration.margin */
            set: function (value) {
                this.setStyle("margin: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Returns toString()'d representation of the attribute value.
         */
        Element.prototype.getAttribute = function (attribute) {
            return getAttribute(this.id, attribute);
        };
        Element.prototype.setAttribute = function (attribute, value) {
            return setAttribute(this.id, attribute, value);
        };
        Object.defineProperty(Element.prototype, "firstChild", {
            //first child, id-less ignored
            get: function () {
                if (this.children[0]) {
                    return this.children[0];
                }
            },
            enumerable: false,
            configurable: true
        });
        Element.prototype.addChildren = function () {
            var children = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                children[_i] = arguments[_i];
            }
            if (Array.isArray(children[0])) {
                children = children[0];
            }
            for (var _a = 0, _b = children; _a < _b.length; _a++) {
                var child = _b[_a];
                child.parent = this;
            }
        };
        Object.defineProperty(Element.prototype, "elementInit", {
            set: function (callback) {
                callback(this);
            },
            enumerable: false,
            configurable: true
        });
        /** To be called after all props are set  */
        Element.prototype.afterPropsSet = function () {
        };
        return Element;
    }());
    Nomx.Element = Element;
    // #Element
    var DestructibleElement = /** @class */ (function (_super) {
        __extends(DestructibleElement, _super);
        function DestructibleElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.props = {};
            return _this;
        }
        Object.defineProperty(DestructibleElement.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (parent) {
                if (!parent) {
                    parent = limbo;
                }
                ;
                setParent(this.id, parent.id);
                this._parent = parent;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "width", {
            get: function () {
                return getProperty(this.id, "width");
            },
            set: function (value) {
                setProperty(this.id, "width", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "height", {
            get: function () {
                return getProperty(this.id, "height");
            },
            set: function (value) {
                setProperty(this.id, "height", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "position", {
            set: function (position) {
                this.setStyle("position: " + position);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "left", {
            /** distance from the left side of the parent element */
            set: function (value) {
                this.setStyle("left: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "right", {
            /** distance from the right side of the parent element */
            set: function (value) {
                this.setStyle("right: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "top", {
            /** distance from the top side of the parent element */
            set: function (value) {
                this.setStyle("top: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "bottom", {
            /** distance from the bottom side of the parent element */
            set: function (value) {
                this.setStyle("bottom: " + (typeof value === "number" ? value + "px" : value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "x", {
            /** (mostly) equivalent to .left, except called via setProperty */
            get: function () {
                return getProperty(this.id, "x");
            },
            set: function (value) {
                setProperty(this.id, "x", value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DestructibleElement.prototype, "y", {
            /** (mostly) equivalent to .top, except called via setProperty */
            get: function () {
                return getProperty(this.id, "y");
            },
            set: function (value) {
                setProperty(this.id, "y", value);
            },
            enumerable: false,
            configurable: true
        });
        DestructibleElement.prototype["delete"] = function () {
            deleteElement(this.id);
        };
        return DestructibleElement;
    }(Element));
    Nomx.DestructibleElement = DestructibleElement;
    var TextElement = /** @class */ (function (_super) {
        __extends(TextElement, _super);
        function TextElement() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.props = {};
            return _this;
        }
        Object.defineProperty(TextElement.prototype, "textColor", {
            get: function () {
                return getProperty(this.id, "text-color");
            },
            set: function (color) {
                setProperty(this.id, "text-color", color);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextElement.prototype, "text", {
            get: function () {
                return getProperty(this.id, "text");
            },
            /**
             * Text of element (escapes html, use innerHTML instead)
             */
            set: function (text) {
                setProperty(this.id, "text", text);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextElement.prototype, "fontSize", {
            get: function () {
                return getProperty(this.id, "font-size");
            },
            /** font size in pixels */
            set: function (size) {
                setProperty(this.id, "font-size", size);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextElement.prototype, "overflow", {
            // ill add types i need as they come
            set: function (overflow) {
                this.setStyle("overflow: " + overflow);
            },
            enumerable: false,
            configurable: true
        });
        return TextElement;
    }(DestructibleElement));
    Nomx.TextElement = TextElement;
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            if (isNew) {
                textLabel(id, "");
            }
            return _this;
        }
        return Label;
    }(TextElement));
    Nomx.Label = Label;
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.props = {};
            _this.onClick = function (event) { };
            if (isNew) {
                button(id, "");
            }
            _this.on("click", function (event) {
                _this.onClick(event);
            });
            return _this;
        }
        Object.defineProperty(Button.prototype, "pure", {
            set: function (v) {
                this.setStyle("border: 0px; background-image: none; margin: 0px; border-radius: 0px");
            },
            enumerable: false,
            configurable: true
        });
        return Button;
    }(TextElement));
    Nomx.Button = Button;
    var RippleButton = /** @class */ (function (_super) {
        __extends(RippleButton, _super);
        function RippleButton(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.props = {};
            _this.ripples = [];
            _this.color = "#FFF";
            _this.shadow = false;
            _this.textElement = Nomx.create("container", { parent: _this });
            _this.setStyle("transition: box-shadow .3s; overflow: hidden");
            _this.on("mouseout", function () {
                if (_this.shadow) {
                    _this.setStyle("box-shadow: none");
                }
                var ripples = _this.ripples;
                setTimeout(function () {
                    ripples.forEach(function (ripple) {
                        ripple.setStyle("opacity: 0");
                        setTimeout(function () {
                            ripple["delete"]();
                        }, 1000);
                    });
                }, 50);
                _this.ripples = [];
            });
            _this.on("mouseup", function () {
                if (_this.shadow) {
                    _this.setStyle("box-shadow: none");
                }
                var ripples = _this.ripples;
                setTimeout(function () {
                    ripples.forEach(function (ripple) {
                        ripple.setStyle("opacity: 0");
                        setTimeout(function () {
                            ripple["delete"]();
                        }, 1000);
                    });
                }, 50);
                _this.ripples = [];
            });
            _this.on("mousedown", function (event) {
                if (_this.shadow) {
                    _this.setStyle("box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px");
                }
                var ripple = Nomx.create("container", { parent: _this });
                ripple.setStyle("pointer-events: none;opacity: 80%;transition: opacity 1s, width 1.5s, height 1.5s;transform: translate(-50%, -50%);width: 1px; height:1px; border-radius: 1000px;position: absolute");
                _this.ripples.push(ripple);
                ripple.x = event.offsetX;
                ripple.y = event.offsetY;
                setTimeout(function () { ripple.setStyle("opacity: 40%;width: 800px; height:800px"); }, 50);
                ripple.backgroundColor = _this.color;
            });
            return _this;
        }
        Object.defineProperty(RippleButton.prototype, "text", {
            get: function () {
                return this.textElement.text;
            },
            /**
             * Proxied text; html is escaped; use rippleButton.textElement.innerHTML if you are trying to set html
             */
            set: function (value) {
                this.textElement.text = value;
            },
            enumerable: false,
            configurable: true
        });
        return RippleButton;
    }(Button));
    Nomx.RippleButton = RippleButton;
    /** Textbox */
    var Input = /** @class */ (function (_super) {
        __extends(Input, _super);
        function Input(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.props = {};
            _this.onSubmit = function (event) { };
            if (isNew) {
                textInput(id, "");
            }
            _this.on("keypress", function (event) {
                if (event.keyCode === 13) {
                    _this.onSubmit(event);
                }
            });
            return _this;
        }
        return Input;
    }(TextElement));
    Nomx.Input = Input;
    /** Container. aka <div>
     * Css may be different. For example there is line-height set to 18px
     */
    var Container = /** @class */ (function (_super) {
        __extends(Container, _super);
        function Container(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.props = {};
            if (isNew) {
                container(id, "");
            }
            return _this;
        }
        Object.defineProperty(Container.prototype, "type", {
            /** Determines subset type of container */
            set: function (value) {
                switch (value) {
                    case "fill":
                        this.setStyle("width: 100%; height: 100%; position: absolute");
                        break;
                }
            },
            enumerable: false,
            configurable: true
        });
        return Container;
    }(TextElement));
    Nomx.Container = Container;
    /** Represents a screen */
    var Screen = /** @class */ (function (_super) {
        __extends(Screen, _super);
        function Screen(isNew, id, children) {
            var _this = _super.call(this, isNew, id) || this;
            if (isNew) {
                Nomx.root.innerHTML += "<div class=\"screen\" tabindex=\"1\" data-theme=\"default\" id=\"" + id + "\" style=\"display: none; height: 450px; width: 320px; left: 0px; top: 0px; position: absolute; z-index: 0; background-color: rgb(255, 255, 255);\"></div>";
            }
            return _this;
        }
        Object.defineProperty(Screen.prototype, "isActiveScreen", {
            get: function () {
                return this.style.match("display: none") !== null;
            },
            enumerable: false,
            configurable: true
        });
        Screen.prototype.set = function () {
            setScreen(this.id);
        };
        return Screen;
    }(TextElement));
    Nomx.Screen = Screen;
    /** For when you want to pass a string as an Element */
    var Span = /** @class */ (function (_super) {
        __extends(Span, _super);
        function Span(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.style = "display: inline; padding: 0px";
            return _this;
        }
        return Span;
    }(Container));
    Nomx.Span = Span;
    /** Represents a line break */
    var Break = /** @class */ (function (_super) {
        __extends(Break, _super);
        function Break(isNew, id) {
            var _this = _super.call(this, isNew, id) || this;
            _this.style = "margin-bottom: 10px";
            return _this;
        }
        /** This will error */
        Break.prototype.addChildren = function () {
            throw "Line breaks can't have children, silly.";
        };
        return Break;
    }(Container));
    Nomx.Break = Break;
    /** singleton class that represents divApplab */
    var Root = /** @class */ (function (_super) {
        __extends(Root, _super);
        function Root() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = "divApplab";
            return _this;
        }
        Object.defineProperty(Root.prototype, "nodes", {
            /** Every element (that has an id) in the app (Computationally expensive, best you use caches) */
            get: function () {
                return parser.nodes(this.innerHTML);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Root.prototype, "screens", {
            /** Returns every screen. (Computationally expensive, best you use caches) */
            get: function () {
                return this.children.filter(function (c) {
                    return c.className === "screen";
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Root.prototype, "activeScreen", {
            /** Returns current screen. (Computationally expensive, best you use caches) */
            get: function () {
                return this.children.filter(function (c) {
                    return c.className === "screen" && c.style.match("display: none");
                })[0];
            },
            enumerable: false,
            configurable: true
        });
        return Root;
    }(Element));
    Nomx.Root = Root;
    var allIndex = {
        div: Container,
        br: Break,
        label: Label,
        button: Button,
        input: Input,
        screen: Screen,
        container: Container,
        span: Span,
        element: Element,
        root: Root,
        ripplebutton: RippleButton
    };
    function _instanceof(a, b) {
        //a instanceof b results in {data: false, type: "boolean"} when it's false, and true when it's true; really stupid and annoying
        return a instanceof b === true;
    }
    /**
     * Should only be used when you aren't using cdo-sync's class extension
     */
    function extendClass(C, constructor, props, methods) {
        var Extension = /** @class */ (function (_super) {
            __extends(Extension, _super);
            function Extension(isNew, id, children) {
                var _this = _super.call(this, isNew, id) || this;
                constructor.call(_this, isNew, id, children);
                return _this;
            }
            return Extension;
        }(C));
        ;
        Object.defineProperties(Extension, props);
        var proto = Extension.prototype;
        for (var method in methods) {
            proto[method] = methods[method];
        }
    }
    Nomx.extendClass = extendClass;
    //	export function create<e extends keyof creatableTypes>(ElementType: e, props?: convertClassToProps<creatableTypes[e]>, children?: CreateChildren[]): InstanceType<creatableTypes[e]>
    //	export function create<e extends creatableTypes[keyof creatableTypes]>(ElementType: e, props?: convertClassToProps<e>, children?: CreateChildren[]): InstanceType<e>	
    function create(ElementType, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var elementId;
        if (props == undefined) {
            props = {};
        }
        else if (props.id) {
            elementId = props.id;
            delete props.id;
        }
        if (!elementId) {
            elementId = prefix + (++counter).toString();
        }
        var computedChildren = [];
        if (children.length === 1 && typeof children[0] === "string") {
            props.text = children[0];
        }
        else {
            function spread(arr) {
                for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                    var val = arr_1[_i];
                    if (Array.isArray(val)) {
                        spread(val);
                    }
                    else if (_instanceof(val, DestructibleElement)) {
                        computedChildren.push(val);
                    }
                    else {
                        computedChildren.push(Nomx.create("span", {
                            text: String(val)
                        }));
                    }
                }
            }
            spread(children);
        }
        var element;
        //children: [DestructibleElement | string]
        if (typeof ElementType === "string") {
            element = new allIndex[ElementType](true, elementId);
        }
        else {
            element = new ElementType(true, elementId);
        }
        Nomx.ElementsById[element.id] = element;
        element.addChildren(computedChildren);
        Object.keys(props).map(function (key) {
            element[key] = props[key];
        });
        element.afterPropsSet();
        return element;
    }
    Nomx.create = create;
    function get(id, ElementType) {
        if (ElementType === void 0) { ElementType = Container; }
        if (Nomx.ElementsById[id]) {
            return Nomx.ElementsById[id];
        }
        else if (typeof ElementType === "string") {
            return new allIndex[ElementType](false, id, []);
        }
        else {
            return new ElementType(false, id, []);
        }
    }
    Nomx.get = get;
    /** Represents divApplab; of which all elements **must** be parented to. */
    Nomx.root = Nomx.get("divApplab", Root);
    var uninitiatedIds = [];
    Nomx.root.nodes.forEach(function (el) {
        if (el.attributes.id !== "designModeViz") {
            var elType = void 0;
            if (el.attributes["class"] === "screen") {
                elType = "screen";
            }
            else if (el.tagName === "button") {
                elType = "button";
            }
            else if (el.tagName === "input") {
                elType = "input";
            }
            else if (el.tagName === "div") {
                elType = "container";
            }
            else if (el.tagName === "span") {
                elType = "span";
            }
            else if (el.tagName === "label") {
                elType = "label";
            }
            else {
                elType = "container";
            }
            var dt = el.attributes.id.match(/^([a-zA-Z0-9\_\-]+)(?:\#([a-zA-Z0-9_\$]+))?$/);
            if (dt) {
                if (dt[2]) {
                    elType = dt[2];
                }
                if (elType in allIndex) {
                    window["$$" + dt[1]] = Nomx.get(dt[0], elType);
                }
                else {
                    uninitiatedIds.push(dt);
                }
            }
        }
    });
    if (uninitiatedIds.length > 0) {
        console.log("Custom classes detected!; Make sure to call Nomx.initiateWithClasses() after class declarations.");
    }
    /**
     * Call after you have declared your classes in global scope!
     */
    function initiateWithClasses() {
        uninitiatedIds.forEach(function (_a) {
            var id = _a[0], rid = _a[1], c = _a[2];
            window["$$" + rid] = Nomx.get(id, window[c]);
        });
    }
    Nomx.initiateWithClasses = initiateWithClasses;
    /** URL of the current app */
    Nomx.baseURI = Nomx.root.getAttribute("baseURI");
    /** Channel id of the current app */
    Nomx.channelId = Nomx.baseURI.match(/code.org\/projects\/applab\/([^\/]+)/)[1];
    /** A container that elements created using innerHTML are created, in order to prevent overwriting any existing elements */
    var forge = create("container");
    forge.display = "none";
    forge.parent = Nomx.root;
    /** A container elements go to when they are hidden but not necessarily destroyed */
    var limbo = create("container");
    limbo.display = "none";
    limbo.parent = Nomx.root;
})(Nomx = exports.Nomx || (exports.Nomx = {}));
