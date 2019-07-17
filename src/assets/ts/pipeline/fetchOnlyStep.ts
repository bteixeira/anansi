import transformUtils from './transformUtils'

export default class FetchOnlyStep {
	private dataCallbacks: (() => void)[] = []
	private finishedCallbacks: (() => void)[] = []

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

	onData (callback): void {
		this.dataCallbacks.push(callback)
	}

	onFinished (callback): void {
		this.finishedCallbacks.push(callback)
	}
}