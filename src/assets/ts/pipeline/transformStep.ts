import Signal from '../signal'

export default abstract class TransformStep<I, O> {
	public readonly onData = new Signal<O>()
	public readonly onError = new Signal<any>()
	public readonly onFinished = new Signal<void>()

	private closing: boolean = false
	private remaining: number = 0

	push (data: I): void {
		if (this.closing) {
			throw new Error('Attempted to push into closed stream')
		}
		this.remaining += 1
		this.process(data, () => {
			this.remaining -= 1
			this.checkClose()
		})
	}

	private checkClose (): void {
		if (this.closing && this.remaining === 0) {
			this.onFinished.trigger()
		}
	}

	protected emit (data: O): void {
		this.onData.trigger(data)
	}

	close (): void {
		this.closing = true
		this.checkClose()
	}

	pipe (other: TransformStep<O, any>): TransformStep<O, any> {
		this.onData.add(data => other.push(data))
		this.onFinished.add(() => other.close())
		return other
	}

	protected abstract process (data: I, done: (() => void)): void
}