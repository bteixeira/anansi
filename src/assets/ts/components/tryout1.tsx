import * as React from 'react'

interface Status {
	url: string,
	result: string,
}

export default class Tryout1 extends React.Component<{}, Status> {
	constructor (props: {}) {
		super(props)
		this.state = {
			url: 'http://example.com',
			result: ' ',
		}
	}

	render () {
		return (
				<div className="container">
					<h1>Anansi</h1>
					<div className="row">
						<div className="col">
							Starting URL
							<input
									type="url"
									className="form-control"
									onChange={this.handleUpdateUrl.bind(this)}
									value={this.state.url}
							/>
							<button
									type="button"
									className="btn btn-primary"
									onClick={this.handleClick.bind(this)}
							>
								Go
							</button>
						</div>
						<div className="col">
							Result
							<pre className="border rounded p-2">
								{this.state.result}
							</pre>
						</div>
					</div>
				</div>
		)
	}

	handleClick () {
		this.setState({result: '...'})
		window.fetch(`api/fetch?url=${this.state.url}`).then(response => {
			response.text().then(text => {
				this.setState({
					result: text,
				})
			})
		}).catch(reason => {
			this.setState({
				result: reason,
			})
		})
	}

	handleUpdateUrl (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			url: event.target.value,
		})
	}
}