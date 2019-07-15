import {Collection, View} from 'backbone'
import SingleValue from '../../models/shared/singleValue'
import FetchTransform from '../../models/fetchTransform'

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
	private childrenByModel = new Map<FetchTransform, JQuery>()

	constructor (private transforms: Collection<FetchTransform>) {
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

	private onAddItem (singleValue: FetchTransform): void {
		const $listItem = this.renderListItem(singleValue)
		this.childrenByModel.set(singleValue, $listItem)
		this.$el.append($listItem)
	}

	private onRemoveItem (singleValue: FetchTransform): void {
		const $listItem = this.childrenByModel.get(singleValue)
		$listItem.remove()
		this.childrenByModel.delete(singleValue)
	}

	private renderListItem (fetchTransform: FetchTransform): JQuery {
		const alertClass = 'alert-primary'
		const $listItem = $(`
			<div class="form-row form-group">
				<div class="col">
					<input
							class="form-control form-control-sm"
							type="text"
							placeholder="Selector"
							value="${fetchTransform.getSelector()}"
					/>
				</div>
				<div class="col">
					<div class="alert ${alertClass} anansi-alert-sm m-0">
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
			fetchTransform.setSelector(ev.target.value)
		})
		$listItem.find('button').on('click', () => {
			fetchTransform.destroy()
		})

		const $$status = new (View.extend({
			model: fetchTransform,
			el: $listItem.find('.alert')[0],
			render: function () {
				this.$el.text(fetchTransform.getState())
			}
		}))()
		$$status.render()
		fetchTransform.on('change', () => $$status.render())

		return $listItem
	}

	setCollection (collection: Collection<FetchTransform>): void {
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