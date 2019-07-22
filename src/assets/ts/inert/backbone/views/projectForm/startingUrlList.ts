import SingleValue from '../../models/shared/singleValue'
import CollectionView from '../shared/collectionView'

export default class StartingUrlList extends CollectionView<SingleValue<string>> {
	renderListItem (startingUrl: SingleValue<string>): JQuery {
		const $el = $(`
			<div class="form-row form-group">
				<div class="col">
					<input
							type="url"
							class="form-control form-control-sm"
							placeholder="http://"
							name="startingUrl[]"
							value="${startingUrl.getValue()}"
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
		`)
		$el.find('input').on('input', (ev: JQuery.ChangeEvent<HTMLInputElement>) => {
			startingUrl.setValue(ev.target.value)
		})
		$el.find('button').on('click', () => {
			startingUrl.destroy()
		})
		return $el
	}
}