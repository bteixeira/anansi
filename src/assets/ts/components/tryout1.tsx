import * as React from 'react'

interface Status {
	url: string,
	selector: string,
	resultUrl: string,
	resultSelector: string,
}

export default class Tryout1 extends React.Component<{}, Status> {
	constructor (props: {}) {
		super(props)
		this.state = {
			url: 'http://example.com',
			selector: '',
			resultUrl: ' ',
			resultSelector: ' ',
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
									onChange={this.handleChangeUrl.bind(this)}
									value={this.state.url}
							/>
						</div>
						<div className="col">
							Result
							<pre className="border rounded p-2">
								{this.state.resultUrl}
							</pre>
						</div>
					</div>
					<div className="row">
						<div className="col">
							Applied selector
							<input
								type="text"
								className="form-control"
								onChange={this.handleChangeSelector.bind(this)}
								value={this.state.selector}
							/>
						</div>
						<div className="col">
							Result
							<pre className="border rounded p-2">
								{this.state.resultSelector}
							</pre>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="btn-group">
								<button
										type="button"
										className="btn btn-primary"
										onClick={this.handleClick.bind(this)}
								>
									Go
								</button>
							</div>
						</div>
					</div>
				</div>
		)
	}

	handleClick () {
		this.setState({resultUrl: '...'})
		window.fetch(`api/fetch?url=${this.state.url}`).then(response => {
			return response.text()
		}).then(text => {
			this.setState({
				resultUrl: text,
			})
			const parser = new DOMParser()
			const doc = parser.parseFromString(text, 'text/html')
			const len = $(doc).find(this.state.selector).length
			this.setState({
				resultSelector: `Found ${len} elements`,
			})
		}).catch(reason => {
			this.setState({
				resultUrl: reason,
			})
		})
	}

	handleChangeUrl (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			url: event.target.value,
		})
	}

	handleChangeSelector (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			selector: event.target.value,
		})
	}
}