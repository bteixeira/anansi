import transformUtils from './transformUtils'

type Callback = () => void
type ErrorCallback = (error: Error) => void

export default class FetchOnlyStep {
	private dataCallbacks: Callback[] = []
	private errorCallbacks: ErrorCallback[] = []
	private finishedCallbacks: Callback[] = []

	private closing: boolean = false
	private remaining: number = 0

	push (url: string): void {
		if (this.closing) {
			throw new Error('stream closed')
		}
		this.remaining += 1
		transformUtils.fetchDocument(url).then(() => {
			this.remaining -= 1
			this.dataCallbacks.forEach(cb => cb())
			this.checkClose()
		}).catch((reason: Error) => {
			this.remaining -= 1
			this.errorCallbacks.forEach((cb: ErrorCallback) => cb(reason))
			this.checkClose()
		})
	}

	private checkClose (): void {
		if (this.remaining === 0) {
			this.finishedCallbacks.forEach(cb => cb())
		}
	}

	close (): void {
		this.closing = true
		this.checkClose()
	}

	onData (callback: Callback): void {
		this.dataCallbacks.push(callback)
	}

	onError (callback: ErrorCallback): void {
		this.errorCallbacks.push(callback)
	}

	onFinished (callback: Callback): void {
		this.finishedCallbacks.push(callback)
	}
}