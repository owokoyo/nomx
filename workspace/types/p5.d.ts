type SpriteOrGroup = Sprite | Group;
type p5KeyType = "left" | "right" | "up" | "down" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "ctrl" | "space" | "shift"
type p5MouseType = "leftButton" | "rightButton"

type p5ColorMode = "rgb"
type p5Image = "abc";
type p5AlignmentX = "center" | "left" | "right"
type p5AlignmentY = "baseline" | "top" | "bottom"
type p5Font = "Arial" | "Courier New" | string //ee
type p5ColorChoice = p5Color | string | number

type pInst = {
	readonly _setupDone: boolean
	readonly _pixelDensity: number
	//readonly _userNode: HTMLDivElement
	//readonly _curElement: e
	//readonly _elements: e[]
	readonly _requestAnimId: number
	readonly _preloadCount: number
	readonly _isGlobal: boolean;
	readonly _loop: boolean;
	readonly _styles: [];
	readonly _defaultCanvasSize: {
		readonly width: number,
		readonly height: number
	}
	readonly _events: {
		mousemove: () => void,
		mousedown: () => void,
		mouseup: () => void,
		dragend: () => void
		//...
	}
	readonly _loadingScreenId: "p5_loading"
	//...
	//canvas: HTMLCanvasElement
	readonly width: number
	readonly height: number
	readonly drawContext: CanvasRenderingContext2D
	//_renderer:
	readonly _isdefaultGraphics: boolean
	/**
	 * @deprecated
	 */
	loadJSON: () => void;
}

declare class Sprite {
	x: number
	y: number
	scale: number
	rotation: number
	shapeColor: p5ColorChoice
	tint: p5ColorChoice
	depth: number
	visible: boolean
	velocityY: number
	velocityX: number

	isTouching(target: SpriteOrGroup): boolean;
	bounce(target: SpriteOrGroup): void
	bounceOff(target: SpriteOrGroup): void
	collide(target: SpriteOrGroup): void
	displace(target: SpriteOrGroup): void
	overlap(target: SpriteOrGroup): boolean

	setAnimation(label: string): void
	setSpeedAndDirection(speed: number, direction: number): void
	setCollider(collider: "rectangle" | "circle" | "point"): void
	setCollider(collider: "rectangle", offsetX: number, offsetY: number, width: number, height: number, rotationOffset: number): void
	setCollider(collider: "circle", offsetX: number, offsetY: number, radius: number): void
	setCollider(collider: "point", offsetX: number, offsetY: number): void
	overlap(target: SpriteOrGroup): boolean
}

declare class Group extends Array<Sprite> {
	add(sprite: Sprite): void
	remove(sprite: Sprite): void
	clear(): void
	contains(sprite: Sprite): boolean
	get(i: number): Sprite

	isTouching(target: SpriteOrGroup): boolean
	bounce(target: SpriteOrGroup): void
	bounceOff(target: SpriteOrGroup): void
	collide(target: SpriteOrGroup): void
	displace(target: SpriteOrGroup): void
	overlap(target: SpriteOrGroup): boolean

	/** Returns the highest depth in a group. */
	maxDepth(): number

	/** Returns the lowest depth in a group. */
	minDepth(): number

	/** Removes all the sprites in a group from the animation. */
	destroyEach(): void

	/** Rotate every sprite ionthe group to face the (x,y) coordinate. */
	pointToEach(x: number, y: number): void

	/** Sets the image or animation for every sprite in the group. */
	setAnimationEach(label: string): void

	setRotationEach(rotation: number): void
}

declare class p5Color {
	toString(): string
	_getRed(): number
	_getGreen(): number
	_getBlue(): number
	_getAlpha(): number
	_getBrightness(): number
	_getHue(): number
	_getLightness(): number
	_getSaturation(): number
	levels: [number, number, number, number]
	maxes: {
		hsb: [number, number, number, number]
		hsl: [number, number, number, number]
		rgb: [number, number, number, number]
	}
	mode: p5ColorMode
	_array: [number, number, number, number]
}

declare namespace World {
	let pInst: pInst

	let allSprites: Group
	let frameRate: number
	const frameCount: number
	const mouseX: number
	const mouseY: number
}

declare namespace camera {
	let x: number
	let y: number
	let zoom: number
	let scale: number
	const mouseX: number
	const mouseY: number
	function on(): void;
	function off(): void;
	function isActive(): boolean
	let init: true

}

declare function rgb(r: number, g: number, b: number, a?: number): p5Color

declare function noSmooth(): void
declare function background(color: p5ColorChoice): void

declare function drawSprites(group?: Group /*= World.allSprites*/): void
declare function drawSprite(sprite: Sprite): void
declare function createSprite(x?: number, y?: number, w?: number, h?: number): Sprite
declare function createSprite<customProps extends object>(x?: number, y?: number, w?: number, h?: number): (Sprite & customProps)
declare function createGroup(): Group
declare function createEdgeSprites(): void

//inputs
declare function keyDown(key: p5KeyType): boolean
declare function keyUp(key: p5KeyType): boolean
declare function mouseDown(key: p5MouseType): boolean
declare function mouseUp(key: p5MouseType): boolean
declare function mouseWentDown(key: p5MouseType): boolean
declare function mouseWentUp(key: p5MouseType): boolean
declare function mouseDidMove(): boolean
declare function mousePressedOver(sprite: Sprite): boolean
declare function mouseIsOver(sprite: Sprite): boolean
declare function keyWentUp(key: p5KeyType): boolean;
declare function keyWentDown(key: p5KeyType): boolean;

//colors
declare function fill(color: p5ColorChoice): void;
declare function noFill(): void
declare function stroke(color: p5ColorChoice): void
declare function noStroke(): void
declare function strokeWeight(weight: number): void

//basic drawing
declare function ellipse(x: number, y: number, width?: number, height?: number): void
declare function rect(x: number, y: number, width?: number, height?: number): void
declare function curveVertex(x: number, y: number): void
declare function beginShape(): void
declare function endShape(): void

//math
declare function atan2(y: number, x: number): number
declare function atan(m: number): number
declare function cos(m: number): number
declare function sin(m: number): number
declare function random(): number
declare function randomNumber(min: number, max: number): number
declare function dist(x: number, y: number, x2: number, y2: number): number

//text
declare function textAlign(x: p5AlignmentX, y?: p5AlignmentY): void
declare function text(text: string, x: number, y: number, w?: number, h?: number): void
declare function textFont(font: string): void
declare function textSize(size: number): void;

//translations or whatever
declare function translate(x: number, y: number): void;
declare function rotate(r: number): void;

declare const CENTER = "center";
declare const LEFT = "left";
declare const RIGHT = "right";
declare const BASELINE = "baseline";
declare const TOP = "top";
declare const BOTTOM = "bottom";