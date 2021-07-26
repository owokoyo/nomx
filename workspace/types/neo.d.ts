declare namespace Neo {
	//many options are removed as having so many options is bad practice
	type rotationAlias = "rotation" //| "r" | "rot" | "spin" | "tilt" | "Rotate"
	type alphaAlias = "opacity" //| "alpha" | "a" | "o" | "v" | "visibility"
	type blurAlias = "blur" //| "b"
	type value = "default" | number // | "d" 
	type linear = "linear" //| "l" | "d" | "def" | "default"
	type easeIn = "ease in" // | "ei"
	type easeOut = "ease out" // | "eo"
	type easeInOut = "ease in out"

	function animate(id: string, property: rotationAlias | alphaAlias | blurAlias, from: value, to: number, time: number, fps: number, interp: linear | easeIn | easeOut | easeInOut): void
}