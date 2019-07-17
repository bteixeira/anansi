import {View} from 'backbone'
import {state} from '../models/fetchTransform'

export default class AlertView extends View {
	constructor (private state: state, private text: string) {
		super()
	}

	private static getAlertClassFromState (state: state): string {
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

	setState (state: state): void {
		this.state = state
		this.render()
	}

	setText (text: string): void {
		this.text = text
		this.render()
	}
}