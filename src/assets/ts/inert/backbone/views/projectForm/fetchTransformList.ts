import {Collection, View} from 'backbone'
import SingleValue from '../../models/shared/singleValue'

/**
 * Usage
 *      $$list = new List(collection)
 *      $$list.setElement($element)
 *      $$list.render()
 *      ...
 *      $$list.setCollection(collection) // re-renders automatically, assumes view was rendered before and is
 *      supposed to be updated
 */
export default class FetchTransformList extends View {
	private childrenByModel = new Map<SingleValue, JQuery>()

	constructor (private transforms: Collection<SingleValue>) {
		super()
	}

	private initCollection (): void {
		this.transforms.on('add', this.onAddItem, this)
		this.transforms.on('remove', this.onRemoveItem, this)
	}

	private detachCollection (): void {
		this.transforms.off('add', this.onAddItem, this)
		this.transforms.off('remove', this.onRemoveItem, this)
	}

	private onAddItem (singleValue: SingleValue): void {
		const $listItem = this.renderListItem(singleValue)
		this.childrenByModel.set(singleValue, $listItem)
		this.$el.append($listItem)
	}

	private onRemoveItem (singleValue: SingleValue): void {
		const $listItem = this.childrenByModel.get(singleValue)
		$listItem.remove()
		this.childrenByModel.delete(singleValue)
	}

	private renderListItem (singleValue: SingleValue): JQuery {
		const alertClass = 'alert-primary'
		const $listItem = $(`
			<div class="form-row form-group">
				<div class="col">
					<input
							class="form-control form-control-sm"
							type="text"
							placeholder="Selector"
							value="${singleValue.getValue()}"
					/>
				</div>
				<div class="col">
					<div class="alert ${alertClass} anansi-alert-sm m-0">
						Processed {this.props.selector.processedUrls}/{this.props.selector.totalUrls} documents,
						generated {this.props.selector.generatedLinks} link{(generatedLinks === 0 || generatedLinks > 1) ? 's' : ''}
					</div>
				</div>
				<div class="col-auto">
					<button
							class="btn btn-danger btn-sm"
							type="button"
					>
						&times;
					</button>
				</div>
			</div>
		`)

		$listItem.find('input').on('input', (ev: JQuery.ChangeEvent<HTMLInputElement>) => {
			singleValue.setValue(ev.target.value)
		})
		$listItem.find('button').on('click', () => {
			singleValue.destroy()
		})

		return $listItem
	}

	setCollection (collection: Collection<SingleValue>): void {
		this.transforms.forEach(singleValue => {
			this.childrenByModel.get(singleValue).remove()
		})
		this.detachCollection()
		this.transforms = collection
		this.render()
	}

	render (): View {
		this.transforms.forEach(singleValue => {
			const $listItem = this.renderListItem(singleValue)
			this.$el.append($listItem)
			this.childrenByModel.set(singleValue, $listItem)
		})
		this.initCollection()
		return this
	}
}