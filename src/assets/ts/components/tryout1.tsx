import * as React from 'react'
import TransformUtils, {DocumentWrapper} from '../transformUtils'
import FetchSelector from './fetchSelector'
import ResultsTable from './resultsTable'
import RawTable from './rawTable'

interface Status {
	startingUrl: string,
	fetchSelectors: {[index: string]: string},
	fixedFieldName: string,
	fixedFieldSelector: string,
	fixedFieldXpath: string,
	dynamicFieldSelector: string,
	dynamicFieldNameScript: string,
	dynamicFieldValueScript: string,
	resultUrl: string,
	resultRecords: {[index: string]: string}[],
}

export default class Tryout1 extends React.Component<{}, Status> {
	private keyCount: number

	constructor (props: {}) {
		super(props)
		this.state = {
			// url: 'https://www.babepedia.com/babe/Candice_B',
			// selector: 'a',
			// fixedFieldName: 'Name',
			// fixedFieldSelector: '#bioarea h1',
			// fixedFieldXpath: 'text()',
			// dynamicFieldSelector: '#bioarea ul li',
			// dynamicFieldNameScript: `$el.find('span').text().split(':')[0]`,
			// dynamicFieldValueScript: '$el.text().slice($el.text().indexOf(\':\') + 1).trim()',

			startingUrl: 'https://www.gsmarena.com/makers.php3',
			fetchSelectors: {
				'0': '.st-text a[href="casio-phones-77.php"]',
				'1': '#review-body li a',
			},
			fixedFieldName: 'Name',
			fixedFieldSelector: '.specs-phone-name-title',
			fixedFieldXpath: 'text()',
			dynamicFieldSelector: '#specs-list tr',
			dynamicFieldNameScript: `$el.find('.ttl').text().trim() || $el.find('th').text().trim()`,
			dynamicFieldValueScript: '$el.find(\'.nfo\').text()',

			resultUrl: ' ',
			resultRecords: [],
		}

		this.keyCount = Object.keys(this.state.fetchSelectors).length
	}

	render () {
		return (
				<div className="container">
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Input</h3>
						</div>
					</div>
					<div className="row">
						<div className="col">
							URL
							<input
									type="url"
									className="form-control"
									onChange={this.handleChangeUrl.bind(this)}
									value={this.state.startingUrl}
							/>
						</div>
						<div className="col">
							Result
							<pre className="border rounded p-2">
								{
									//this.state.resultUrl
									'Disabled'
								}
							</pre>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Fetch Transforms</h3>
						</div>
					</div>
					{
						Object.keys(this.state.fetchSelectors).map(key => {
							return <FetchSelector
									key={key}
									value={this.state.fetchSelectors[key]}
									onDelete={() => this.removeSelector(key)}
									onChange={value => {
										this.setState(prevState => ({
											fetchSelectors: Object.assign(
													{},
													prevState.fetchSelectors,
													{[key]: value},
											)
										}))
									}}
							/>
						})
					}
					<div className="row">
						<div className="col">
							<button type="button" className="btn btn-primary" onClick={this.addNewFetchSelector.bind(this)}>
								Add New
							</button>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Field Mapping</h3>
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
							Dynamic Field name script
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeDynamicFieldNameScript.bind(this)}
									value={this.state.dynamicFieldNameScript}
							/>
						</div>
						<div className="col">
							Dynamic Field value xpath
							<input
									type="text"
									className="form-control"
									onChange={this.handleChangeDynamicFieldValueScript.bind(this)}
									value={this.state.dynamicFieldValueScript}
							/>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Output</h3>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<ResultsTable records={this.state.resultRecords}/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<RawTable records={this.state.resultRecords}/>
						</div>
					</div>
					<hr/>
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

	getFieldsFromDoc (doc: Document) {
		const newFields: {[index: string]: any} = {}

		const $fixedFieldElem = $(doc).find(this.state.fixedFieldSelector)
		if ($fixedFieldElem.length) {
			newFields[this.state.fixedFieldName] = doc.evaluate(
					this.state.fixedFieldXpath,
					$fixedFieldElem[0],
					null,
					XPathResult.STRING_TYPE,
					null,
			).stringValue
		}

		const $dynamicFieldElems = $(doc).find(this.state.dynamicFieldSelector)
		$dynamicFieldElems.each((i, el) => {
			const dynamicFieldName = new Function('$', '$el', `
					return ${this.state.dynamicFieldNameScript}
				`).call(null, $, $(el))

			const dynamicFieldValue = new Function('$', '$el', `
					return ${this.state.dynamicFieldValueScript}
				`).call(null, $, $(el))

			newFields[dynamicFieldName] = dynamicFieldValue
		})

		this.setState(prevState => (
			{
				resultRecords: prevState.resultRecords.concat(newFields),
			}
		))
	}

	addNewFetchSelector () {
		this.setState(prevState => ({
			fetchSelectors: Object.assign({}, prevState.fetchSelectors, {[this.keyCount]: ''})
		}))
		this.keyCount += 1
	}

	removeSelector (key: string): void {
		this.setState(prevState => {
			const newSelectors = Object.assign({}, prevState.fetchSelectors)
			delete newSelectors[key]
			return {
				fetchSelectors: newSelectors
			}
		})
	}

	handleClick () {
		this.setState({
			resultUrl: '...',
			resultRecords: [{'In Progress': '...'}],
		})

		TransformUtils.pipeTransforms([this.state.startingUrl], Object.values(this.state.fetchSelectors))
				.then((documents: DocumentWrapper[]) => {
					this.setState({
						resultRecords: [],
					})
					documents.forEach(document => {
						const parser = new DOMParser()
						const doc = parser.parseFromString(document.body, 'text/html')
						this.getFieldsFromDoc(doc)
					})
				})
	}

	handleChangeUrl (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			startingUrl: event.target.value,
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

	handleChangeDynamicFieldNameScript (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			dynamicFieldNameScript: event.target.value,
		})
	}

	handleChangeDynamicFieldValueScript (event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			dynamicFieldValueScript: event.target.value,
		})
	}
}