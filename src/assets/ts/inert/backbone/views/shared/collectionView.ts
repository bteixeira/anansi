import {Collection, Model, View} from 'backbone'

export type Renderer<T extends Model> = (model: T) => JQuery

export default class CollectionView<T extends Model> extends View {
	constructor (collection: Collection<T>, private renderer: Renderer<T>) {
		super({collection})
	}
}