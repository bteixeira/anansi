import {Collection, View} from 'backbone'
import {StartingUrl} from '../../models/dataProject'

export default class StartingUrlList extends View {
	private listItemsByStartingUrl = new Map<StartingUrl, JQuery>()

	constructor (private startingUrls: Collection<StartingUrl>) {
		super()
		this.init()
	}

	init (): void {
		this.startingUrls.forEach((startingUrl: StartingUrl) => {
			const $listItem = this.renderListItem(startingUrl)
			this.listItemsByStartingUrl.set(startingUrl, $listItem)
		})
		this.startingUrls.on('add', (startingUrl: StartingUrl) => {
			const $listItem = this.renderListItem(startingUrl)
			this.listItemsByStartingUrl.set(startingUrl, $listItem)
			this.$el.append($listItem)
			$listItem.find('input').focus()
		})
		this.startingUrls.on('remove', (startingUrl: StartingUrl) => {
			const $listItem = this.listItemsByStartingUrl.get(startingUrl)
			$listItem.remove()
			this.listItemsByStartingUrl.delete(startingUrl)
		})
	}


	renderListItem (startingUrl: StartingUrl): JQuery {
		const $el = $(`
			<div class="form-row form-group">
				<div class="col">
					<input
							type="url"
							class="form-control form-control-sm"
							placeholder="http://"
							name="startingUrl[]"
							value="${startingUrl.getUrl()}"
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
			startingUrl.setUrl(ev.target.value)
		})
		$el.find('button').on('click', () => {
			startingUrl.destroy()
		})
		return $el
	}

	render (): View {
		this.listItemsByStartingUrl.forEach($listElement => this.$el.append($listElement))
		return this
	}

	setCollection (collection: Collection<StartingUrl>): void {
		this.listItemsByStartingUrl.forEach($listItem => $listItem.remove())
		this.startingUrls.off('add')
		this.startingUrls.off('remove')
		this.startingUrls = collection
		this.listItemsByStartingUrl = new Map<StartingUrl, JQuery>()
		this.init()
	}
}