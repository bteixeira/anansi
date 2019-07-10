import * as React from 'react'
import {fetchTransformSelector} from './main'
import ProjectForm from './projectForm'

interface Status {}
interface Props {
	selector: fetchTransformSelector,
	onChange: (value: string) => void,
	onDelete: () => void,
}

export default class FetchSelector extends React.Component<Props, Status> {
	constructor (props: Props) {
		super(props)
	}

	render () {
		const alertClass = ProjectForm.getAlertClassFromState(this.props.selector.state)
		const {generatedLinks} = this.props.selector
		return (
				<div className="form-row form-group">
					<div className="col">
						<input
								className="form-control form-control-sm"
								type="text"
								placeholder="Selector"
								value={this.props.selector.selector}
								onChange={event => this.props.onChange(event.target.value)}
						/>
					</div>
					<div className="col">
						<div className={`alert ${alertClass} anansi-alert-sm m-0`}>
							Processed {this.props.selector.processedUrls}/{this.props.selector.totalUrls} documents,
							generated {this.props.selector.generatedLinks} link{(generatedLinks === 0 || generatedLinks > 1) ? 's' : ''}
						</div>
					</div>
					<div className="col-auto">
						<button
								className="btn btn-danger btn-sm"
								type="button"
								onClick={this.props.onDelete}
						>
							&times;
						</button>
					</div>
				</div>
		)
	}
}