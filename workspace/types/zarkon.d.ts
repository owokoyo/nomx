// impixie's poopie library that i painstakingly made the documentation of

namespace Zarkon {
	/** return similarity percentage between two strings. */
	function similarity(s1: string, s2: string): number

	/** returns the difference of two numbers. */
	function returnDifference(): number

	/** stops the game from running and does nothing. */
	function wait(time: number, frameRate: number)

	/** chooses between the values given. Pretty useful if you think about it. */
	function choice<returnType>(...args: returnType[]): returnType

	/** returns the angle that a sprite should have if you cannot use negative angles. */
	function returnRightAngle(angle: number): number

	/** returns how many arguments given were equaling something. */
	function returnWantedValues(wantedValue, ...args): number

	/** deletes first elements in an array. */
	function deleteFirstElements(array: [], number: number): number

}