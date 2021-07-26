declare namespace Soundstream {
	/**
	 * Represents a channel
	 */
	class Channel {
		/**
		 * Whether the channel is playing currently.
		 */
		isPlaying: boolean

		/**
		 * Whether the channel restarts when it ends
		 */
		isLooped: boolean

		/**
		 * The current position of the channel (track)
		 */
		playbackPosition: number

		/**
		 * How many times the sound is played in parallel, higher number is louder sound
		 */
		intensity: number;

		/**
		 * url or Amalgamate of current channel
		 */
		readonly sound: string | Amalgamate

		/** 
		 * @private
		 * Position of track
		 */
		readonly _playbackPosition: number;

		/**
		 * @private
		 * Timestamp when track started playing.
		 */
		readonly _start: number;

		/**
		 * Sets the sound of the channel, replays if it changes. Will only replay same sound if forceReplay is true.
		 */
		setSound(sound: string | Amalgamate, forceReplay?: boolean): void

		/**
		 * Stops and (re)plays the current sound, set resetPosition to true if the sound should play from the start
		 */
		replay(resetPosition: boolean): void

		/**
		 * Plays/Stops the current sound. Specify preservePlaybackPosition in order to not reset the playback.
		 */
		toggle(preservePlaybackPosition?: boolean): boolean

		/**
		 * Plays the current sound. Set looped to true to loop sound.
		 */
		play(looped?: boolean): void

		/**
		 * Stops the current sound. Specify preservePlaybackPosition in order to not reset the playback.
		 */
		stop(preservePlaybackPosition?: boolean): void
		constructor(sound: string, start?: boolean, looped?: boolean)
	}

	/**
	 * Represents multiple sounds
	 */
	class Amalgamate {
		readonly sounds: string[]
		/**
		 * @private
		 */
		play(looped: boolean, callback: () => void): void
		/**
		 * @private
		 */
		stop(): void
		constructor(...sounds: string[])
	}
}
declare let _SoundstreamLoaded: boolean;