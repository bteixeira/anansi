import {View} from 'backbone'
import FetchTransform from '../../models/fetchTransform'
import CollectionView from '../shared/collectionView'

export default class FetchTransformList extends CollectionView<FetchTransform> {
	protected renderListItem (fetchTransform: FetchTransform): JQuery {
		const alertClass = 'alert-success'
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
				<div class="col-auto">
					<button
							class="btn btn-danger btn-sm"
							type="button"
					>
						&times;
					</button>
				</div>
			</div>
			<div class="form-row form-group">
				<div class="col-10 offset-1">
					<div class="alert ${alertClass} anansi-alert-sm m-0">
						Processed 2 of 3 pages, generated 5 links
					</div>
				</div>
			</div>
			<div class="form-row form-group">
				<div class="col-10 offset-1">
					<div class="alert alert-danger anansi-alert-sm m-0">
						Fetched 2 of 3 pages
					</div>
				</div>
			</div>
		`)

		$listItem.find('input').on('input', (ev: JQuery.ChangeEvent<HTMLInputElement>) => {
			fetchTransform.setSelector(ev.target.value)
		})
		$listItem.find('button').on('click', () => {
			fetchTransform.destroy()
		})

		// const $$status = new (View.extend({
		// 	model: fetchTransform,
		// 	el: $listItem.find('.alert')[0],
		// 	render: function () {
		// 		this.$el.text(fetchTransform.getState())
		// 	}
		// }))()
		// $$status.render()
		// fetchTransform.on('change', () => $$status.render())

		return $listItem
	}
}