import {Collection, Model} from 'backbone'

export class StartingUrl extends Model {
	constructor (url: string) {
		super({url})
	}

	getUrl (): string {
		return this.get('url')
	}

	setUrl (url: string): void {
		this.set({url})
	}
}

type DataProjectTemplate = Partial<{
	name: string
	startingUrls: Collection<StartingUrl>
	// fetchSelectors: string[]
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
			startingUrls: new Collection<StartingUrl>(),
			...attributes,
		})
	}

	getName (): string {
		return this.get('name')
	}

	setName (name: string): Model {
		return this.set('name', name)
	}

	getStartingUrls (): Collection<StartingUrl> {
		return this.get('startingUrls')
	}
}