import {View} from 'backbone'
import {FetchState} from '../models/dataProject'

export default class AlertView extends View {
	constructor (private state: FetchState, private text: string) {
		super()
	}

	private static getAlertClassFromState (state: FetchState): string {
		return {
			'New': 'alert-secondary',
			'Fetching': 'alert-primary',
			'Success': 'alert-success',
			'Error': 'alert-danger',
		}[state]
	}

	render (): View {
		const alertClass = AlertView.getAlertClassFromState(this.state)
		this.$el.html(`
			<div class="alert ${alertClass} anansi-alert-sm m-0">
				${
					this.state === 'Fetching' ? 
						'<div class="spinner-border spinner-border-sm" role="status"/>'
					:
						''
				}
				${
					this.state === 'Success' ?
						'&#x2713;'
					:
						''
				}
				${this.text}
			</div>
		`)

		return this
	}

	setState (state: FetchState): void {
		this.state = state
		this.render()
	}

	setText (text: string): void {
		this.text = text
		this.render()
	}
}