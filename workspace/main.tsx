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

//import "./types/applab"

namespace Nomx {

	const prefix = "Nomx_Gen_"
	let counter = 0;

	export type HTMLTree = { attributes: { escaped: string, name: string, value: string }[], children: HTMLTree[], tag: string, id: string }

	export const ElementsById: { [s: string]: Element } = {}

	export type Node = { tagName: string, attributes: { [s: string]: string | undefined }, children: (Node /*| string*/)[] };;

	const parser = (function () {
		// Regular Expressions for parsing tags and attributes
		var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Z-a-z0-9_]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
			endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
			attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
			attr2 = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/;
		var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");
		var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");


		function makeMap(str: string) {
			var obj: { [s: string]: boolean } = {}, items = str.split(",");
			for (var i = 0; i < items.length; i++)
				obj[items[i]] = true;
			return obj;
		}

		function parseFragments(html: string) {
			const parsedTags: (string | [string, string] | [string])[] = [];

			while (true) {
				const match = html.match(startTag)
				if (match) {
					parsedTags.push([match[1], match[2]])
					html = html.substring(match[0].length)
				} else {
					const matchEnd = html.match(endTag)
					if (matchEnd) {
						parsedTags.push([matchEnd[1]])
						html = html.substring(matchEnd[0].length)
					} else {
						const index = html.indexOf("<");
						if (index >= 0) {
							//parsedTags.push(html.slice(0, index))
							html = html.substring(index)
						} else {
							break;
						}
					}
				}
			}
			return parsedTags;
		}
		function parse(parsedTags: (string | [string, string] | [string])[]) {
			const stack: Node[] = [{ tagName: "", attributes: {}, children: [] }];
			for (const fragment of parsedTags) {
				if (typeof fragment === "string") {
					//never
					//stack[stack.length - 1].children.push(fragment)
				} else if (fragment.length === 2) {
					const node: Node = { tagName: "", attributes: {}, children: [] };
					node.tagName = fragment[0]
					for (const attribute of fragment[1].match(attr) || []) {
						const attrmatch = attribute.match(attr2)!;
						node.attributes[attrmatch[1]] = attrmatch[2];
					}
					stack[stack.length - 1].children.push(node);
					if (!empty[node.tagName] && !closeSelf[node.tagName]) {
						stack.push(node);
					}
				} else {
					stack.pop();
				}
			}
			return stack[0].children
		}
		//why the fuck this not working
		function getIds(parsedTags: (string | [string, string] | [string])[]) {
			const stack: Node[] = [];
			for (const fragment of parsedTags) {
				if (typeof fragment === "string") {
					//stack[stack.length - 1].children.push(fragment)
				} else if (fragment.length === 2) {
					const node: Node = { tagName: "", attributes: {}, children: [] };
					node.tagName = fragment[0]
					for (const attribute of fragment[1].match(attr) || []) {
						const attrmatch = attribute.match(attr2)!;
						node.attributes[attrmatch[1]] = attrmatch[2];
					}
					stack.push(node);
				}
			}
			return stack;
		}
		return { nodes: (html: string) => getIds(parseFragments(html)), tree: (html: string) => parse(parseFragments(html)) }
	})();

	class StyleDeclaration {
		set additiveSymbols(v: string) { this.set("additive-symbols: " + v) } get additiveSymbols() { return this.get("additive-symbols") }; set alignContent(v: string) { this.set("align-content: " + v) } get alignContent() { return this.get("align-content") }; set alignItems(v: string) { this.set("align-items: " + v) } get alignItems() { return this.get("align-items") }; set alignSelf(v: string) { this.set("align-self: " + v) } get alignSelf() { return this.get("align-self") }; set alignmentBaseline(v: string) { this.set("alignment-baseline: " + v) } get alignmentBaseline() { return this.get("alignment-baseline") }; set animation(v: string) { this.set("animation: " + v) } get animation() { return this.get("animation") }; set animationDelay(v: string) { this.set("animation-delay: " + v) } get animationDelay() { return this.get("animation-delay") }; set animationDirection(v: string) { this.set("animation-direction: " + v) } get animationDirection() { return this.get("animation-direction") }; set animationDuration(v: string) { this.set("animation-duration: " + v) } get animationDuration() { return this.get("animation-duration") }; set animationFillMode(v: string) { this.set("animation-fill-mode: " + v) } get animationFillMode() { return this.get("animation-fill-mode") }; set animationIterationCount(v: string) { this.set("animation-iteration-count: " + v) } get animationIterationCount() { return this.get("animation-iteration-count") }; set animationName(v: string) { this.set("animation-name: " + v) } get animationName() { return this.get("animation-name") }; set animationPlayState(v: string) { this.set("animation-play-state: " + v) } get animationPlayState() { return this.get("animation-play-state") }; set animationTimingFunction(v: string) { this.set("animation-timing-function: " + v) } get animationTimingFunction() { return this.get("animation-timing-function") }; set appearance(v: string) { this.set("appearance: " + v) } get appearance() { return this.get("appearance") }; set ascentOverride(v: string) { this.set("ascent-override: " + v) } get ascentOverride() { return this.get("ascent-override") }; set aspectRatio(v: string) { this.set("aspect-ratio: " + v) } get aspectRatio() { return this.get("aspect-ratio") }; set backdropFilter(v: string) { this.set("backdrop-filter: " + v) } get backdropFilter() { return this.get("backdrop-filter") }; set backfaceVisibility(v: string) { this.set("backface-visibility: " + v) } get backfaceVisibility() { return this.get("backface-visibility") }; set background(v: string) { this.set("background: " + v) } get background() { return this.get("background") }; set backgroundAttachment(v: string) { this.set("background-attachment: " + v) } get backgroundAttachment() { return this.get("background-attachment") }; set backgroundBlendMode(v: string) { this.set("background-blend-mode: " + v) } get backgroundBlendMode() { return this.get("background-blend-mode") }; set backgroundClip(v: string) { this.set("background-clip: " + v) } get backgroundClip() { return this.get("background-clip") }; set backgroundColor(v: string) { this.set("background-color: " + v) } get backgroundColor() { return this.get("background-color") }; set backgroundImage(v: string) { this.set("background-image: " + v) } get backgroundImage() { return this.get("background-image") }; set backgroundOrigin(v: string) { this.set("background-origin: " + v) } get backgroundOrigin() { return this.get("background-origin") }; set backgroundPosition(v: string) { this.set("background-position: " + v) } get backgroundPosition() { return this.get("background-position") }; set backgroundPositionX(v: string) { this.set("background-position-x: " + v) } get backgroundPositionX() { return this.get("background-position-x") }; set backgroundPositionY(v: string) { this.set("background-position-y: " + v) } get backgroundPositionY() { return this.get("background-position-y") }; set backgroundRepeat(v: string) { this.set("background-repeat: " + v) } get backgroundRepeat() { return this.get("background-repeat") }; set backgroundRepeatX(v: string) { this.set("background-repeat-x: " + v) } get backgroundRepeatX() { return this.get("background-repeat-x") }; set backgroundRepeatY(v: string) { this.set("background-repeat-y: " + v) } get backgroundRepeatY() { return this.get("background-repeat-y") }; set backgroundSize(v: string) { this.set("background-size: " + v) } get backgroundSize() { return this.get("background-size") }; set baselineShift(v: string) { this.set("baseline-shift: " + v) } get baselineShift() { return this.get("baseline-shift") }; set blockSize(v: string) { this.set("block-size: " + v) } get blockSize() { return this.get("block-size") }; set border(v: string) { this.set("border: " + v) } get border() { return this.get("border") }; set borderBlock(v: string) { this.set("border-block: " + v) } get borderBlock() { return this.get("border-block") }; set borderBlockColor(v: string) { this.set("border-block-color: " + v) } get borderBlockColor() { return this.get("border-block-color") }; set borderBlockEnd(v: string) { this.set("border-block-end: " + v) } get borderBlockEnd() { return this.get("border-block-end") }; set borderBlockEndColor(v: string) { this.set("border-block-end-color: " + v) } get borderBlockEndColor() { return this.get("border-block-end-color") }; set borderBlockEndStyle(v: string) { this.set("border-block-end-style: " + v) } get borderBlockEndStyle() { return this.get("border-block-end-style") }; set borderBlockEndWidth(v: string) { this.set("border-block-end-width: " + v) } get borderBlockEndWidth() { return this.get("border-block-end-width") }; set borderBlockStart(v: string) { this.set("border-block-start: " + v) } get borderBlockStart() { return this.get("border-block-start") }; set borderBlockStartColor(v: string) { this.set("border-block-start-color: " + v) } get borderBlockStartColor() { return this.get("border-block-start-color") }; set borderBlockStartStyle(v: string) { this.set("border-block-start-style: " + v) } get borderBlockStartStyle() { return this.get("border-block-start-style") }; set borderBlockStartWidth(v: string) { this.set("border-block-start-width: " + v) } get borderBlockStartWidth() { return this.get("border-block-start-width") }; set borderBlockStyle(v: string) { this.set("border-block-style: " + v) } get borderBlockStyle() { return this.get("border-block-style") }; set borderBlockWidth(v: string) { this.set("border-block-width: " + v) } get borderBlockWidth() { return this.get("border-block-width") }; set borderBottom(v: string) { this.set("border-bottom: " + v) } get borderBottom() { return this.get("border-bottom") }; set borderBottomColor(v: string) { this.set("border-bottom-color: " + v) } get borderBottomColor() { return this.get("border-bottom-color") }; set borderBottomLeftRadius(v: string) { this.set("border-bottom-left-radius: " + v) } get borderBottomLeftRadius() { return this.get("border-bottom-left-radius") }; set borderBottomRightRadius(v: string) { this.set("border-bottom-right-radius: " + v) } get borderBottomRightRadius() { return this.get("border-bottom-right-radius") }; set borderBottomStyle(v: string) { this.set("border-bottom-style: " + v) } get borderBottomStyle() { return this.get("border-bottom-style") }; set borderBottomWidth(v: string) { this.set("border-bottom-width: " + v) } get borderBottomWidth() { return this.get("border-bottom-width") }; set borderCollapse(v: string) { this.set("border-collapse: " + v) } get borderCollapse() { return this.get("border-collapse") }; set borderColor(v: string) { this.set("border-color: " + v) } get borderColor() { return this.get("border-color") }; set borderEndEndRadius(v: string) { this.set("border-end-end-radius: " + v) } get borderEndEndRadius() { return this.get("border-end-end-radius") }; set borderEndStartRadius(v: string) { this.set("border-end-start-radius: " + v) } get borderEndStartRadius() { return this.get("border-end-start-radius") }; set borderImage(v: string) { this.set("border-image: " + v) } get borderImage() { return this.get("border-image") }; set borderImageOutset(v: string) { this.set("border-image-outset: " + v) } get borderImageOutset() { return this.get("border-image-outset") }; set borderImageRepeat(v: string) { this.set("border-image-repeat: " + v) } get borderImageRepeat() { return this.get("border-image-repeat") }; set borderImageSlice(v: string) { this.set("border-image-slice: " + v) } get borderImageSlice() { return this.get("border-image-slice") }; set borderImageSource(v: string) { this.set("border-image-source: " + v) } get borderImageSource() { return this.get("border-image-source") }; set borderImageWidth(v: string) { this.set("border-image-width: " + v) } get borderImageWidth() { return this.get("border-image-width") }; set borderInline(v: string) { this.set("border-inline: " + v) } get borderInline() { return this.get("border-inline") }; set borderInlineColor(v: string) { this.set("border-inline-color: " + v) } get borderInlineColor() { return this.get("border-inline-color") }; set borderInlineEnd(v: string) { this.set("border-inline-end: " + v) } get borderInlineEnd() { return this.get("border-inline-end") }; set borderInlineEndColor(v: string) { this.set("border-inline-end-color: " + v) } get borderInlineEndColor() { return this.get("border-inline-end-color") }; set borderInlineEndStyle(v: string) { this.set("border-inline-end-style: " + v) } get borderInlineEndStyle() { return this.get("border-inline-end-style") }; set borderInlineEndWidth(v: string) { this.set("border-inline-end-width: " + v) } get borderInlineEndWidth() { return this.get("border-inline-end-width") }; set borderInlineStart(v: string) { this.set("border-inline-start: " + v) } get borderInlineStart() { return this.get("border-inline-start") }; set borderInlineStartColor(v: string) { this.set("border-inline-start-color: " + v) } get borderInlineStartColor() { return this.get("border-inline-start-color") }; set borderInlineStartStyle(v: string) { this.set("border-inline-start-style: " + v) } get borderInlineStartStyle() { return this.get("border-inline-start-style") }; set borderInlineStartWidth(v: string) { this.set("border-inline-start-width: " + v) } get borderInlineStartWidth() { return this.get("border-inline-start-width") }; set borderInlineStyle(v: string) { this.set("border-inline-style: " + v) } get borderInlineStyle() { return this.get("border-inline-style") }; set borderInlineWidth(v: string) { this.set("border-inline-width: " + v) } get borderInlineWidth() { return this.get("border-inline-width") }; set borderLeft(v: string) { this.set("border-left: " + v) } get borderLeft() { return this.get("border-left") }; set borderLeftColor(v: string) { this.set("border-left-color: " + v) } get borderLeftColor() { return this.get("border-left-color") }; set borderLeftStyle(v: string) { this.set("border-left-style: " + v) } get borderLeftStyle() { return this.get("border-left-style") }; set borderLeftWidth(v: string) { this.set("border-left-width: " + v) } get borderLeftWidth() { return this.get("border-left-width") }; set borderRadius(v: string) { this.set("border-radius: " + v) } get borderRadius() { return this.get("border-radius") }; set borderRight(v: string) { this.set("border-right: " + v) } get borderRight() { return this.get("border-right") }; set borderRightColor(v: string) { this.set("border-right-color: " + v) } get borderRightColor() { return this.get("border-right-color") }; set borderRightStyle(v: string) { this.set("border-right-style: " + v) } get borderRightStyle() { return this.get("border-right-style") }; set borderRightWidth(v: string) { this.set("border-right-width: " + v) } get borderRightWidth() { return this.get("border-right-width") }; set borderSpacing(v: string) { this.set("border-spacing: " + v) } get borderSpacing() { return this.get("border-spacing") }; set borderStartEndRadius(v: string) { this.set("border-start-end-radius: " + v) } get borderStartEndRadius() { return this.get("border-start-end-radius") }; set borderStartStartRadius(v: string) { this.set("border-start-start-radius: " + v) } get borderStartStartRadius() { return this.get("border-start-start-radius") }; set borderStyle(v: string) { this.set("border-style: " + v) } get borderStyle() { return this.get("border-style") }; set borderTop(v: string) { this.set("border-top: " + v) } get borderTop() { return this.get("border-top") }; set borderTopColor(v: string) { this.set("border-top-color: " + v) } get borderTopColor() { return this.get("border-top-color") }; set borderTopLeftRadius(v: string) { this.set("border-top-left-radius: " + v) } get borderTopLeftRadius() { return this.get("border-top-left-radius") }; set borderTopRightRadius(v: string) { this.set("border-top-right-radius: " + v) } get borderTopRightRadius() { return this.get("border-top-right-radius") }; set borderTopStyle(v: string) { this.set("border-top-style: " + v) } get borderTopStyle() { return this.get("border-top-style") }; set borderTopWidth(v: string) { this.set("border-top-width: " + v) } get borderTopWidth() { return this.get("border-top-width") }; set borderWidth(v: string) { this.set("border-width: " + v) } get borderWidth() { return this.get("border-width") }; set bottom(v: string) { this.set("bottom: " + v) } get bottom() { return this.get("bottom") }; set boxShadow(v: string) { this.set("box-shadow: " + v) } get boxShadow() { return this.get("box-shadow") }; set boxSizing(v: string) { this.set("box-sizing: " + v) } get boxSizing() { return this.get("box-sizing") }; set breakAfter(v: string) { this.set("break-after: " + v) } get breakAfter() { return this.get("break-after") }; set breakBefore(v: string) { this.set("break-before: " + v) } get breakBefore() { return this.get("break-before") }; set breakInside(v: string) { this.set("break-inside: " + v) } get breakInside() { return this.get("break-inside") }; set bufferedRendering(v: string) { this.set("buffered-rendering: " + v) } get bufferedRendering() { return this.get("buffered-rendering") }; set captionSide(v: string) { this.set("caption-side: " + v) } get captionSide() { return this.get("caption-side") }; set caretColor(v: string) { this.set("caret-color: " + v) } get caretColor() { return this.get("caret-color") }; set clear(v: string) { this.set("clear: " + v) } get clear() { return this.get("clear") }; set clip(v: string) { this.set("clip: " + v) } get clip() { return this.get("clip") }; set clipPath(v: string) { this.set("clip-path: " + v) } get clipPath() { return this.get("clip-path") }; set clipRule(v: string) { this.set("clip-rule: " + v) } get clipRule() { return this.get("clip-rule") }; set color(v: string) { this.set("color: " + v) } get color() { return this.get("color") }; set colorInterpolation(v: string) { this.set("color-interpolation: " + v) } get colorInterpolation() { return this.get("color-interpolation") }; set colorInterpolationFilters(v: string) { this.set("color-interpolation-filters: " + v) } get colorInterpolationFilters() { return this.get("color-interpolation-filters") }; set colorRendering(v: string) { this.set("color-rendering: " + v) } get colorRendering() { return this.get("color-rendering") }; set colorScheme(v: string) { this.set("color-scheme: " + v) } get colorScheme() { return this.get("color-scheme") }; set columnCount(v: string) { this.set("column-count: " + v) } get columnCount() { return this.get("column-count") }; set columnFill(v: string) { this.set("column-fill: " + v) } get columnFill() { return this.get("column-fill") }; set columnGap(v: string) { this.set("column-gap: " + v) } get columnGap() { return this.get("column-gap") }; set columnRule(v: string) { this.set("column-rule: " + v) } get columnRule() { return this.get("column-rule") }; set columnRuleColor(v: string) { this.set("column-rule-color: " + v) } get columnRuleColor() { return this.get("column-rule-color") }; set columnRuleStyle(v: string) { this.set("column-rule-style: " + v) } get columnRuleStyle() { return this.get("column-rule-style") }; set columnRuleWidth(v: string) { this.set("column-rule-width: " + v) } get columnRuleWidth() { return this.get("column-rule-width") }; set columnSpan(v: string) { this.set("column-span: " + v) } get columnSpan() { return this.get("column-span") }; set columnWidth(v: string) { this.set("column-width: " + v) } get columnWidth() { return this.get("column-width") }; set columns(v: string) { this.set("columns: " + v) } get columns() { return this.get("columns") }; set contain(v: string) { this.set("contain: " + v) } get contain() { return this.get("contain") }; set containIntrinsicSize(v: string) { this.set("contain-intrinsic-size: " + v) } get containIntrinsicSize() { return this.get("contain-intrinsic-size") }; set content(v: string) { this.set("content: " + v) } get content() { return this.get("content") }; set contentVisibility(v: string) { this.set("content-visibility: " + v) } get contentVisibility() { return this.get("content-visibility") }; set counterIncrement(v: string) { this.set("counter-increment: " + v) } get counterIncrement() { return this.get("counter-increment") }; set counterReset(v: string) { this.set("counter-reset: " + v) } get counterReset() { return this.get("counter-reset") }; set counterSet(v: string) { this.set("counter-set: " + v) } get counterSet() { return this.get("counter-set") }; set cursor(v: string) { this.set("cursor: " + v) } get cursor() { return this.get("cursor") }; set cx(v: string) { this.set("cx: " + v) } get cx() { return this.get("cx") }; set cy(v: string) { this.set("cy: " + v) } get cy() { return this.get("cy") }; set d(v: string) { this.set("d: " + v) } get d() { return this.get("d") }; set descentOverride(v: string) { this.set("descent-override: " + v) } get descentOverride() { return this.get("descent-override") }; set direction(v: string) { this.set("direction: " + v) } get direction() { return this.get("direction") }; set display(v: string) { this.set("display: " + v) } get display() { return this.get("display") }; set dominantBaseline(v: string) { this.set("dominant-baseline: " + v) } get dominantBaseline() { return this.get("dominant-baseline") }; set emptyCells(v: string) { this.set("empty-cells: " + v) } get emptyCells() { return this.get("empty-cells") }; set fallback(v: string) { this.set("fallback: " + v) } get fallback() { return this.get("fallback") }; set fill(v: string) { this.set("fill: " + v) } get fill() { return this.get("fill") }; set fillOpacity(v: string) { this.set("fill-opacity: " + v) } get fillOpacity() { return this.get("fill-opacity") }; set fillRule(v: string) { this.set("fill-rule: " + v) } get fillRule() { return this.get("fill-rule") }; set filter(v: string) { this.set("filter: " + v) } get filter() { return this.get("filter") }; set flex(v: string) { this.set("flex: " + v) } get flex() { return this.get("flex") }; set flexBasis(v: string) { this.set("flex-basis: " + v) } get flexBasis() { return this.get("flex-basis") }; set flexDirection(v: string) { this.set("flex-direction: " + v) } get flexDirection() { return this.get("flex-direction") }; set flexFlow(v: string) { this.set("flex-flow: " + v) } get flexFlow() { return this.get("flex-flow") }; set flexGrow(v: string) { this.set("flex-grow: " + v) } get flexGrow() { return this.get("flex-grow") }; set flexShrink(v: string) { this.set("flex-shrink: " + v) } get flexShrink() { return this.get("flex-shrink") }; set flexWrap(v: string) { this.set("flex-wrap: " + v) } get flexWrap() { return this.get("flex-wrap") }; set float(v: string) { this.set("float: " + v) } get float() { return this.get("float") }; set floodColor(v: string) { this.set("flood-color: " + v) } get floodColor() { return this.get("flood-color") }; set floodOpacity(v: string) { this.set("flood-opacity: " + v) } get floodOpacity() { return this.get("flood-opacity") }; set font(v: string) { this.set("font: " + v) } get font() { return this.get("font") }; set fontDisplay(v: string) { this.set("font-display: " + v) } get fontDisplay() { return this.get("font-display") }; set fontFamily(v: string) { this.set("font-family: " + v) } get fontFamily() { return this.get("font-family") }; set fontFeatureSettings(v: string) { this.set("font-feature-settings: " + v) } get fontFeatureSettings() { return this.get("font-feature-settings") }; set fontKerning(v: string) { this.set("font-kerning: " + v) } get fontKerning() { return this.get("font-kerning") }; set fontOpticalSizing(v: string) { this.set("font-optical-sizing: " + v) } get fontOpticalSizing() { return this.get("font-optical-sizing") }; set fontSize(v: string) { this.set("font-size: " + v) } get fontSize() { return this.get("font-size") }; set fontStretch(v: string) { this.set("font-stretch: " + v) } get fontStretch() { return this.get("font-stretch") }; set fontStyle(v: string) { this.set("font-style: " + v) } get fontStyle() { return this.get("font-style") }; set fontVariant(v: string) { this.set("font-variant: " + v) } get fontVariant() { return this.get("font-variant") }; set fontVariantCaps(v: string) { this.set("font-variant-caps: " + v) } get fontVariantCaps() { return this.get("font-variant-caps") }; set fontVariantEastAsian(v: string) { this.set("font-variant-east-asian: " + v) } get fontVariantEastAsian() { return this.get("font-variant-east-asian") }; set fontVariantLigatures(v: string) { this.set("font-variant-ligatures: " + v) } get fontVariantLigatures() { return this.get("font-variant-ligatures") }; set fontVariantNumeric(v: string) { this.set("font-variant-numeric: " + v) } get fontVariantNumeric() { return this.get("font-variant-numeric") }; set fontVariationSettings(v: string) { this.set("font-variation-settings: " + v) } get fontVariationSettings() { return this.get("font-variation-settings") }; set fontWeight(v: string) { this.set("font-weight: " + v) } get fontWeight() { return this.get("font-weight") }; set forcedColorAdjust(v: string) { this.set("forced-color-adjust: " + v) } get forcedColorAdjust() { return this.get("forced-color-adjust") }; set gap(v: string) { this.set("gap: " + v) } get gap() { return this.get("gap") }; set grid(v: string) { this.set("grid: " + v) } get grid() { return this.get("grid") }; set gridArea(v: string) { this.set("grid-area: " + v) } get gridArea() { return this.get("grid-area") }; set gridAutoColumns(v: string) { this.set("grid-auto-columns: " + v) } get gridAutoColumns() { return this.get("grid-auto-columns") }; set gridAutoFlow(v: string) { this.set("grid-auto-flow: " + v) } get gridAutoFlow() { return this.get("grid-auto-flow") }; set gridAutoRows(v: string) { this.set("grid-auto-rows: " + v) } get gridAutoRows() { return this.get("grid-auto-rows") }; set gridColumn(v: string) { this.set("grid-column: " + v) } get gridColumn() { return this.get("grid-column") }; set gridColumnEnd(v: string) { this.set("grid-column-end: " + v) } get gridColumnEnd() { return this.get("grid-column-end") }; set gridColumnGap(v: string) { this.set("grid-column-gap: " + v) } get gridColumnGap() { return this.get("grid-column-gap") }; set gridColumnStart(v: string) { this.set("grid-column-start: " + v) } get gridColumnStart() { return this.get("grid-column-start") }; set gridGap(v: string) { this.set("grid-gap: " + v) } get gridGap() { return this.get("grid-gap") }; set gridRow(v: string) { this.set("grid-row: " + v) } get gridRow() { return this.get("grid-row") }; set gridRowEnd(v: string) { this.set("grid-row-end: " + v) } get gridRowEnd() { return this.get("grid-row-end") }; set gridRowGap(v: string) { this.set("grid-row-gap: " + v) } get gridRowGap() { return this.get("grid-row-gap") }; set gridRowStart(v: string) { this.set("grid-row-start: " + v) } get gridRowStart() { return this.get("grid-row-start") }; set gridTemplate(v: string) { this.set("grid-template: " + v) } get gridTemplate() { return this.get("grid-template") }; set gridTemplateAreas(v: string) { this.set("grid-template-areas: " + v) } get gridTemplateAreas() { return this.get("grid-template-areas") }; set gridTemplateColumns(v: string) { this.set("grid-template-columns: " + v) } get gridTemplateColumns() { return this.get("grid-template-columns") }; set gridTemplateRows(v: string) { this.set("grid-template-rows: " + v) } get gridTemplateRows() { return this.get("grid-template-rows") }; set height(v: string) { this.set("height: " + v) } get height() { return this.get("height") }; set hyphens(v: string) { this.set("hyphens: " + v) } get hyphens() { return this.get("hyphens") }; set imageOrientation(v: string) { this.set("image-orientation: " + v) } get imageOrientation() { return this.get("image-orientation") }; set imageRendering(v: string) { this.set("image-rendering: " + v) } get imageRendering() { return this.get("image-rendering") }; set inherits(v: string) { this.set("inherits: " + v) } get inherits() { return this.get("inherits") }; set initialValue(v: string) { this.set("initial-value: " + v) } get initialValue() { return this.get("initial-value") }; set inlineSize(v: string) { this.set("inline-size: " + v) } get inlineSize() { return this.get("inline-size") }; set inset(v: string) { this.set("inset: " + v) } get inset() { return this.get("inset") }; set insetBlock(v: string) { this.set("inset-block: " + v) } get insetBlock() { return this.get("inset-block") }; set insetBlockEnd(v: string) { this.set("inset-block-end: " + v) } get insetBlockEnd() { return this.get("inset-block-end") }; set insetBlockStart(v: string) { this.set("inset-block-start: " + v) } get insetBlockStart() { return this.get("inset-block-start") }; set insetInline(v: string) { this.set("inset-inline: " + v) } get insetInline() { return this.get("inset-inline") }; set insetInlineEnd(v: string) { this.set("inset-inline-end: " + v) } get insetInlineEnd() { return this.get("inset-inline-end") }; set insetInlineStart(v: string) { this.set("inset-inline-start: " + v) } get insetInlineStart() { return this.get("inset-inline-start") }; set isolation(v: string) { this.set("isolation: " + v) } get isolation() { return this.get("isolation") }; set justifyContent(v: string) { this.set("justify-content: " + v) } get justifyContent() { return this.get("justify-content") }; set justifyItems(v: string) { this.set("justify-items: " + v) } get justifyItems() { return this.get("justify-items") }; set justifySelf(v: string) { this.set("justify-self: " + v) } get justifySelf() { return this.get("justify-self") }; set left(v: string) { this.set("left: " + v) } get left() { return this.get("left") }; set letterSpacing(v: string) { this.set("letter-spacing: " + v) } get letterSpacing() { return this.get("letter-spacing") }; set lightingColor(v: string) { this.set("lighting-color: " + v) } get lightingColor() { return this.get("lighting-color") }; set lineBreak(v: string) { this.set("line-break: " + v) } get lineBreak() { return this.get("line-break") }; set lineGapOverride(v: string) { this.set("line-gap-override: " + v) } get lineGapOverride() { return this.get("line-gap-override") }; set lineHeight(v: string) { this.set("line-height: " + v) } get lineHeight() { return this.get("line-height") }; set listStyle(v: string) { this.set("list-style: " + v) } get listStyle() { return this.get("list-style") }; set listStyleImage(v: string) { this.set("list-style-image: " + v) } get listStyleImage() { return this.get("list-style-image") }; set listStylePosition(v: string) { this.set("list-style-position: " + v) } get listStylePosition() { return this.get("list-style-position") }; set listStyleType(v: string) { this.set("list-style-type: " + v) } get listStyleType() { return this.get("list-style-type") }; set margin(v: string) { this.set("margin: " + v) } get margin() { return this.get("margin") }; set marginBlock(v: string) { this.set("margin-block: " + v) } get marginBlock() { return this.get("margin-block") }; set marginBlockEnd(v: string) { this.set("margin-block-end: " + v) } get marginBlockEnd() { return this.get("margin-block-end") }; set marginBlockStart(v: string) { this.set("margin-block-start: " + v) } get marginBlockStart() { return this.get("margin-block-start") }; set marginBottom(v: string) { this.set("margin-bottom: " + v) } get marginBottom() { return this.get("margin-bottom") }; set marginInline(v: string) { this.set("margin-inline: " + v) } get marginInline() { return this.get("margin-inline") }; set marginInlineEnd(v: string) { this.set("margin-inline-end: " + v) } get marginInlineEnd() { return this.get("margin-inline-end") }; set marginInlineStart(v: string) { this.set("margin-inline-start: " + v) } get marginInlineStart() { return this.get("margin-inline-start") }; set marginLeft(v: string) { this.set("margin-left: " + v) } get marginLeft() { return this.get("margin-left") }; set marginRight(v: string) { this.set("margin-right: " + v) } get marginRight() { return this.get("margin-right") }; set marginTop(v: string) { this.set("margin-top: " + v) } get marginTop() { return this.get("margin-top") }; set marker(v: string) { this.set("marker: " + v) } get marker() { return this.get("marker") }; set markerEnd(v: string) { this.set("marker-end: " + v) } get markerEnd() { return this.get("marker-end") }; set markerMid(v: string) { this.set("marker-mid: " + v) } get markerMid() { return this.get("marker-mid") }; set markerStart(v: string) { this.set("marker-start: " + v) } get markerStart() { return this.get("marker-start") }; set mask(v: string) { this.set("mask: " + v) } get mask() { return this.get("mask") }; set maskType(v: string) { this.set("mask-type: " + v) } get maskType() { return this.get("mask-type") }; set maxBlockSize(v: string) { this.set("max-block-size: " + v) } get maxBlockSize() { return this.get("max-block-size") }; set maxHeight(v: string) { this.set("max-height: " + v) } get maxHeight() { return this.get("max-height") }; set maxInlineSize(v: string) { this.set("max-inline-size: " + v) } get maxInlineSize() { return this.get("max-inline-size") }; set maxWidth(v: string) { this.set("max-width: " + v) } get maxWidth() { return this.get("max-width") }; set maxZoom(v: string) { this.set("max-zoom: " + v) } get maxZoom() { return this.get("max-zoom") }; set minBlockSize(v: string) { this.set("min-block-size: " + v) } get minBlockSize() { return this.get("min-block-size") }; set minHeight(v: string) { this.set("min-height: " + v) } get minHeight() { return this.get("min-height") }; set minInlineSize(v: string) { this.set("min-inline-size: " + v) } get minInlineSize() { return this.get("min-inline-size") }; set minWidth(v: string) { this.set("min-width: " + v) } get minWidth() { return this.get("min-width") }; set minZoom(v: string) { this.set("min-zoom: " + v) } get minZoom() { return this.get("min-zoom") }; set mixBlendMode(v: string) { this.set("mix-blend-mode: " + v) } get mixBlendMode() { return this.get("mix-blend-mode") }; set negative(v: string) { this.set("negative: " + v) } get negative() { return this.get("negative") }; set objectFit(v: string) { this.set("object-fit: " + v) } get objectFit() { return this.get("object-fit") }; set objectPosition(v: string) { this.set("object-position: " + v) } get objectPosition() { return this.get("object-position") }; set offset(v: string) { this.set("offset: " + v) } get offset() { return this.get("offset") }; set offsetDistance(v: string) { this.set("offset-distance: " + v) } get offsetDistance() { return this.get("offset-distance") }; set offsetPath(v: string) { this.set("offset-path: " + v) } get offsetPath() { return this.get("offset-path") }; set offsetRotate(v: string) { this.set("offset-rotate: " + v) } get offsetRotate() { return this.get("offset-rotate") }; set opacity(v: string) { this.set("opacity: " + v) } get opacity() { return this.get("opacity") }; set order(v: string) { this.set("order: " + v) } get order() { return this.get("order") }; set orientation(v: string) { this.set("orientation: " + v) } get orientation() { return this.get("orientation") }; set orphans(v: string) { this.set("orphans: " + v) } get orphans() { return this.get("orphans") }; set outline(v: string) { this.set("outline: " + v) } get outline() { return this.get("outline") }; set outlineColor(v: string) { this.set("outline-color: " + v) } get outlineColor() { return this.get("outline-color") }; set outlineOffset(v: string) { this.set("outline-offset: " + v) } get outlineOffset() { return this.get("outline-offset") }; set outlineStyle(v: string) { this.set("outline-style: " + v) } get outlineStyle() { return this.get("outline-style") }; set outlineWidth(v: string) { this.set("outline-width: " + v) } get outlineWidth() { return this.get("outline-width") }; set overflow(v: string) { this.set("overflow: " + v) } get overflow() { return this.get("overflow") }; set overflowAnchor(v: string) { this.set("overflow-anchor: " + v) } get overflowAnchor() { return this.get("overflow-anchor") }; set overflowClipMargin(v: string) { this.set("overflow-clip-margin: " + v) } get overflowClipMargin() { return this.get("overflow-clip-margin") }; set overflowWrap(v: string) { this.set("overflow-wrap: " + v) } get overflowWrap() { return this.get("overflow-wrap") }; set overflowX(v: string) { this.set("overflow-x: " + v) } get overflowX() { return this.get("overflow-x") }; set overflowY(v: string) { this.set("overflow-y: " + v) } get overflowY() { return this.get("overflow-y") }; set overscrollBehavior(v: string) { this.set("overscroll-behavior: " + v) } get overscrollBehavior() { return this.get("overscroll-behavior") }; set overscrollBehaviorBlock(v: string) { this.set("overscroll-behavior-block: " + v) } get overscrollBehaviorBlock() { return this.get("overscroll-behavior-block") }; set overscrollBehaviorInline(v: string) { this.set("overscroll-behavior-inline: " + v) } get overscrollBehaviorInline() { return this.get("overscroll-behavior-inline") }; set overscrollBehaviorX(v: string) { this.set("overscroll-behavior-x: " + v) } get overscrollBehaviorX() { return this.get("overscroll-behavior-x") }; set overscrollBehaviorY(v: string) { this.set("overscroll-behavior-y: " + v) } get overscrollBehaviorY() { return this.get("overscroll-behavior-y") }; set pad(v: string) { this.set("pad: " + v) } get pad() { return this.get("pad") }; set padding(v: string) { this.set("padding: " + v) } get padding() { return this.get("padding") }; set paddingBlock(v: string) { this.set("padding-block: " + v) } get paddingBlock() { return this.get("padding-block") }; set paddingBlockEnd(v: string) { this.set("padding-block-end: " + v) } get paddingBlockEnd() { return this.get("padding-block-end") }; set paddingBlockStart(v: string) { this.set("padding-block-start: " + v) } get paddingBlockStart() { return this.get("padding-block-start") }; set paddingBottom(v: string) { this.set("padding-bottom: " + v) } get paddingBottom() { return this.get("padding-bottom") }; set paddingInline(v: string) { this.set("padding-inline: " + v) } get paddingInline() { return this.get("padding-inline") }; set paddingInlineEnd(v: string) { this.set("padding-inline-end: " + v) } get paddingInlineEnd() { return this.get("padding-inline-end") }; set paddingInlineStart(v: string) { this.set("padding-inline-start: " + v) } get paddingInlineStart() { return this.get("padding-inline-start") }; set paddingLeft(v: string) { this.set("padding-left: " + v) } get paddingLeft() { return this.get("padding-left") }; set paddingRight(v: string) { this.set("padding-right: " + v) } get paddingRight() { return this.get("padding-right") }; set paddingTop(v: string) { this.set("padding-top: " + v) } get paddingTop() { return this.get("padding-top") }; set page(v: string) { this.set("page: " + v) } get page() { return this.get("page") }; set pageBreakAfter(v: string) { this.set("page-break-after: " + v) } get pageBreakAfter() { return this.get("page-break-after") }; set pageBreakBefore(v: string) { this.set("page-break-before: " + v) } get pageBreakBefore() { return this.get("page-break-before") }; set pageBreakInside(v: string) { this.set("page-break-inside: " + v) } get pageBreakInside() { return this.get("page-break-inside") }; set pageOrientation(v: string) { this.set("page-orientation: " + v) } get pageOrientation() { return this.get("page-orientation") }; set paintOrder(v: string) { this.set("paint-order: " + v) } get paintOrder() { return this.get("paint-order") }; set perspective(v: string) { this.set("perspective: " + v) } get perspective() { return this.get("perspective") }; set perspectiveOrigin(v: string) { this.set("perspective-origin: " + v) } get perspectiveOrigin() { return this.get("perspective-origin") }; set placeContent(v: string) { this.set("place-content: " + v) } get placeContent() { return this.get("place-content") }; set placeItems(v: string) { this.set("place-items: " + v) } get placeItems() { return this.get("place-items") }; set placeSelf(v: string) { this.set("place-self: " + v) } get placeSelf() { return this.get("place-self") }; set pointerEvents(v: string) { this.set("pointer-events: " + v) } get pointerEvents() { return this.get("pointer-events") }; set position(v: string) { this.set("position: " + v) } get position() { return this.get("position") }; set prefix(v: string) { this.set("prefix: " + v) } get prefix() { return this.get("prefix") }; set quotes(v: string) { this.set("quotes: " + v) } get quotes() { return this.get("quotes") }; set r(v: string) { this.set("r: " + v) } get r() { return this.get("r") }; set range(v: string) { this.set("range: " + v) } get range() { return this.get("range") }; set resize(v: string) { this.set("resize: " + v) } get resize() { return this.get("resize") }; set right(v: string) { this.set("right: " + v) } get right() { return this.get("right") }; set rowGap(v: string) { this.set("row-gap: " + v) } get rowGap() { return this.get("row-gap") }; set rubyPosition(v: string) { this.set("ruby-position: " + v) } get rubyPosition() { return this.get("ruby-position") }; set rx(v: string) { this.set("rx: " + v) } get rx() { return this.get("rx") }; set ry(v: string) { this.set("ry: " + v) } get ry() { return this.get("ry") }; set scrollBehavior(v: string) { this.set("scroll-behavior: " + v) } get scrollBehavior() { return this.get("scroll-behavior") }; set scrollMargin(v: string) { this.set("scroll-margin: " + v) } get scrollMargin() { return this.get("scroll-margin") }; set scrollMarginBlock(v: string) { this.set("scroll-margin-block: " + v) } get scrollMarginBlock() { return this.get("scroll-margin-block") }; set scrollMarginBlockEnd(v: string) { this.set("scroll-margin-block-end: " + v) } get scrollMarginBlockEnd() { return this.get("scroll-margin-block-end") }; set scrollMarginBlockStart(v: string) { this.set("scroll-margin-block-start: " + v) } get scrollMarginBlockStart() { return this.get("scroll-margin-block-start") }; set scrollMarginBottom(v: string) { this.set("scroll-margin-bottom: " + v) } get scrollMarginBottom() { return this.get("scroll-margin-bottom") }; set scrollMarginInline(v: string) { this.set("scroll-margin-inline: " + v) } get scrollMarginInline() { return this.get("scroll-margin-inline") }; set scrollMarginInlineEnd(v: string) { this.set("scroll-margin-inline-end: " + v) } get scrollMarginInlineEnd() { return this.get("scroll-margin-inline-end") }; set scrollMarginInlineStart(v: string) { this.set("scroll-margin-inline-start: " + v) } get scrollMarginInlineStart() { return this.get("scroll-margin-inline-start") }; set scrollMarginLeft(v: string) { this.set("scroll-margin-left: " + v) } get scrollMarginLeft() { return this.get("scroll-margin-left") }; set scrollMarginRight(v: string) { this.set("scroll-margin-right: " + v) } get scrollMarginRight() { return this.get("scroll-margin-right") }; set scrollMarginTop(v: string) { this.set("scroll-margin-top: " + v) } get scrollMarginTop() { return this.get("scroll-margin-top") }; set scrollPadding(v: string) { this.set("scroll-padding: " + v) } get scrollPadding() { return this.get("scroll-padding") }; set scrollPaddingBlock(v: string) { this.set("scroll-padding-block: " + v) } get scrollPaddingBlock() { return this.get("scroll-padding-block") }; set scrollPaddingBlockEnd(v: string) { this.set("scroll-padding-block-end: " + v) } get scrollPaddingBlockEnd() { return this.get("scroll-padding-block-end") }; set scrollPaddingBlockStart(v: string) { this.set("scroll-padding-block-start: " + v) } get scrollPaddingBlockStart() { return this.get("scroll-padding-block-start") }; set scrollPaddingBottom(v: string) { this.set("scroll-padding-bottom: " + v) } get scrollPaddingBottom() { return this.get("scroll-padding-bottom") }; set scrollPaddingInline(v: string) { this.set("scroll-padding-inline: " + v) } get scrollPaddingInline() { return this.get("scroll-padding-inline") }; set scrollPaddingInlineEnd(v: string) { this.set("scroll-padding-inline-end: " + v) } get scrollPaddingInlineEnd() { return this.get("scroll-padding-inline-end") }; set scrollPaddingInlineStart(v: string) { this.set("scroll-padding-inline-start: " + v) } get scrollPaddingInlineStart() { return this.get("scroll-padding-inline-start") }; set scrollPaddingLeft(v: string) { this.set("scroll-padding-left: " + v) } get scrollPaddingLeft() { return this.get("scroll-padding-left") }; set scrollPaddingRight(v: string) { this.set("scroll-padding-right: " + v) } get scrollPaddingRight() { return this.get("scroll-padding-right") }; set scrollPaddingTop(v: string) { this.set("scroll-padding-top: " + v) } get scrollPaddingTop() { return this.get("scroll-padding-top") }; set scrollSnapAlign(v: string) { this.set("scroll-snap-align: " + v) } get scrollSnapAlign() { return this.get("scroll-snap-align") }; set scrollSnapStop(v: string) { this.set("scroll-snap-stop: " + v) } get scrollSnapStop() { return this.get("scroll-snap-stop") }; set scrollSnapType(v: string) { this.set("scroll-snap-type: " + v) } get scrollSnapType() { return this.get("scroll-snap-type") }; set shapeImageThreshold(v: string) { this.set("shape-image-threshold: " + v) } get shapeImageThreshold() { return this.get("shape-image-threshold") }; set shapeMargin(v: string) { this.set("shape-margin: " + v) } get shapeMargin() { return this.get("shape-margin") }; set shapeOutside(v: string) { this.set("shape-outside: " + v) } get shapeOutside() { return this.get("shape-outside") }; set shapeRendering(v: string) { this.set("shape-rendering: " + v) } get shapeRendering() { return this.get("shape-rendering") }; set size(v: string) { this.set("size: " + v) } get size() { return this.get("size") }; set speak(v: string) { this.set("speak: " + v) } get speak() { return this.get("speak") }; set speakAs(v: string) { this.set("speak-as: " + v) } get speakAs() { return this.get("speak-as") }; set src(v: string) { this.set("src: " + v) } get src() { return this.get("src") }; set stopColor(v: string) { this.set("stop-color: " + v) } get stopColor() { return this.get("stop-color") }; set stopOpacity(v: string) { this.set("stop-opacity: " + v) } get stopOpacity() { return this.get("stop-opacity") }; set stroke(v: string) { this.set("stroke: " + v) } get stroke() { return this.get("stroke") }; set strokeDasharray(v: string) { this.set("stroke-dasharray: " + v) } get strokeDasharray() { return this.get("stroke-dasharray") }; set strokeDashoffset(v: string) { this.set("stroke-dashoffset: " + v) } get strokeDashoffset() { return this.get("stroke-dashoffset") }; set strokeLinecap(v: string) { this.set("stroke-linecap: " + v) } get strokeLinecap() { return this.get("stroke-linecap") }; set strokeLinejoin(v: string) { this.set("stroke-linejoin: " + v) } get strokeLinejoin() { return this.get("stroke-linejoin") }; set strokeMiterlimit(v: string) { this.set("stroke-miterlimit: " + v) } get strokeMiterlimit() { return this.get("stroke-miterlimit") }; set strokeOpacity(v: string) { this.set("stroke-opacity: " + v) } get strokeOpacity() { return this.get("stroke-opacity") }; set strokeWidth(v: string) { this.set("stroke-width: " + v) } get strokeWidth() { return this.get("stroke-width") }; set suffix(v: string) { this.set("suffix: " + v) } get suffix() { return this.get("suffix") }; set symbols(v: string) { this.set("symbols: " + v) } get symbols() { return this.get("symbols") }; set syntax(v: string) { this.set("syntax: " + v) } get syntax() { return this.get("syntax") }; set system(v: string) { this.set("system: " + v) } get system() { return this.get("system") }; set tabSize(v: string) { this.set("tab-size: " + v) } get tabSize() { return this.get("tab-size") }; set tableLayout(v: string) { this.set("table-layout: " + v) } get tableLayout() { return this.get("table-layout") }; set textAlign(v: string) { this.set("text-align: " + v) } get textAlign() { return this.get("text-align") }; set textAlignLast(v: string) { this.set("text-align-last: " + v) } get textAlignLast() { return this.get("text-align-last") }; set textAnchor(v: string) { this.set("text-anchor: " + v) } get textAnchor() { return this.get("text-anchor") }; set textCombineUpright(v: string) { this.set("text-combine-upright: " + v) } get textCombineUpright() { return this.get("text-combine-upright") }; set textDecoration(v: string) { this.set("text-decoration: " + v) } get textDecoration() { return this.get("text-decoration") }; set textDecorationColor(v: string) { this.set("text-decoration-color: " + v) } get textDecorationColor() { return this.get("text-decoration-color") }; set textDecorationLine(v: string) { this.set("text-decoration-line: " + v) } get textDecorationLine() { return this.get("text-decoration-line") }; set textDecorationSkipInk(v: string) { this.set("text-decoration-skip-ink: " + v) } get textDecorationSkipInk() { return this.get("text-decoration-skip-ink") }; set textDecorationStyle(v: string) { this.set("text-decoration-style: " + v) } get textDecorationStyle() { return this.get("text-decoration-style") }; set textDecorationThickness(v: string) { this.set("text-decoration-thickness: " + v) } get textDecorationThickness() { return this.get("text-decoration-thickness") }; set textIndent(v: string) { this.set("text-indent: " + v) } get textIndent() { return this.get("text-indent") }; set textOrientation(v: string) { this.set("text-orientation: " + v) } get textOrientation() { return this.get("text-orientation") }; set textOverflow(v: string) { this.set("text-overflow: " + v) } get textOverflow() { return this.get("text-overflow") }; set textRendering(v: string) { this.set("text-rendering: " + v) } get textRendering() { return this.get("text-rendering") }; set textShadow(v: string) { this.set("text-shadow: " + v) } get textShadow() { return this.get("text-shadow") }; set textSizeAdjust(v: string) { this.set("text-size-adjust: " + v) } get textSizeAdjust() { return this.get("text-size-adjust") }; set textTransform(v: string) { this.set("text-transform: " + v) } get textTransform() { return this.get("text-transform") }; set textUnderlineOffset(v: string) { this.set("text-underline-offset: " + v) } get textUnderlineOffset() { return this.get("text-underline-offset") }; set textUnderlinePosition(v: string) { this.set("text-underline-position: " + v) } get textUnderlinePosition() { return this.get("text-underline-position") }; set top(v: string) { this.set("top: " + v) } get top() { return this.get("top") }; set touchAction(v: string) { this.set("touch-action: " + v) } get touchAction() { return this.get("touch-action") }; set transform(v: string) { this.set("transform: " + v) } get transform() { return this.get("transform") }; set transformBox(v: string) { this.set("transform-box: " + v) } get transformBox() { return this.get("transform-box") }; set transformOrigin(v: string) { this.set("transform-origin: " + v) } get transformOrigin() { return this.get("transform-origin") }; set transformStyle(v: string) { this.set("transform-style: " + v) } get transformStyle() { return this.get("transform-style") }; set transition(v: string) { this.set("transition: " + v) } get transition() { return this.get("transition") }; set transitionDelay(v: string) { this.set("transition-delay: " + v) } get transitionDelay() { return this.get("transition-delay") }; set transitionDuration(v: string) { this.set("transition-duration: " + v) } get transitionDuration() { return this.get("transition-duration") }; set transitionProperty(v: string) { this.set("transition-property: " + v) } get transitionProperty() { return this.get("transition-property") }; set transitionTimingFunction(v: string) { this.set("transition-timing-function: " + v) } get transitionTimingFunction() { return this.get("transition-timing-function") }; set unicodeBidi(v: string) { this.set("unicode-bidi: " + v) } get unicodeBidi() { return this.get("unicode-bidi") }; set unicodeRange(v: string) { this.set("unicode-range: " + v) } get unicodeRange() { return this.get("unicode-range") }; set userSelect(v: string) { this.set("user-select: " + v) } get userSelect() { return this.get("user-select") }; set userZoom(v: string) { this.set("user-zoom: " + v) } get userZoom() { return this.get("user-zoom") }; set vectorEffect(v: string) { this.set("vector-effect: " + v) } get vectorEffect() { return this.get("vector-effect") }; set verticalAlign(v: string) { this.set("vertical-align: " + v) } get verticalAlign() { return this.get("vertical-align") }; set visibility(v: string) { this.set("visibility: " + v) } get visibility() { return this.get("visibility") }; set webkitAlignContent(v: string) { this.set("webkit-align-content: " + v) } get webkitAlignContent() { return this.get("webkit-align-content") }; set webkitAlignItems(v: string) { this.set("webkit-align-items: " + v) } get webkitAlignItems() { return this.get("webkit-align-items") }; set webkitAlignSelf(v: string) { this.set("webkit-align-self: " + v) } get webkitAlignSelf() { return this.get("webkit-align-self") }; set webkitAnimation(v: string) { this.set("webkit-animation: " + v) } get webkitAnimation() { return this.get("webkit-animation") }; set webkitAnimationDelay(v: string) { this.set("webkit-animation-delay: " + v) } get webkitAnimationDelay() { return this.get("webkit-animation-delay") }; set webkitAnimationDirection(v: string) { this.set("webkit-animation-direction: " + v) } get webkitAnimationDirection() { return this.get("webkit-animation-direction") }; set webkitAnimationDuration(v: string) { this.set("webkit-animation-duration: " + v) } get webkitAnimationDuration() { return this.get("webkit-animation-duration") }; set webkitAnimationFillMode(v: string) { this.set("webkit-animation-fill-mode: " + v) } get webkitAnimationFillMode() { return this.get("webkit-animation-fill-mode") }; set webkitAnimationIterationCount(v: string) { this.set("webkit-animation-iteration-count: " + v) } get webkitAnimationIterationCount() { return this.get("webkit-animation-iteration-count") }; set webkitAnimationName(v: string) { this.set("webkit-animation-name: " + v) } get webkitAnimationName() { return this.get("webkit-animation-name") }; set webkitAnimationPlayState(v: string) { this.set("webkit-animation-play-state: " + v) } get webkitAnimationPlayState() { return this.get("webkit-animation-play-state") }; set webkitAnimationTimingFunction(v: string) { this.set("webkit-animation-timing-function: " + v) } get webkitAnimationTimingFunction() { return this.get("webkit-animation-timing-function") }; set webkitAppRegion(v: string) { this.set("webkit-app-region: " + v) } get webkitAppRegion() { return this.get("webkit-app-region") }; set webkitAppearance(v: string) { this.set("webkit-appearance: " + v) } get webkitAppearance() { return this.get("webkit-appearance") }; set webkitBackfaceVisibility(v: string) { this.set("webkit-backface-visibility: " + v) } get webkitBackfaceVisibility() { return this.get("webkit-backface-visibility") }; set webkitBackgroundClip(v: string) { this.set("webkit-background-clip: " + v) } get webkitBackgroundClip() { return this.get("webkit-background-clip") }; set webkitBackgroundOrigin(v: string) { this.set("webkit-background-origin: " + v) } get webkitBackgroundOrigin() { return this.get("webkit-background-origin") }; set webkitBackgroundSize(v: string) { this.set("webkit-background-size: " + v) } get webkitBackgroundSize() { return this.get("webkit-background-size") }; set webkitBorderAfter(v: string) { this.set("webkit-border-after: " + v) } get webkitBorderAfter() { return this.get("webkit-border-after") }; set webkitBorderAfterColor(v: string) { this.set("webkit-border-after-color: " + v) } get webkitBorderAfterColor() { return this.get("webkit-border-after-color") }; set webkitBorderAfterStyle(v: string) { this.set("webkit-border-after-style: " + v) } get webkitBorderAfterStyle() { return this.get("webkit-border-after-style") }; set webkitBorderAfterWidth(v: string) { this.set("webkit-border-after-width: " + v) } get webkitBorderAfterWidth() { return this.get("webkit-border-after-width") }; set webkitBorderBefore(v: string) { this.set("webkit-border-before: " + v) } get webkitBorderBefore() { return this.get("webkit-border-before") }; set webkitBorderBeforeColor(v: string) { this.set("webkit-border-before-color: " + v) } get webkitBorderBeforeColor() { return this.get("webkit-border-before-color") }; set webkitBorderBeforeStyle(v: string) { this.set("webkit-border-before-style: " + v) } get webkitBorderBeforeStyle() { return this.get("webkit-border-before-style") }; set webkitBorderBeforeWidth(v: string) { this.set("webkit-border-before-width: " + v) } get webkitBorderBeforeWidth() { return this.get("webkit-border-before-width") }; set webkitBorderBottomLeftRadius(v: string) { this.set("webkit-border-bottom-left-radius: " + v) } get webkitBorderBottomLeftRadius() { return this.get("webkit-border-bottom-left-radius") }; set webkitBorderBottomRightRadius(v: string) { this.set("webkit-border-bottom-right-radius: " + v) } get webkitBorderBottomRightRadius() { return this.get("webkit-border-bottom-right-radius") }; set webkitBorderEnd(v: string) { this.set("webkit-border-end: " + v) } get webkitBorderEnd() { return this.get("webkit-border-end") }; set webkitBorderEndColor(v: string) { this.set("webkit-border-end-color: " + v) } get webkitBorderEndColor() { return this.get("webkit-border-end-color") }; set webkitBorderEndStyle(v: string) { this.set("webkit-border-end-style: " + v) } get webkitBorderEndStyle() { return this.get("webkit-border-end-style") }; set webkitBorderEndWidth(v: string) { this.set("webkit-border-end-width: " + v) } get webkitBorderEndWidth() { return this.get("webkit-border-end-width") }; set webkitBorderHorizontalSpacing(v: string) { this.set("webkit-border-horizontal-spacing: " + v) } get webkitBorderHorizontalSpacing() { return this.get("webkit-border-horizontal-spacing") }; set webkitBorderImage(v: string) { this.set("webkit-border-image: " + v) } get webkitBorderImage() { return this.get("webkit-border-image") }; set webkitBorderRadius(v: string) { this.set("webkit-border-radius: " + v) } get webkitBorderRadius() { return this.get("webkit-border-radius") }; set webkitBorderStart(v: string) { this.set("webkit-border-start: " + v) } get webkitBorderStart() { return this.get("webkit-border-start") }; set webkitBorderStartColor(v: string) { this.set("webkit-border-start-color: " + v) } get webkitBorderStartColor() { return this.get("webkit-border-start-color") }; set webkitBorderStartStyle(v: string) { this.set("webkit-border-start-style: " + v) } get webkitBorderStartStyle() { return this.get("webkit-border-start-style") }; set webkitBorderStartWidth(v: string) { this.set("webkit-border-start-width: " + v) } get webkitBorderStartWidth() { return this.get("webkit-border-start-width") }; set webkitBorderTopLeftRadius(v: string) { this.set("webkit-border-top-left-radius: " + v) } get webkitBorderTopLeftRadius() { return this.get("webkit-border-top-left-radius") }; set webkitBorderTopRightRadius(v: string) { this.set("webkit-border-top-right-radius: " + v) } get webkitBorderTopRightRadius() { return this.get("webkit-border-top-right-radius") }; set webkitBorderVerticalSpacing(v: string) { this.set("webkit-border-vertical-spacing: " + v) } get webkitBorderVerticalSpacing() { return this.get("webkit-border-vertical-spacing") }; set webkitBoxAlign(v: string) { this.set("webkit-box-align: " + v) } get webkitBoxAlign() { return this.get("webkit-box-align") }; set webkitBoxDecorationBreak(v: string) { this.set("webkit-box-decoration-break: " + v) } get webkitBoxDecorationBreak() { return this.get("webkit-box-decoration-break") }; set webkitBoxDirection(v: string) { this.set("webkit-box-direction: " + v) } get webkitBoxDirection() { return this.get("webkit-box-direction") }; set webkitBoxFlex(v: string) { this.set("webkit-box-flex: " + v) } get webkitBoxFlex() { return this.get("webkit-box-flex") }; set webkitBoxOrdinalGroup(v: string) { this.set("webkit-box-ordinal-group: " + v) } get webkitBoxOrdinalGroup() { return this.get("webkit-box-ordinal-group") }; set webkitBoxOrient(v: string) { this.set("webkit-box-orient: " + v) } get webkitBoxOrient() { return this.get("webkit-box-orient") }; set webkitBoxPack(v: string) { this.set("webkit-box-pack: " + v) } get webkitBoxPack() { return this.get("webkit-box-pack") }; set webkitBoxReflect(v: string) { this.set("webkit-box-reflect: " + v) } get webkitBoxReflect() { return this.get("webkit-box-reflect") }; set webkitBoxShadow(v: string) { this.set("webkit-box-shadow: " + v) } get webkitBoxShadow() { return this.get("webkit-box-shadow") }; set webkitBoxSizing(v: string) { this.set("webkit-box-sizing: " + v) } get webkitBoxSizing() { return this.get("webkit-box-sizing") }; set webkitClipPath(v: string) { this.set("webkit-clip-path: " + v) } get webkitClipPath() { return this.get("webkit-clip-path") }; set webkitColumnBreakAfter(v: string) { this.set("webkit-column-break-after: " + v) } get webkitColumnBreakAfter() { return this.get("webkit-column-break-after") }; set webkitColumnBreakBefore(v: string) { this.set("webkit-column-break-before: " + v) } get webkitColumnBreakBefore() { return this.get("webkit-column-break-before") }; set webkitColumnBreakInside(v: string) { this.set("webkit-column-break-inside: " + v) } get webkitColumnBreakInside() { return this.get("webkit-column-break-inside") }; set webkitColumnCount(v: string) { this.set("webkit-column-count: " + v) } get webkitColumnCount() { return this.get("webkit-column-count") }; set webkitColumnGap(v: string) { this.set("webkit-column-gap: " + v) } get webkitColumnGap() { return this.get("webkit-column-gap") }; set webkitColumnRule(v: string) { this.set("webkit-column-rule: " + v) } get webkitColumnRule() { return this.get("webkit-column-rule") }; set webkitColumnRuleColor(v: string) { this.set("webkit-column-rule-color: " + v) } get webkitColumnRuleColor() { return this.get("webkit-column-rule-color") }; set webkitColumnRuleStyle(v: string) { this.set("webkit-column-rule-style: " + v) } get webkitColumnRuleStyle() { return this.get("webkit-column-rule-style") }; set webkitColumnRuleWidth(v: string) { this.set("webkit-column-rule-width: " + v) } get webkitColumnRuleWidth() { return this.get("webkit-column-rule-width") }; set webkitColumnSpan(v: string) { this.set("webkit-column-span: " + v) } get webkitColumnSpan() { return this.get("webkit-column-span") }; set webkitColumnWidth(v: string) { this.set("webkit-column-width: " + v) } get webkitColumnWidth() { return this.get("webkit-column-width") }; set webkitColumns(v: string) { this.set("webkit-columns: " + v) } get webkitColumns() { return this.get("webkit-columns") }; set webkitFilter(v: string) { this.set("webkit-filter: " + v) } get webkitFilter() { return this.get("webkit-filter") }; set webkitFlex(v: string) { this.set("webkit-flex: " + v) } get webkitFlex() { return this.get("webkit-flex") }; set webkitFlexBasis(v: string) { this.set("webkit-flex-basis: " + v) } get webkitFlexBasis() { return this.get("webkit-flex-basis") }; set webkitFlexDirection(v: string) { this.set("webkit-flex-direction: " + v) } get webkitFlexDirection() { return this.get("webkit-flex-direction") }; set webkitFlexFlow(v: string) { this.set("webkit-flex-flow: " + v) } get webkitFlexFlow() { return this.get("webkit-flex-flow") }; set webkitFlexGrow(v: string) { this.set("webkit-flex-grow: " + v) } get webkitFlexGrow() { return this.get("webkit-flex-grow") }; set webkitFlexShrink(v: string) { this.set("webkit-flex-shrink: " + v) } get webkitFlexShrink() { return this.get("webkit-flex-shrink") }; set webkitFlexWrap(v: string) { this.set("webkit-flex-wrap: " + v) } get webkitFlexWrap() { return this.get("webkit-flex-wrap") }; set webkitFontFeatureSettings(v: string) { this.set("webkit-font-feature-settings: " + v) } get webkitFontFeatureSettings() { return this.get("webkit-font-feature-settings") }; set webkitFontSmoothing(v: string) { this.set("webkit-font-smoothing: " + v) } get webkitFontSmoothing() { return this.get("webkit-font-smoothing") }; set webkitHighlight(v: string) { this.set("webkit-highlight: " + v) } get webkitHighlight() { return this.get("webkit-highlight") }; set webkitHyphenateCharacter(v: string) { this.set("webkit-hyphenate-character: " + v) } get webkitHyphenateCharacter() { return this.get("webkit-hyphenate-character") }; set webkitJustifyContent(v: string) { this.set("webkit-justify-content: " + v) } get webkitJustifyContent() { return this.get("webkit-justify-content") }; set webkitLineBreak(v: string) { this.set("webkit-line-break: " + v) } get webkitLineBreak() { return this.get("webkit-line-break") }; set webkitLineClamp(v: string) { this.set("webkit-line-clamp: " + v) } get webkitLineClamp() { return this.get("webkit-line-clamp") }; set webkitLocale(v: string) { this.set("webkit-locale: " + v) } get webkitLocale() { return this.get("webkit-locale") }; set webkitLogicalHeight(v: string) { this.set("webkit-logical-height: " + v) } get webkitLogicalHeight() { return this.get("webkit-logical-height") }; set webkitLogicalWidth(v: string) { this.set("webkit-logical-width: " + v) } get webkitLogicalWidth() { return this.get("webkit-logical-width") }; set webkitMarginAfter(v: string) { this.set("webkit-margin-after: " + v) } get webkitMarginAfter() { return this.get("webkit-margin-after") }; set webkitMarginBefore(v: string) { this.set("webkit-margin-before: " + v) } get webkitMarginBefore() { return this.get("webkit-margin-before") }; set webkitMarginEnd(v: string) { this.set("webkit-margin-end: " + v) } get webkitMarginEnd() { return this.get("webkit-margin-end") }; set webkitMarginStart(v: string) { this.set("webkit-margin-start: " + v) } get webkitMarginStart() { return this.get("webkit-margin-start") }; set webkitMask(v: string) { this.set("webkit-mask: " + v) } get webkitMask() { return this.get("webkit-mask") }; set webkitMaskBoxImage(v: string) { this.set("webkit-mask-box-image: " + v) } get webkitMaskBoxImage() { return this.get("webkit-mask-box-image") }; set webkitMaskBoxImageOutset(v: string) { this.set("webkit-mask-box-image-outset: " + v) } get webkitMaskBoxImageOutset() { return this.get("webkit-mask-box-image-outset") }; set webkitMaskBoxImageRepeat(v: string) { this.set("webkit-mask-box-image-repeat: " + v) } get webkitMaskBoxImageRepeat() { return this.get("webkit-mask-box-image-repeat") }; set webkitMaskBoxImageSlice(v: string) { this.set("webkit-mask-box-image-slice: " + v) } get webkitMaskBoxImageSlice() { return this.get("webkit-mask-box-image-slice") }; set webkitMaskBoxImageSource(v: string) { this.set("webkit-mask-box-image-source: " + v) } get webkitMaskBoxImageSource() { return this.get("webkit-mask-box-image-source") }; set webkitMaskBoxImageWidth(v: string) { this.set("webkit-mask-box-image-width: " + v) } get webkitMaskBoxImageWidth() { return this.get("webkit-mask-box-image-width") }; set webkitMaskClip(v: string) { this.set("webkit-mask-clip: " + v) } get webkitMaskClip() { return this.get("webkit-mask-clip") }; set webkitMaskComposite(v: string) { this.set("webkit-mask-composite: " + v) } get webkitMaskComposite() { return this.get("webkit-mask-composite") }; set webkitMaskImage(v: string) { this.set("webkit-mask-image: " + v) } get webkitMaskImage() { return this.get("webkit-mask-image") }; set webkitMaskOrigin(v: string) { this.set("webkit-mask-origin: " + v) } get webkitMaskOrigin() { return this.get("webkit-mask-origin") }; set webkitMaskPosition(v: string) { this.set("webkit-mask-position: " + v) } get webkitMaskPosition() { return this.get("webkit-mask-position") }; set webkitMaskPositionX(v: string) { this.set("webkit-mask-position-x: " + v) } get webkitMaskPositionX() { return this.get("webkit-mask-position-x") }; set webkitMaskPositionY(v: string) { this.set("webkit-mask-position-y: " + v) } get webkitMaskPositionY() { return this.get("webkit-mask-position-y") }; set webkitMaskRepeat(v: string) { this.set("webkit-mask-repeat: " + v) } get webkitMaskRepeat() { return this.get("webkit-mask-repeat") }; set webkitMaskRepeatX(v: string) { this.set("webkit-mask-repeat-x: " + v) } get webkitMaskRepeatX() { return this.get("webkit-mask-repeat-x") }; set webkitMaskRepeatY(v: string) { this.set("webkit-mask-repeat-y: " + v) } get webkitMaskRepeatY() { return this.get("webkit-mask-repeat-y") }; set webkitMaskSize(v: string) { this.set("webkit-mask-size: " + v) } get webkitMaskSize() { return this.get("webkit-mask-size") }; set webkitMaxLogicalHeight(v: string) { this.set("webkit-max-logical-height: " + v) } get webkitMaxLogicalHeight() { return this.get("webkit-max-logical-height") }; set webkitMaxLogicalWidth(v: string) { this.set("webkit-max-logical-width: " + v) } get webkitMaxLogicalWidth() { return this.get("webkit-max-logical-width") }; set webkitMinLogicalHeight(v: string) { this.set("webkit-min-logical-height: " + v) } get webkitMinLogicalHeight() { return this.get("webkit-min-logical-height") }; set webkitMinLogicalWidth(v: string) { this.set("webkit-min-logical-width: " + v) } get webkitMinLogicalWidth() { return this.get("webkit-min-logical-width") }; set webkitOpacity(v: string) { this.set("webkit-opacity: " + v) } get webkitOpacity() { return this.get("webkit-opacity") }; set webkitOrder(v: string) { this.set("webkit-order: " + v) } get webkitOrder() { return this.get("webkit-order") }; set webkitPaddingAfter(v: string) { this.set("webkit-padding-after: " + v) } get webkitPaddingAfter() { return this.get("webkit-padding-after") }; set webkitPaddingBefore(v: string) { this.set("webkit-padding-before: " + v) } get webkitPaddingBefore() { return this.get("webkit-padding-before") }; set webkitPaddingEnd(v: string) { this.set("webkit-padding-end: " + v) } get webkitPaddingEnd() { return this.get("webkit-padding-end") }; set webkitPaddingStart(v: string) { this.set("webkit-padding-start: " + v) } get webkitPaddingStart() { return this.get("webkit-padding-start") }; set webkitPerspective(v: string) { this.set("webkit-perspective: " + v) } get webkitPerspective() { return this.get("webkit-perspective") }; set webkitPerspectiveOrigin(v: string) { this.set("webkit-perspective-origin: " + v) } get webkitPerspectiveOrigin() { return this.get("webkit-perspective-origin") }; set webkitPerspectiveOriginX(v: string) { this.set("webkit-perspective-origin-x: " + v) } get webkitPerspectiveOriginX() { return this.get("webkit-perspective-origin-x") }; set webkitPerspectiveOriginY(v: string) { this.set("webkit-perspective-origin-y: " + v) } get webkitPerspectiveOriginY() { return this.get("webkit-perspective-origin-y") }; set webkitPrintColorAdjust(v: string) { this.set("webkit-print-color-adjust: " + v) } get webkitPrintColorAdjust() { return this.get("webkit-print-color-adjust") }; set webkitRtlOrdering(v: string) { this.set("webkit-rtl-ordering: " + v) } get webkitRtlOrdering() { return this.get("webkit-rtl-ordering") }; set webkitRubyPosition(v: string) { this.set("webkit-ruby-position: " + v) } get webkitRubyPosition() { return this.get("webkit-ruby-position") }; set webkitShapeImageThreshold(v: string) { this.set("webkit-shape-image-threshold: " + v) } get webkitShapeImageThreshold() { return this.get("webkit-shape-image-threshold") }; set webkitShapeMargin(v: string) { this.set("webkit-shape-margin: " + v) } get webkitShapeMargin() { return this.get("webkit-shape-margin") }; set webkitShapeOutside(v: string) { this.set("webkit-shape-outside: " + v) } get webkitShapeOutside() { return this.get("webkit-shape-outside") }; set webkitTapHighlightColor(v: string) { this.set("webkit-tap-highlight-color: " + v) } get webkitTapHighlightColor() { return this.get("webkit-tap-highlight-color") }; set webkitTextCombine(v: string) { this.set("webkit-text-combine: " + v) } get webkitTextCombine() { return this.get("webkit-text-combine") }; set webkitTextDecorationsInEffect(v: string) { this.set("webkit-text-decorations-in-effect: " + v) } get webkitTextDecorationsInEffect() { return this.get("webkit-text-decorations-in-effect") }; set webkitTextEmphasis(v: string) { this.set("webkit-text-emphasis: " + v) } get webkitTextEmphasis() { return this.get("webkit-text-emphasis") }; set webkitTextEmphasisColor(v: string) { this.set("webkit-text-emphasis-color: " + v) } get webkitTextEmphasisColor() { return this.get("webkit-text-emphasis-color") }; set webkitTextEmphasisPosition(v: string) { this.set("webkit-text-emphasis-position: " + v) } get webkitTextEmphasisPosition() { return this.get("webkit-text-emphasis-position") }; set webkitTextEmphasisStyle(v: string) { this.set("webkit-text-emphasis-style: " + v) } get webkitTextEmphasisStyle() { return this.get("webkit-text-emphasis-style") }; set webkitTextFillColor(v: string) { this.set("webkit-text-fill-color: " + v) } get webkitTextFillColor() { return this.get("webkit-text-fill-color") }; set webkitTextOrientation(v: string) { this.set("webkit-text-orientation: " + v) } get webkitTextOrientation() { return this.get("webkit-text-orientation") }; set webkitTextSecurity(v: string) { this.set("webkit-text-security: " + v) } get webkitTextSecurity() { return this.get("webkit-text-security") }; set webkitTextSizeAdjust(v: string) { this.set("webkit-text-size-adjust: " + v) } get webkitTextSizeAdjust() { return this.get("webkit-text-size-adjust") }; set webkitTextStroke(v: string) { this.set("webkit-text-stroke: " + v) } get webkitTextStroke() { return this.get("webkit-text-stroke") }; set webkitTextStrokeColor(v: string) { this.set("webkit-text-stroke-color: " + v) } get webkitTextStrokeColor() { return this.get("webkit-text-stroke-color") }; set webkitTextStrokeWidth(v: string) { this.set("webkit-text-stroke-width: " + v) } get webkitTextStrokeWidth() { return this.get("webkit-text-stroke-width") }; set webkitTransform(v: string) { this.set("webkit-transform: " + v) } get webkitTransform() { return this.get("webkit-transform") }; set webkitTransformOrigin(v: string) { this.set("webkit-transform-origin: " + v) } get webkitTransformOrigin() { return this.get("webkit-transform-origin") }; set webkitTransformOriginX(v: string) { this.set("webkit-transform-origin-x: " + v) } get webkitTransformOriginX() { return this.get("webkit-transform-origin-x") }; set webkitTransformOriginY(v: string) { this.set("webkit-transform-origin-y: " + v) } get webkitTransformOriginY() { return this.get("webkit-transform-origin-y") }; set webkitTransformOriginZ(v: string) { this.set("webkit-transform-origin-z: " + v) } get webkitTransformOriginZ() { return this.get("webkit-transform-origin-z") }; set webkitTransformStyle(v: string) { this.set("webkit-transform-style: " + v) } get webkitTransformStyle() { return this.get("webkit-transform-style") }; set webkitTransition(v: string) { this.set("webkit-transition: " + v) } get webkitTransition() { return this.get("webkit-transition") }; set webkitTransitionDelay(v: string) { this.set("webkit-transition-delay: " + v) } get webkitTransitionDelay() { return this.get("webkit-transition-delay") }; set webkitTransitionDuration(v: string) { this.set("webkit-transition-duration: " + v) } get webkitTransitionDuration() { return this.get("webkit-transition-duration") }; set webkitTransitionProperty(v: string) { this.set("webkit-transition-property: " + v) } get webkitTransitionProperty() { return this.get("webkit-transition-property") }; set webkitTransitionTimingFunction(v: string) { this.set("webkit-transition-timing-function: " + v) } get webkitTransitionTimingFunction() { return this.get("webkit-transition-timing-function") }; set webkitUserDrag(v: string) { this.set("webkit-user-drag: " + v) } get webkitUserDrag() { return this.get("webkit-user-drag") }; set webkitUserModify(v: string) { this.set("webkit-user-modify: " + v) } get webkitUserModify() { return this.get("webkit-user-modify") }; set webkitUserSelect(v: string) { this.set("webkit-user-select: " + v) } get webkitUserSelect() { return this.get("webkit-user-select") }; set webkitWritingMode(v: string) { this.set("webkit-writing-mode: " + v) } get webkitWritingMode() { return this.get("webkit-writing-mode") }; set whiteSpace(v: string) { this.set("white-space: " + v) } get whiteSpace() { return this.get("white-space") }; set widows(v: string) { this.set("widows: " + v) } get widows() { return this.get("widows") }; set width(v: string) { this.set("width: " + v) } get width() { return this.get("width") }; set willChange(v: string) { this.set("will-change: " + v) } get willChange() { return this.get("will-change") }; set wordBreak(v: string) { this.set("word-break: " + v) } get wordBreak() { return this.get("word-break") }; set wordSpacing(v: string) { this.set("word-spacing: " + v) } get wordSpacing() { return this.get("word-spacing") }; set wordWrap(v: string) { this.set("word-wrap: " + v) } get wordWrap() { return this.get("word-wrap") }; set writingMode(v: string) { this.set("writing-mode: " + v) } get writingMode() { return this.get("writing-mode") }; set x(v: string) { this.set("x: " + v) } get x() { return this.get("x") }; set y(v: string) { this.set("y: " + v) } get y() { return this.get("y") }; set zIndex(v: string) { this.set("z-index: " + v) } get zIndex() { return this.get("z-index") }; set zoom(v: string) { this.set("zoom: " + v) } get zoom() { return this.get("zoom") }
		private get(prop: string) {
			return this.computedStyleObj[prop]
		}
		private set(style: string) {
			this.element.setStyle(style);
		}

		private _computedStyleObj: { [s: string]: string } = {};
		private lastStyle = "";
		private get computedStyleObj() {
			if (this.element.style !== this.lastStyle) {
				this._computedStyleObj = {}
				this.element.style.split(/;\s*/g).forEach(s => {
					const p = s.match(/([a-z]+(?:\-[a-z]+)*):\s*(.+)/)!
					this._computedStyleObj[p[1]] = p[2]
				})
			}
			return this._computedStyleObj;
		}
		private element: Element;
		constructor(element: Element) {
			this.element = element;
		}
	}

	export type getProps<el extends Element, u extends keyof el> = Partial<{ [Prop in u]: el[Prop] }>


	// #Element
	export abstract class Element {

		/** ID of element, if not set, will be Nomx_Gen_NUMBER */
		id: string;


		props: getProps<Element, "elementInit" | "id" | "style" | "backgroundColor" | "innerHTML" | "scrollTop" | "borderWidth" | "borderColor" | "display" | "padding" | "margin"> = {}

		private _lastouterHTML: string = "";
		private _outerHTMLTree?: Node;

		get outerHTMLTree() {
			if (this._lastouterHTML === this.outerHTML) {
				return this._outerHTMLTree!;
			} else {
				this._lastouterHTML = this.outerHTML;
				this._outerHTMLTree = parser.tree(this.outerHTML)[0] as Node
				return this._outerHTMLTree
			}
		}

		/**
		 * Returns children count
		 * Use this over Element.children.length!! children.length re-parses the html which is heavy on the client!
		 */
		get childElementCount(): number {
			return parseInt(this.getAttribute("childElementCount"))
		}

		get className(): string {
			return this.getAttribute("className")
		}

		/** array of elements. can include a Node if the child's id is not provided. Use .children instead to filter out id-less nodes */
		get childrenRaw(): ReadonlyArray<Nomx.DestructibleElement | Node> {
			return this.outerHTMLTree.children.map(e => e.attributes.id ? get(e.attributes.id, "container") : e) as ReadonlyArray<Nomx.DestructibleElement | Node>
		}

		/** array of elements, id-less nodes are ignored. */
		get children(): ReadonlyArray<Nomx.DestructibleElement> {
			return this.childrenRaw.filter(e => "id" in e) as ReadonlyArray<Nomx.DestructibleElement>;
		}

		on<t extends "click" | "mousemove" | "mousedown" | "mouseup" | "mouseover" | "mouseout">(type: t, callback: (event: {
			offsetX: number
			offsetY: number
			movementX: number
			pageX: number
			movementY: number
			pageY: number
			clientX: number
			clientY: number
			button: number
			x: number
			y: number
			type: t
			toElementId: string
		} & BaseEventProps & KeyEventProps) => void): void

		on<t extends "keyup" | "keydown" | "keypress", id extends string>(type: t, callback: (event: {
			type: t
		} & BaseEventProps & KeyActionEventProps) => void): void

		on<t extends "input">(type: t, callback: (event: {
			type: t
		} & BaseEventProps & SelectionProps) => void): void

		on<t extends "change", id extends string>(type: t, callback: (event: {
			type: t
		} & BaseEventProps & KeyActionEventProps & SelectionProps) => void): void

		/**
		 * Adds event listener; Equivalent to onEvent(element.id, eventName, callback);
		 */
		on(t: string, callback: (event: any) => void) {
			onEvent(this.id, t as "change", callback)
		}

		/** setStyle; equivalent to setStyle(element.id, style) */
		setStyle(style: string) {
			setStyle(this.id, style);
		}

		/** background color */
		set backgroundColor(color: string) {
			setProperty(this.id, "background-color", color)
		}

		get backgroundColor(): string {
			return getProperty(this.id, "background-color")
		}

		/** element tag name; ex: DIV | BUTTON | IMG */
		get tagName() {
			return this.getAttribute("tagName")
		}

		/**
		 * Resetting the style will not overwrite all styles, you must know which are currently active and do "style: unset;" in order to reset
		 */
		set style(style: string) {
			this.setStyle(style);
		}
		get style() {
			return this.outerHTMLTree.attributes.style || ""
		}


		/*
		private _styleDeclaration?: StyleDeclaration;

		get styleDeclaration() {
			if (!this._styleDeclaration) {
				this._styleDeclaration = new StyleDeclaration(this);
			}
			return this._styleDeclaration;
		}
		*/
		/** An object similar to a CSSStyleDeclaration, which allows you to set styles by doing styleDeclaration.prop = value
		 * NOTE: It is not exactly like a CSSStyleDeclaration, for example styleDeclaration.marginTop will fail.
		*/
		//@ts-ignore
		styleDeclaration: StyleDeclaration

		/** includes the element itself ex: <div id="ELEMENTID"><div id = "CHILD">HI</div></div> */
		get outerHTML() {
			return this.getAttribute("outerHTML");
		}

		/** includes only the children of the element ex: <div id = "CHILD">HI</div> */
		get innerHTML() {
			return this.getAttribute("innerHTML")
		}

		set innerHTML(innerhtml: string) {
			innerHTML(this.id, innerhtml);
		}

		/** Height of element, includes parts that are hidden beyond the scroll bar */
		get scrollHeight() {
			return getAttribute(this.id, "scrollHeight")
		}

		/** Location of scroll bar */
		get scrollTop(): number {
			return parseInt(getAttribute(this.id, "scrollTop"));
		}

		set scrollTop(y: number) {
			setAttribute(this.id, "scrollTop", y);
		}

		/** CSS border width */
		get borderWidth() {
			return getProperty(this.id, "border-width")
		}
		set borderWidth(value: number) {
			setProperty(this.id, "border-width", value)
		}

		/** CSS border radius */
		get borderRadius() {
			return getProperty(this.id, "border-radius")
		}
		set borderRadius(value: number) {
			setProperty(this.id, "border-radius", value)
		}

		/** CSS border color */
		get borderColor() {
			return getProperty(this.id, "border-color")
		}

		set borderColor(value: number) {
			setProperty(this.id, "border-color", value)
		}

		/** CSS display; to get the current value do element.styleDeclaration.display */
		set display(display: "inline" | "block" | "contents" | "flex" | "grid" | "inline-block" | "inline-flex" | "inline-grid" | "inline-table" | "list-item" | "run-in" | "table" | "table-caption" | "table-column-group" | "table-header-group" | "table-footer-group" | "table-row-group" | "table-cell" | "table-column" | "table-row" | "none" | "initial" | "inherit") {
			this.setStyle(`display: ${display}`)
		}

		/** CSS padding; element.styleDeclaration.padding */
		set padding(value: number | string) {
			this.setStyle(`padding: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/** CSS margin; element.styleDeclaration.margin */
		set margin(value: number | string) {
			this.setStyle(`margin: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/**
		 * Returns toString()'d representation of the attribute value.
		 */
		getAttribute(attribute: string): string {
			return getAttribute(this.id, attribute)
		}

		setAttribute(attribute: Parameters<typeof setAttribute>[1], value: unknown) {
			return setAttribute(this.id, attribute, value)
		}

		//first child, id-less ignored
		get firstChild(): void | DestructibleElement {
			if (this.children[0]) {
				return this.children[0]
			}
		}

		/** Parents the children to the element */
		addChildren(...children: DestructibleElement[]): void;
		addChildren(children: DestructibleElement[]): void;
		addChildren(...children: DestructibleElement[] | DestructibleElement[][]) {
			if (Array.isArray(children[0])) {
				children = children[0];
			}
			for (const child of children as DestructibleElement[]) {
				child.parent = this;
			}
		}

		set elementInit(callback: (a: unknown) => void) {
			callback(this);
		}

		/** To be called after all props are set  */
		afterPropsSet(): void {

		}

		/** Given a transformer function, sort an array of elements which will become it's new children. */

		// Too hard to implement		
		// reorder(callback: (elements: (DestructibleElement)[]) => {}) {

		// }

		constructor(isNew: boolean, id: string) {
			this.id = id;
			//wtf
			Object.defineProperty(this, "styleDeclaration", {
				value: new StyleDeclaration(this),
				enumerable: false
			})
		}

	}

	// #Element
	export abstract class DestructibleElement extends Element {
		props: getProps<DestructibleElement, "width" | "height" | "position" | "left" | "right" | "top" | "bottom" | "x" | "y" | "parent"> & Element["props"] = {};

		private _parent?: Element;

		get parent() {
			return this._parent;
		}

		get width() {
			return getProperty(this.id, "width")
		}
		set width(value: number) {
			setProperty(this.id, "width", value)
		}

		get height() {
			return getProperty(this.id, "height")
		}
		set height(value: number) {
			setProperty(this.id, "height", value)
		}

		set position(position: "static" | "relative" | "fixed" | "absolute" | "sticky") {
			this.setStyle(`position: ${position}`)
		}

		/** distance from the left side of the parent element */
		set left(value: number | string) {
			this.setStyle(`left: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/** distance from the right side of the parent element */
		set right(value: number | string) {
			this.setStyle(`right: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/** distance from the top side of the parent element */
		set top(value: number | string) {
			this.setStyle(`top: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/** distance from the bottom side of the parent element */
		set bottom(value: number | string) {
			this.setStyle(`bottom: ${typeof value === "number" ? `${value}px` : value}`)
		}

		/** (mostly) equivalent to .left, except called via setProperty */
		get x() {
			return getProperty(this.id, "x")
		}
		set x(value: number) {
			setProperty(this.id, "x", value)
		}

		/** (mostly) equivalent to .top, except called via setProperty */
		get y() {
			return getProperty(this.id, "y")
		}
		set y(value: number) {
			setProperty(this.id, "y", value)
		}

		set parent(parent: Element | undefined) {
			if (!parent) { parent = limbo };
			setParent(this.id, parent.id)
			this._parent = parent
		}


		delete() {
			deleteElement(this.id)
		}
	}

	export abstract class TextElement extends DestructibleElement {
		props: getProps<TextElement, "textColor" | "text" | "fontSize"> & DestructibleElement["props"] = {};
		set textColor(color: string) {
			setProperty(this.id, "text-color", color)
		}

		get textColor(): string {
			return getProperty(this.id, "text-color");
		}

		/**
		 * Text of element (escapes html, use innerHTML instead)
		 */
		set text(text: string) {
			setProperty(this.id, "text", text)
		}
		get text() {
			return getProperty(this.id, "text")
		}

		/** font size in pixels */
		set fontSize(size: number) {
			setProperty(this.id, "font-size", size)
		}
		get fontSize(): number {
			return getProperty(this.id, "font-size")
		}

		// ill add types i need as they come
		set overflow(overflow: "scroll" | "auto" | "unset" | "hidden") {
			this.setStyle(`overflow: ${overflow}`)
		}
	}

	export class Label extends TextElement {
		constructor(isNew: boolean, id: string) {
			super(isNew, id);
			if (isNew) {
				textLabel(id, "")
			}
		}
	}

	export class Button extends TextElement {
		props: getProps<Button, "onClick" | "pure"> & TextElement["props"] = {};
		onClick = (event: BaseEventProps) => { };

		set pure(v: true) {
			this.setStyle("border: 0px; background-image: none; margin: 0px; border-radius: 0px")
		}

		constructor(isNew: boolean, id: string) {
			super(isNew, id);
			if (isNew) {
				button(id, "")
			}
			this.on("click", (event) => {
				this.onClick(event);
			})
		}
	}

	export class RippleButton extends Button {
		props: getProps<RippleButton, "color" | "shadow"> & Button["props"] = {};
		ripples: Container[] = []
		color = "#FFF"
		shadow = false;
		textElement = Nomx.create("container", { parent: this });

		/**
		 * Proxied text; html is escaped; use rippleButton.textElement.innerHTML if you are trying to set html
		 */
		set text(value: string) {
			this.textElement.text = value;
		}
		get text() {
			return this.textElement.text;
		}

		constructor(isNew: boolean, id: string) {
			super(isNew, id)
			this.setStyle("transition: box-shadow .3s; overflow: hidden");
			this.on("mouseout", () => {
				if (this.shadow) {
					this.setStyle("box-shadow: none");
				}
				var ripples = this.ripples;
				setTimeout(() => {
					ripples.forEach((ripple) => {
						ripple.setStyle("opacity: 0");
						setTimeout(function () {
							ripple.delete();
						}, 1000);
					});
				}, 50);
				this.ripples = [];
			});
			this.on("mouseup", () => {
				if (this.shadow) {
					this.setStyle("box-shadow: none");
				}
				var ripples = this.ripples;
				setTimeout(() => {
					ripples.forEach((ripple) => {
						ripple.setStyle("opacity: 0");
						setTimeout(function () {
							ripple.delete();
						}, 1000);
					});
				}, 50);
				this.ripples = [];
			});
			this.on("mousedown", (event) => {
				if (this.shadow) {
					this.setStyle("box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px");
				}
				var ripple = Nomx.create("container", { parent: this })
				ripple.setStyle("pointer-events: none;opacity: 80%;transition: opacity 1s, width 1.5s, height 1.5s;transform: translate(-50%, -50%);width: 1px; height:1px; border-radius: 1000px;position: absolute");
				this.ripples.push(ripple);
				ripple.x = event.offsetX;
				ripple.y = event.offsetY;
				setTimeout(function () { ripple.setStyle("opacity: 40%;width: 800px; height:800px") }, 50);
				ripple.backgroundColor = this.color;
			});

		}
	}

	/** Textbox */
	export class Input extends TextElement {
		props: getProps<Input, "onSubmit"> & TextElement["props"] = {};
		onSubmit = (event: BaseEventProps) => { }
		constructor(isNew: boolean, id: string) {
			super(isNew, id)
			if (isNew) {
				textInput(id, "");
			}
			this.on("keypress", (event) => {
				if (event.keyCode === 13) {
					this.onSubmit(event)
				}
			})
		}
	}

	/** Container. aka <div>
	 * Css may be different. For example there is line-height set to 18px
	 */
	export class Container extends TextElement {
		props: getProps<Container, "type"> & TextElement["props"] = {};
		/** Determines subset type of container */
		set type(value: "fill") {
			switch (value) {
				case "fill":
					this.setStyle("width: 100%; height: 100%; position: absolute"); break;

			}
		}

		constructor(isNew: boolean, id: string) {
			super(isNew, id)
			if (isNew) {
				container(id, "");
			}
		}
	}

	/** Represents a screen */
	export class Screen extends TextElement {
		get isActiveScreen(): boolean {
			return this.style.match("display: none") !== null;
		}
		set() {
			setScreen(this.id);
		}
		constructor(isNew: boolean, id: string, children?: DestructibleElement[]) {
			super(isNew, id)
			if (isNew) {
				root.innerHTML += `<div class="screen" tabindex="1" data-theme="default" id="${id}" style="display: none; height: 450px; width: 320px; left: 0px; top: 0px; position: absolute; z-index: 0; background-color: rgb(255, 255, 255);"></div>`
			}
		}
	}

	/** For when you want to pass a string as an Element */
	export class Span extends Container {
		constructor(isNew: boolean, id: string) {
			super(isNew, id)
			this.style = "display: inline; padding: 0px"
		}
	}

	/** Represents a line break */
	export class Break extends Container {
		/** This will error */
		addChildren() {
			throw "Line breaks can't have children, silly."
		}
		constructor(isNew: boolean, id: string) {
			super(isNew, id);
			this.style = "margin-bottom: 10px"
		}
	}

	/** singleton class that represents divApplab */
	export class Root extends Element {
		id: "divApplab" = "divApplab"

		/** Every element (that has an id) in the app (Computationally expensive, best you use caches) */
		get nodes(): ReturnType<typeof parser.nodes> {
			return parser.nodes(this.innerHTML);
		}

		/** Returns every screen. (Computationally expensive, best you use caches) */
		get screens(): Screen[] {
			return this.children.filter(c => {
				return c.className === "screen"
			}) as Screen[];
		}

		/** Returns current screen. (Computationally expensive, best you use caches) */
		get activeScreen(): Screen {
			return this.children.filter(c => {
				return c.className === "screen" && c.style.match("display: none");
			})[0] as Screen;
		}
	}


	export interface creatableTypes {
		button: typeof Button,
		input: typeof Input,
		screen: typeof Screen,
		container: typeof Container,
		div: typeof Container,
		span: typeof Span,
		label: typeof Label,
		br: typeof Break,
		ripplebutton: typeof RippleButton,
	}


	export interface allTypes extends creatableTypes {
		// element: typeof Element;
		root: typeof Root;
	}

	const allIndex = {
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
		ripplebutton: RippleButton,
	}

	function _instanceof(a: unknown, b: abstract new (...args: any[]) => any) {
		//a instanceof b results in {data: false, type: "boolean"} when it's false, and true when it's true; really stupid and annoying
		return a instanceof b === true
	}


	/**
	 * Should only be used when you aren't using cdo-sync's class extension
	 */
	export function extendClass(C: typeof Element, constructor: (isNew: boolean, id: string, children?: DestructibleElement) => {}, props: { [s: string]: { get: () => unknown, set: (u: unknown) => void } }, methods: { [s: string]: (...args: unknown[]) => unknown }) {
		class Extension extends C {
			constructor(isNew: boolean, id: string, children?: DestructibleElement) {
				super(isNew, id);
				constructor.call(this, isNew, id, children);
			}
		};
		Object.defineProperties(Extension, props)
		const proto = Extension.prototype as typeof Extension.prototype & { [s: string]: unknown };
		for (const method in methods) {
			proto[method] = methods[method];
		}
	}

	type CreateChildren = string | DestructibleElement | CreateChildren[]
	/**
	 * Creates a new element given type
	 * @param ElementType Type of element. Can be a string or a class.
	 * @param props Object with properties such as `text`
	 * @param children List of children auto-parented using the .children() method
	 */
	export function create<e extends keyof creatableTypes>(ElementType: e, props?: InstanceType<creatableTypes[e]>["props"], ...children: CreateChildren[]): InstanceType<creatableTypes[e]>
	export function create<e extends creatableTypes[keyof creatableTypes]>(ElementType: e, props?: InstanceType<e>["props"], ...children: CreateChildren[]): InstanceType<e>
	//	export function create<e extends keyof creatableTypes>(ElementType: e, props?: convertClassToProps<creatableTypes[e]>, children?: CreateChildren[]): InstanceType<creatableTypes[e]>
	//	export function create<e extends creatableTypes[keyof creatableTypes]>(ElementType: e, props?: convertClassToProps<e>, children?: CreateChildren[]): InstanceType<e>	

	export function create(ElementType: keyof creatableTypes | creatableTypes[keyof creatableTypes], props?: { [s: string]: unknown } & { id?: string }, ...children: CreateChildren[]) {
		let elementId: string | undefined;
		if (props == undefined) {
			props = {}
		} else if (props.id) {
			elementId = props.id;
			delete props.id;
		}

		if (!elementId) {
			elementId = prefix + (++counter).toString();
		}

		const computedChildren: DestructibleElement[] = [];
		if (children.length === 1 && typeof children[0] === "string") {
			props.text = children[0]
		} else {
			function spread(arr: CreateChildren[]) {
				for (const val of arr) {
					if (Array.isArray(val)) {
						spread(val)
					} else if (_instanceof(val, DestructibleElement)) {
						computedChildren.push(val as DestructibleElement)
					} else {
						computedChildren.push(Nomx.create("span", {
							text: String(val)
						}))
					}

				}
			}
			spread(children);
		}

		let element: any;
		//children: [DestructibleElement | string]
		if (typeof ElementType === "string") {
			element = new allIndex[ElementType](true, elementId)
		} else {
			element = new ElementType(true, elementId)
		}
		ElementsById[element.id] = element;
		(element as Element).addChildren(computedChildren);
		Object.keys(props).map(key => {
			(element as any)[key] = props![key];
		})
		element.afterPropsSet();
		return element;
	}

	/**
	 * @deprecated The use of Nomx.get is bad practice as all pre-existing elements are already defined ("$$elementId") and usage with default applab functions is not advised.
	*/
	export function get<e extends keyof allTypes>(id: string, ElementType?: e): InstanceType<allTypes[e]>

	/**
	 * @deprecated The use of Nomx.get is bad practice as all pre-existing elements are already defined ("$$elementId") and usage with default applab functions is not advised.
	*/
	export function get<e extends allTypes[keyof allTypes]>(id: string, ElementType?: e): InstanceType<e>

	export function get(id: string, ElementType: keyof allTypes | allTypes[keyof allTypes] = Container) {
		if (ElementsById[id]) {
			return ElementsById[id];
		} else if (typeof ElementType === "string") {
			return new allIndex[ElementType](false, id, [])
		} else {
			return new ElementType(false, id, [])
		}
	}

	/** Represents divApplab; of which all elements **must** be parented to. */
	export const root = Nomx.get("divApplab", Root)

	let uninitiatedIds: RegExpMatchArray[] = [];
	root.nodes.forEach(el => {
		if (el.attributes.id !== "designModeViz") {
			let elType: string;

			if (el.attributes.class === "screen") {
				elType = "screen";
			} else if (el.tagName === "button") {
				elType = "button";
			} else if (el.tagName === "input") {
				elType = "input";
			} else if (el.tagName === "div") {
				elType = "container";
			} else if (el.tagName === "span") {
				elType = "span";
			} else if (el.tagName === "label") {
				elType = "label";
			} else {
				elType = "container";
			}

			const dt = el.attributes.id!.match(/^([a-zA-Z0-9\_\-]+)(?:\#([a-zA-Z0-9_\$]+))?$/);
			if (dt) {
				if (dt[2]) {
					elType = dt[2];
				}
				if (elType in allIndex) {
					window[`$$${dt[1]}`] = Nomx.get(dt[0], elType as keyof allTypes)
				} else {
					uninitiatedIds.push(dt)
				}
			}
		}
	})

	if (uninitiatedIds.length > 0) {
		console.log("Custom classes detected!; Make sure to call Nomx.initiateWithClasses() after class declarations.")
	}

	/**
	 * Call after you have declared your classes in global scope!
	 */
	export function initiateWithClasses() {
		uninitiatedIds.forEach(([id, rid, c]) => {
			window[`$$${rid}`] = Nomx.get(id, window[c]);
		})
	}

	/** URL of the current app */
	export const baseURI = root.getAttribute("baseURI");

	/** Channel id of the current app */
	export const channelId = baseURI.match(/code.org\/projects\/applab\/([^\/]+)/)![1];


	/** A container that elements created using innerHTML are created, in order to prevent overwriting any existing elements */
	const forge = create("container");
	forge.display = "none";
	forge.parent = root;

	/** A container elements go to when they are hidden but not necessarily destroyed */
	const limbo = create("container");
	limbo.display = "none";
	limbo.parent = root;


}

namespace JSX {
	export type Element = Nomx.DestructibleElement

	export interface ElementClass {
		id: string
	}

	export interface ElementAttributesProperty {
		props: {}
	}

	export interface IntrinsicElements {
		button: Nomx.Button["props"]
		span: Nomx.Span["props"]
		input: Nomx.Input["props"]
		div: Nomx.Container["props"]
		label: Nomx.Label["props"]
		br: Nomx.Break["props"]
		screen: Nomx.Screen["props"]
		ripplebutton: Nomx.RippleButton["props"]
	}
}