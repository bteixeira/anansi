export type SignalHandler<T> = ((data: T) => void)

export default class Signal<T> {
	private handlers = new Set<SignalHandler<T>>()

	add (handler: SignalHandler<T>): void {
		this.handlers.add(handler)
	}

	remove (handler: SignalHandler<T>): boolean {
		return this.handlers.delete(handler)
	}

	trigger (value?: T): void {
		this.handlers.forEach(handler => handler(value))
	}
}