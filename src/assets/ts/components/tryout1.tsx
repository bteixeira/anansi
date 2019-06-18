import * as React from 'react'

interface Status {
	url: string,
	selector: string,
	fixedFieldName: string,
	fixedFieldSelector: string,
	fixedFieldXpath: string,
	dynamicFieldSelector: string,
	dynamicFieldNameXpath: string,
	dynamicFieldValueXpath: string,
	resultUrl: string,
	resultSelector: string,
	resultFields: object,
}

export default class Tryout1 extends React.Component<{}, Status> {
	constructor (props: {}) {
		super(props)
		this.state = {
			url: 'https://www.babepedia.com/babe/Candice_B',
			selector: 'a',
			fixedFieldName: 'name',
			fixedFieldSelector: '#bioarea h1',
			fixedFieldXpath: 'text()',
			dynamicFieldSelector: '#bioarea ul li',
			dynamicFieldNameXpath: 'span/text()',
			dynamicFieldValueXpath: 'text()',
			resultUrl: ' ',
			resultSelector: ' ',
			resultFields: {},
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
							Find selector
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
							Fixed Field name
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeFixedFieldName.bind(this)}
									value={this.state.fixedFieldName}
							/>
						</div>
						<div className="col">
							Fixed Field selector
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeFixedFieldSelector.bind(this)}
									value={this.state.fixedFieldSelector}
							/>
						</div>
						<div className="col">
							Fixed Field xpath
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeFixedFieldXpath.bind(this)}
									value={this.state.fixedFieldXpath}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							Dynamic Field selector
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeDynamicFieldSelector.bind(this)}
									value={this.state.dynamicFieldSelector}
							/>
						</div>
						<div className="col">
							Dynamic Field name xpath
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeDynamicFieldNameXpath.bind(this)}
									value={this.state.dynamicFieldNameXpath}
							/>
						</div>
						<div className="col">
							Dynamic Field value xpath
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeDynamicFieldValueXpath.bind(this)}
									value={this.state.dynamicFieldValueXpath}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							Result
							<pre className="border rounded p-2">
								{JSON.stringify(this.state.resultFields)}
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
		this.setState({
			resultUrl: '...',
			resultSelector: '...',
		})
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

			const newFields: {[index: string]: any} = {}

			const $fixedFieldElem = $(doc).find(this.state.fixedFieldSelector)
			const fixedFieldName = doc.evaluate(
					this.state.fixedFieldXpath,
					$fixedFieldElem[0],
					null,
					XPathResult.STRING_TYPE,
					null,
			).stringValue
			newFields[this.state.fixedFieldName] = fixedFieldName

			const $dynamicFieldElems = $(doc).find(this.state.dynamicFieldSelector)
			$dynamicFieldElems.each((i, el) => {
				const dynamicFieldName = doc.evaluate(
						this.state.dynamicFieldNameXpath,
						el,
						null,
						XPathResult.STRING_TYPE,
						null,
				).stringValue
				const dynamicFieldValue = doc.evaluate(
						this.state.dynamicFieldValueXpath,
						el,
						null,
						XPathResult.STRING_TYPE,
						null,
				).stringValue
				newFields[dynamicFieldName] = dynamicFieldValue
			})

			this.setState(prevState => {
				const fields = Object.assign({}, prevState.resultFields, newFields)
				return {
					resultFields: fields,
				}
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

	handleChangeFixedFieldName (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			fixedFieldName: event.target.value,
		})
	}

	handleChangeFixedFieldSelector (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			fixedFieldSelector: event.target.value,
		})
	}

	handleChangeFixedFieldXpath (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			fixedFieldXpath: event.target.value,
		})
	}

	handleChangeDynamicFieldSelector (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			dynamicFieldSelector: event.target.value,
		})
	}

	handleChangeDynamicFieldNameXpath (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			dynamicFieldNameXpath: event.target.value,
		})
	}

	handleChangeDynamicFieldValueXpath (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			dynamicFieldValueXpath: event.target.value,
		})
	}
}