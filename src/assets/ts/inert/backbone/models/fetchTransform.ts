import {Model} from 'backbone'

export type state = ('New' | 'Fetching' | 'Success' | 'Error')

export default class FetchTransform extends Model {
	constructor (selector: string) {
		super({
			selector,
			state: 'New',
		})
	}

	setSelector (selector: string): void {
		this.set({selector})
	}
	getSelector (): string {
		return this.get('selector')
	}

	setState (state: state): void {
		this.set({state})
	}
	getState (): state {
		return this.get('state')
	}
}