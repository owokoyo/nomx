type HttpStatusCode = string;
type storageValue = boolean | number | string | undefined | null
type recordTerm = { [s: string]: storageValue };
type recordObject = { id: number } & recordTerm;
type mime = string;
type ScreenId = string;
type ImgData = { data: number[], width: number, height: number }
type ChartOptions = { bars?: "vertical" | "horizontal", title?: string, colors?: string[], legend?: { position?: "static" | "relative" | "fixed" | "absolute" | "sticky" } }

//other stuff
declare function getColumn<value extends storageValue>(table: string, column: string): value[]

declare function readRecords<search extends recordTerm>(table: string, terms: Partial<search & recordObject>, callback: (results: (search & recordObject)[], success: boolean) => void): void

/** @deprecated Halts program; use readRecords instead */
declare function readRecordsSync<search extends recordTerm>(table: string): (search & recordObject)[]

declare function createRecord<created extends recordTerm>(table: string, record: created, callback: (result: (created & recordObject), success: boolean) => void): void

/** @deprecated Halts program; use createRecord instead */
declare function createRecordSync<created extends recordTerm>(table: string, record: created): (created & recordObject)

declare function updateRecord<updated extends recordTerm>(table: string, record: updated & recordObject, callback: (result: (updated & recordObject), success: boolean) => void): void

/** @deprecated Halts program; use updateRecord instead */
declare function updateRecordSync<updated extends recordTerm>(table: string, record: updated & recordObject): (updated & recordObject)

declare function deleteRecord<deleted extends recordTerm>(table: string, record: Partial<deleted & recordObject>, callback: (success: boolean) => void): void

/** @deprecated Halts program; use deleteRecord instead */
declare function deleteRecordSync<deleted extends recordTerm>(table: string, record: Partial<deleted & recordObject>): boolean

declare function onRecordEvent<updated extends recordTerm>(table: string, callback: (updated: (updated & recordObject), type: "create" | "update" | "delete") => void): void

declare function startWebRequest(url: string, callback: (status: HttpStatusCode, type: mime, content: string) => void): void

/** @deprecated Halts program; use startWebRequest instead */
declare function startWebRequestSync(url: string): string

declare function setKeyValue(key: string, value: recordTerm, callback?: (result: storageValue) => void): void;

/** @deprecated Halts program; use setKeyValue instead */
declare function setKeyValueSync(key: string, value: recordTerm): storageValue;

declare function getKeyValue(key: string, callback?: (result: storageValue) => void): void;

/** @deprecated Halts program; use getKeyValue instead */
declare function getKeyValueSync(key: string): storageValue;

declare function playSound(url: string, loop: true | false, loaded?: () => void): void

/** Unique string that can be used to track the user across sessions.
 * Unfortunately it contains a slash that makes it potentially invalid as a key
 * 
 * A possible solution is 
 * @example
 * encodeURICompnent(getUserId())
 * //or
 * getUserId().replace(/\//g, ")")
 */
declare function getUserId(): string

type BaseEventProps<id extends string = string> = { currentTargetId: id, targetId: string, srcElementId: string, which: number }
type KeyEventProps = { ctrlKey: boolean, altKey: boolean, metaKey: boolean, shiftKey: boolean }
type SelectionProps = { selectionStart: number, selectionEnd: number }
type KeyActionEventProps = { charCode: number, keyCode: number, location: number, repeat: boolean, key: string } & KeyEventProps
declare function onEvent<t extends "click" | "mousemove" | "mousedown" | "mouseup" | "mouseover" | "mouseout", id extends string>(id: id, type: t, callback: (event: {
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
} & BaseEventProps<id> & KeyEventProps) => void): void

declare function onEvent<t extends "keyup" | "keydown" | "keypress", id extends string>(id: id, type: t, callback: (event: {
	type: t
} & BaseEventProps<id> & KeyActionEventProps) => void): void

declare function onEvent<t extends "input", id extends string>(id: id, type: t, callback: (event: {
	type: t
} & BaseEventProps<id> & SelectionProps) => void): void

declare function onEvent<t extends "change", id extends string>(id: id, type: t, callback: (event: {
	type: t
} & BaseEventProps<id> & KeyActionEventProps & SelectionProps) => void): void

declare function setAttribute(id: string, attribute: "scrollTop", value: unknown): boolean

/**
 * Gets the attribute of an element
 * @example getAttribute(id, attribute) === document.getElementById(id)[attribute].toString()
 */
declare function getAttribute(id: string, attribute: string): string

declare namespace console {
	function log(...args: any[]): void;
}

declare const window: { [s: string]: any };