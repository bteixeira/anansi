import * as React from 'react'

interface Status {}
interface Props {
	value: string,
	onChange: (value: string) => void,
	onDelete: () => void,
}

export default class FetchSelector extends React.Component<Props, Status> {
	constructor (props: Props) {
		super(props)
	}

	render () {
		return (
				<div className="form-row form-group">
					<div className="col">
						<input
								className="form-control"
								type="text"
								placeholder="Selector"
								value={this.props.value}
								onChange={event => this.props.onChange(event.target.value)}
						/>
					</div>
					<div className="col-auto">
						<button
								className="btn btn-primary"
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