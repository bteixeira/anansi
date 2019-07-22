import {Model} from 'backbone'

export default class SingleValue<T> extends Model {
	constructor (value: T) {
		super({value})
	}

	getValue (): T {
		return this.get('value')
	}

	setValue (value: T): void {
		this.set({value})
	}
}