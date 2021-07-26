//type definitions for ziriksi's pylon
/*
╔═══════════════════════════════════════════════════════════════╗
║  ______           ___                                         ║
║ /\  __ \         /\_ \                                        ║
║ \ \ \_\ \ __  __ \//\ \      ____  ______                     ║
║  \ \  __//\ \/\ \  \ \ \    / __ \/\  __ \                    ║
║   \ \ \/ \ \ \_\ \  \_\ \_ /\ \_\ \ \ \ \ \                   ║
║    \ \_\  \ \____ \ /\____\\ \____/\ \_\ \_\                  ║
║     \/_/   \/___/  \\/____/ \/___/  \/_/\/_/                  ║
║               /\___/                                          ║
║               \/__/                                           ║
║                                                               ║
║                                                               ║
║ Previously known as ZFunc                                     ║
║ Made by ziriksi                                               ║
╟───────────────────────────────────────────────────────────────╢
║                                                               ║
║ Pylon is a useful library i made. It includes multiple random ║
║ functions from games i made which i decided to move here for  ║
║ later use.                                                    ║
║                                                               ║
║ Library IDs: Ax9qgV0qivNghmgVFjsdNPIS_3rPHFeiHbgOZ1dSbtQ      ║
║                                                               ║
║ DM me on discord @Ziriksi#9999 if you have any questions or   ║
║ suggestions for the library                                   ║
╚═══════════════════════════════════════════════════════════════╝
*/

declare namespace Pylon {
	type Unit = [number, number]
	type Units = Unit[]
	type TextSettings = {
		text: string, alignX: p5AlignmentX, alignY: p5AlignmentY, xOffset: number, yOffset: number, font: p5Font, size: number, color: p5ColorChoice, strokeColor: p5ColorChoice, strokeSize: number
	};

	class Rainbow {
		/**
		 * Returns the variable as a usable hex string
		 */
		ToColor(): string

		/**
		 * Resets the variable to [255,0,0] (red)
		 */
		Reset(): void

		/**
		 * Moves the color of the variable forward. Usually goes in the draw loop.
		 */
		Forward(): void
	}

	class DisplayType {
		Full(): string
		Abr(): string
		Num(): string
	}

	class Time {
		Value: Units
		Highest: DisplayType
		All: DisplayType
		AllAboveZero: DisplayType
	}

	class Button extends Sprite {
		onClick: () => void
		onRelease: () => void
		onHold: () => void
		onNotHold: () => void
		whileOver: () => void
		whileNotOver: () => void
		textSettings: TextSettings

		Check(): void

		//constructor(w: number, h: number)
	}

	/**
	 * Returns an array of randomly arranged sequential numbers that don't repeat
	 * This can be useful for placing objects randomly without any overlapping
	 */
	function randomRange(length: number): number[]

	/**
	 * Returns the mean of an array
	 */
	function mean(array: number[]): number

	/**
	 * Replaces each "/" in a user ID to "@" to fix a key value bug
	 */
	function fixedUserId(): string

	/**
	 * Returns a number converted to a shorter string (Ex: 1234567 -> "1.23M")
	 */
	function shortenNumber(num: number): string

	/**
	 * Creates a variable which allows you to make rainbow objects
	 * @param time The amount of frames it takes for one color value to change by 255. i.e. The amount of frames it takes to go around the whole color wheel divided by 6
	 */
	function newRainbow(time: number): Rainbow

	/**
	 * Converts milliseconds into a time object with multiple display options
	 * This was mostly just for practice but ended up being pretty useful
	 */
	function time(ms: number): Time

	/**
	 * Set up buttons and set defaults
	 */
	function buttonSetup(data: Partial<{
		onClick: () => void,
		onRelease: () => void,
		onHold: () => void,
		onNotHold: () => void,
		whileOver: () => void,
		whileNotOver: () => void,
		textSettings: Partial<TextSettings>,
	}>)

	/**
	 * Creates a button
	 * @param x The initial x coordinate
	 * @param y The initial y coordinate
	 */
	function button(x: number, y: number): Button

	/**
	 * Required for button() to work. Put this in the draw loop after drawSprites().
	 */
	function checkButtons(): void

	/**
	 * Gets the number of unique users of your project
	 * @param callback The function to run after users are counted
	 */
	function getUniqueUsers(callback: (users: number) => void): void

	/**
	 * Disables setKeyValue() and getKeyValue() when the project is in view mode
	 * Protects you from your project from being hacked using the debug console
	 * @param ad Additional code to run when view mode is being used
	 */
	function protect(ad: () => void): void
}

// #region
/** @private */ declare let __lastCamPos: [number, number] | undefined
/** @private */ declare let __buttons: Group | undefined
/** @private */ declare let __onScreen: Sprite[]
/** @private */ declare let __buttonDefaults: { oc: () => void, or: () => void, oh: () => void, onh: () => void, wo: () => void, wno: () => void, ts: Pylon.TextSettings } | undefined
//#endregion
