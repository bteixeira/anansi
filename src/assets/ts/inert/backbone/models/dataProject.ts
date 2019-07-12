import {Model} from 'backbone'
import {Dictionary, fetchTransformSelector, StartingUrl} from '../../../components/main'

type DataProjectTemplate = Partial<{
	name: string
	startingUrl: StartingUrl
	fetchSelectors: fetchTransformSelector[]
	fixedFieldName: string
	fixedFieldSelector: string
	fixedFieldXpath: string
	dynamicFieldSelector: string
	dynamicFieldNameScript: string
	dynamicFieldValueScript: string
	resultUrl: string
	resultRecords: Dictionary[]
}>

export default class DataProject extends Model {
	constructor (name: string, attributes: DataProjectTemplate = {}) {
		super({name, ...attributes})
	}

	getName (): string {
		return this.get('name')
	}

	setName (name: string): Model {
		return this.set('name', name)
	}
}