import {Model} from 'backbone'

export default class SingleValue extends Model {
	constructor (value: any) {
		super({value})
	}

	getValue (): string {
		return this.get('value')
	}

	setValue (value: any): void {
		this.set({value})
	}
}