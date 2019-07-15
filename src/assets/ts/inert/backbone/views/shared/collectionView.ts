import {Collection, Model, View} from 'backbone'

/**
 * Usage
 *      $$list = new List(collection)
 *      $$list.setElement($element)
 *      $$list.render()
 *      ...
 *      $$list.setCollection(collection) // re-renders automatically, assumes view was rendered before and is
 *      supposed to be updated
 */
export default abstract class CollectionView<T extends Model> extends View {
	private childrenByModel = new Map<T, JQuery>()

	constructor (private typedCollection: Collection<T>) {
		super({collection: typedCollection})
		this.initCollection()
	}

	private initCollection (): void {
		this.typedCollection.on('add', this.onAddItem, this)
		this.typedCollection.on('remove', this.onRemoveItem, this)
	}

	private detachCollection (): void {
		this.childrenByModel.forEach($listItem => $listItem.remove())
		this.typedCollection.off('add', this.onAddItem, this)
		this.typedCollection.off('remove', this.onRemoveItem, this)
	}

	private onAddItem (model: T): void {
		const $listItem = this.renderListItem(model)
		this.childrenByModel.set(model, $listItem)
		this.$el.append($listItem)
	}

	private onRemoveItem (model: T): void {
		const $listItem = this.childrenByModel.get(model)
		$listItem.remove()
		this.childrenByModel.delete(model)
	}

	setCollection (collection: Collection<T>): void {
		this.detachCollection()
		this.typedCollection = collection
		this.render()
		this.initCollection()
	}

	render (): View {
		this.typedCollection.forEach(model => {
			const $listItem = this.renderListItem(model)
			this.$el.append($listItem)
			this.childrenByModel.set(model, $listItem)
		})
		return this
	}

	protected abstract renderListItem (model: T): JQuery
}