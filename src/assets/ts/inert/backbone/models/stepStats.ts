import {Collection, Model} from 'backbone'
import {FetchState} from './dataProject'
import SingleValue from './shared/singleValue'

type StepStatsShape = {
	state: FetchState
	doneCount: number
	totalCount: number
	errors: Collection<SingleValue<string>>
}

export default class StepStats extends Model {
	constructor (data: Partial<StepStatsShape> = {}) {
		super({
			state: 'New',
			doneCount: 0,
			totalCount: 0,
			errors: new Collection(),

			...data,
		})
	}

	getState (): FetchState { return this.get('state') }
	setState (state: FetchState) { return this.set({state}) }

	getDoneCount (): number { return this.get('doneCount') }
	setDoneCount (doneCount: number) { return this.set({doneCount}) }

	getTotalCount (): number { return this.get('totalCount') }
	setTotalCount (totalCount: number) { return this.set({totalCount}) }

	getErrors (): Collection<SingleValue<string>> { return this.get('errors') }
}