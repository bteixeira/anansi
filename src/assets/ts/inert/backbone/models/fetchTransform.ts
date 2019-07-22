import {Model} from 'backbone'
import StepStats from './stepStats'
import {FetchState} from './dataProject'

type FetchTransformShape = {
	selector: string
	processStats: StepStats
	fetchStats: StepStats
}

export default class FetchTransform extends Model {
	constructor (data: Partial<FetchTransformShape> = {}) {
		super({
			selector: '',
			processStats: new StepStats(),
			fetchStats: new StepStats(),
			...data,
		})
	}

	setSelector (selector: string): void {
		this.set({selector})
	}
	getSelector (): string {
		return this.get('selector')
	}

	setState (state: FetchState): void {
		this.set({state})
	}
	getState (): FetchState {
		return this.get('state')
	}
}