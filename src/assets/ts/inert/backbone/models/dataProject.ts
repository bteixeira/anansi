import {Collection, Model} from 'backbone'
import SingleValue from './shared/singleValue'
import FetchTransform from './fetchTransform'

export type FetchState = ('New' | 'Fetching' | 'Success' | 'Error') // TODO ENUM

type DataProjectTemplate = Partial<{
	name: string
	// running: boolean
	startingUrls: Collection<SingleValue<string>>
	// startingUrlStats: UrlFetchStats
	fetchSelectors: Collection<FetchTransform>

	// fixedFieldName: string
	// fixedFieldSelector: string
	// fixedFieldXpath: string
	// dynamicFieldSelector: string
	// dynamicFieldNameScript: string
	// dynamicFieldValueScript: string
	// resultUrl: string
	// resultRecords: Dictionary[]
}>

export default class DataProject extends Model {
	constructor (name: string, attributes: DataProjectTemplate = {}) {
		super({
			name,
			startingUrls: new Collection<SingleValue<string>>(),
			fetchSelectors: new Collection<FetchTransform>(),
			...attributes,
		})
	}

	getName (): string {
		return this.get('name')
	}

	setName (name: string): Model {
		return this.set('name', name)
	}

	getStartingUrls (): Collection<SingleValue<string>> {
		return this.get('startingUrls')
	}

	getFetchSelectors (): Collection<FetchTransform> {
		return this.get('fetchSelectors')
	}
}