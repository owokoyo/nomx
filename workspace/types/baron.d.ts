
// Type definitions for the networking library Baron
declare namespace Baron {
	type Status = "success" | "timeout" | "error" | string
	type UpdateCallback = (status: string, result: object) => void
	type ResultCallback = (result: unknown) => void

	type ConnectionUpdateCallback = (method: string) => void
	type ConnectionReceiveCallback = (status: string, result: object, init: boolean) => void
	type ConnectionEventCallback = (value: unknown) => void

	type HttpGetOptions = { headers?: object, type?: "json" | string }
	type HttpPostOptions = { body: string } //& HttpOptions

	type InterfaceInstructions = [{ method: string, type: "push" | "pull", callback?: (status: string, result: UpdateCallback) => void }];

	class PendingResult {
		readonly status: Status
		readonly result: unknown

		update: UpdateCallback
		success: ResultCallback
		timeout: ResultCallback
		error: ResultCallback
	}

	class Interface {
		constructor(url: string, instructions?: InterfaceInstructions)
		push(method: string, query: object, callback: UpdateCallback): PendingResult
		pull(method: string, query: object, callback: UpdateCallback): PendingResult
	}

	class Connection {
		constructor(url: string, opts: object, update: ConnectionUpdateCallback, receive: ConnectionReceiveCallback)

		connectionid: string
		url: string
		alive: boolean //= true
		update: ConnectionUpdateCallback
		interval: number //= 1000

		/** Closes the connection */
		close(): void

		//_update(method: "update" | "close" | string, opts: object)
	}

	function pullURL(url: string, callback: UpdateCallback): PendingResult
	function pull(path: string, callback: UpdateCallback): PendingResult
	//query overload
	function pullURL(url: string, query: object, callback: UpdateCallback): PendingResult
	function pull(path: string, query: object, callback: UpdateCallback): PendingResult

	function pushURL(url: string, callback: UpdateCallback): PendingResult
	function push(path: string, callback: UpdateCallback): PendingResult
	//query overload
	function pushURL(url: string, query: object, callback: UpdateCallback): PendingResult
	function push(path: string, query: object, callback: UpdateCallback): PendingResult

	function connectURL(url: string, update?: ConnectionUpdateCallback, receive?: ConnectionReceiveCallback, event?: ConnectionEventCallback): Connection
	function connect(path: string, update?: ConnectionUpdateCallback, receive?: ConnectionReceiveCallback, event?: ConnectionEventCallback): Connection
	//opts overload
	function connectURL(url: string, opts: object, update?: ConnectionUpdateCallback, receive?: ConnectionReceiveCallback, event?: ConnectionEventCallback): Connection
	function connect(path: string, opts: object, update?: ConnectionUpdateCallback, receive?: ConnectionReceiveCallback, event?: ConnectionEventCallback): Connection

	function createInterface(path: string, instructions?: InterfaceInstructions): Interface
	function createInterfaceURL(url: string, instructions?: InterfaceInstructions): Interface

	function getIdentity(callback: (ip: string) => void): void
	function httpGet(url: string, options: HttpGetOptions, callback: (response: unknown) => void): void
	function httpPost(url: string, options: HttpGetOptions, callback: (response: unknown) => void): void

	function getSource(channel: string, callback: (source: object) => void): void
	function getMetadata(channel: string, callback: (metadata: object) => void): void

	function setURL(url: string): void
	function discord(onurl: (url: string) => void, oninfo: (info: { avatar: string, discriminator: string, flags: number, locale: string, mfa_enabled: boolean, premium_type: number, public_flags: number, id: string, username: string }) => void): void
}