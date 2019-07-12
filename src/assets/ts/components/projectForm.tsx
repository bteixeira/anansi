import * as React from 'react'
import FetchSelector from './fetchSelector'
import ResultsTable from './resultsTable'
import RawTable from './rawTable'
import {DataProject, Dictionary, fetchTransformSelector} from './main'
import {ChangeEvent} from 'react'
import TransformUtils, {DocumentWrapper} from '../pipeline/transformUtils'
import PipelineFetchStep from '../pipeline/pipelineFetchStep'
import PipelineReceiverStep from '../pipeline/pipelineReceiverStep'

interface Props extends DataProject {
	onUpdateProject: (fieldName: string, newValue: any) => void
	onDeleteProject: () => void
}
interface State {}

export enum fetchState {
	New,
	Fetching,
	Success,
	Error,
}

export default class ProjectForm extends React.Component<Props, State> {
	constructor (props: Props) {
		super(props)
		this.onUpdateField = this.onUpdateField.bind(this)
		this.onClickDelete = this.onClickDelete.bind(this)
	}

	onUpdateField (ev: ChangeEvent<HTMLInputElement>) {
		const fieldName = ev.target.name
		const fieldValue = ev.target.value
		this.props.onUpdateProject(fieldName, fieldValue)
	}

	onClickDelete (): void {
		if (window.confirm('Delete this project permanently?')) {
			this.props.onDeleteProject()
		}
	}

	updateFetchSelector (i: number, updatedFields: Partial<fetchTransformSelector>): void {
		this.props.onUpdateProject(
				'fetchSelectors',
				this.props.fetchSelectors.map((fs, j) => (i === j ? {...fs, ...updatedFields} : fs))
		)
	}

	public static getAlertClassFromState (state: fetchState): string {
		return {
			[fetchState.New]: 'alert-secondary',
			[fetchState.Fetching]: 'alert-primary',
			[fetchState.Success]: 'alert-success',
			[fetchState.Error]: 'alert-danger',
		}[state]
	}

	static renderStartingUrlState (state: fetchState) {
		const alertClass = this.getAlertClassFromState(state)

		return (
			<div className="col">
				<div className={`alert ${alertClass} anansi-alert-sm m-0`} role="alert">
					{(state === fetchState.New) && (
						"No data fetched yet"
					)}
					{(state === fetchState.Fetching) && (
						<React.Fragment>
							Fetching...
							<div className="spinner-border spinner-border-sm float-right" role="status"/>
						</React.Fragment>
					)}
					{(state === fetchState.Success) && (
						<React.Fragment>
							Loaded
							<span className="float-right">&#x2713;</span>
						</React.Fragment>
					)}
					{(state === fetchState.Error) && (
						<React.Fragment>
							Error fetching the page
						    <span className="float-right">&#x2717;</span>
						</React.Fragment>
					)}
				</div>
			</div>
		)
	}

	render () {
		return (
				<div className="container-fluid">
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Data Project</h3>
						</div>
					</div>
					<div className="form-row form-group">
						<label className="col-auto col-form-label">
							Name
						</label>
						<div className="col">
							<input
									type="text"
									className="form-control"
									name="name"
									value={this.props.name}
									onChange={this.onUpdateField}
							/>
						</div>
						<div className="col-auto">
							<button className="btn btn-danger" onClick={this.onClickDelete}>
								Delete Project
							</button>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="btn-group">
								<button
										type="button"
										className="btn btn-primary"
										onClick={
											// this.handleClick.bind(this)
											this.handleWithPipes.bind(this)
										}
								>
									Go
								</button>
							</div>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<h4>Starting URLs</h4>
						</div>
					</div>
					<div className="form-row form-group">
						<div className="col">
							<input
									type="url"
									className="form-control form-control-sm"
									placeholder="http://"
									name="startingUrl"
									value={this.props.startingUrl.url}
									onChange={ev => {
										this.props.onUpdateProject('startingUrl', {
											url: ev.target.value,
											fetchState: this.props.startingUrl.fetchState,
										})
									}}
							/>
						</div>
						{
							ProjectForm.renderStartingUrlState(this.props.startingUrl.fetchState)
						}
						<div className="col-auto">
							<button
								className="btn btn-danger btn-sm"
								type="button"
							>
								&times;
							</button>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<button className="btn btn-primary">+</button>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<h3>Fetch Transforms</h3>
						</div>
					</div>
					{
						this.props.fetchSelectors.map((fetchSelector, i) =>
							<FetchSelector
									key={`${i}`}
									selector={fetchSelector}
									onDelete={() => this.props.onUpdateProject(
											'fetchSelectors',
											this.props.fetchSelectors.filter((fs, j) => (i !== j))
									)}
									onChange={newValue => this.updateFetchSelector(i, {selector: newValue})}
							/>
						)
					}
					<div className="row">
						<div className="col">
							<button type="button" className="btn btn-primary" onClick={() => this.props.onUpdateProject(
									'fetchSelectors',
									this.props.fetchSelectors.concat({
										selector: '',
										state: fetchState.New,
										totalUrls: 0,
										processedUrls: 0,
										generatedLinks: 0,
									}),
							)}>
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
									name="fixedFieldName"
									value={this.props.fixedFieldName}
									onChange={this.onUpdateField}
							/>
						</div>
						<div className="col">
							Fixed Field selector
							<input
									type="text"
									className="form-control"
									name="fixedFieldSelector"
									value={this.props.fixedFieldSelector}
									onChange={this.onUpdateField}
							/>
						</div>
						<div className="col">
							Fixed Field xpath
							<input
									type="text"
									className="form-control"
									name="fixedFieldXpath"
									value={this.props.fixedFieldXpath}
									onChange={this.onUpdateField}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							Dynamic Field selector
							<input
									type="text"
									className="form-control"
									name="dynamicFieldSelector"
									value={this.props.dynamicFieldSelector}
									onChange={this.onUpdateField}
							/>
						</div>
						<div className="col">
							Dynamic Field name script
							<input
									type="text"
									className="form-control"
									name="dynamicFieldNameScript"
									value={this.props.dynamicFieldNameScript}
									onChange={this.onUpdateField}
							/>
						</div>
						<div className="col">
							Dynamic Field value script
							<input
									type="text"
									className="form-control"
									name="dynamicFieldValueScript"
									value={this.props.dynamicFieldValueScript}
									onChange={this.onUpdateField}
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
							<ResultsTable records={this.props.resultRecords}/>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<RawTable records={this.props.resultRecords}/>
						</div>
					</div>
					<hr/>
					<div className="row">
						<div className="col">
							<div className="btn-group">
								<button
										type="button"
										className="btn btn-primary"
										onClick={
											// this.handleClick.bind(this)
											this.handleWithPipes.bind(this)
										}
								>
									Go
								</button>
							</div>
						</div>
					</div>
				</div>
		)
	}

	getFieldsFromDoc (document: DocumentWrapper): Dictionary {
		const parser = new DOMParser()
		const doc = parser.parseFromString(document.body, 'text/html')
		const newFields: Dictionary = {}

		const $fixedFieldElem = $(doc).find(this.props.fixedFieldSelector)
		if ($fixedFieldElem.length) {
			newFields[this.props.fixedFieldName] = doc.evaluate(
					this.props.fixedFieldXpath,
					$fixedFieldElem[0],
					null,
					XPathResult.STRING_TYPE,
					null,
			).stringValue
		}

		const $dynamicFieldElems = $(doc).find(this.props.dynamicFieldSelector)
		$dynamicFieldElems.each((i, el) => {
			const dynamicFieldName = new Function('$', '$el', `
					return ${this.props.dynamicFieldNameScript}
				`).call(null, $, $(el))

			const dynamicFieldValue = new Function('$', '$el', `
					return ${this.props.dynamicFieldValueScript}
				`).call(null, $, $(el))

			newFields[dynamicFieldName] = dynamicFieldValue
		})

		return newFields
	}

	handleClick () {
		this.props.onUpdateProject('startingUrl', {
			url: this.props.startingUrl.url,
			fetchState: fetchState.Fetching,
		})
		this.props.onUpdateProject('resultRecords', [])
		TransformUtils
				.fetchDocument(this.props.startingUrl.url)
				.then((document: DocumentWrapper) => {
					this.props.onUpdateProject('startingUrl', {
						url: this.props.startingUrl.url,
						fetchState: fetchState.Success,
					})
					TransformUtils.pipeTransforms([document], this.props.fetchSelectors.map(s => s.selector))
							.then((documents: DocumentWrapper[]) => {
								const newRecords = documents.map(document => {
									return this.getFieldsFromDoc(document)
								})
								this.props.onUpdateProject('resultRecords', newRecords)
							})
				})
				.catch(reason => {
					this.props.onUpdateProject('startingUrl', {
						url: this.props.startingUrl.url,
						fetchState: fetchState.Error,
					})
				})
	}

	handleWithPipes () {
		this.props.onUpdateProject('resultRecords', [])
		this.props.onUpdateProject('fetchSelectors', this.props.fetchSelectors.map(selector => ({
				...selector,
				state: fetchState.Fetching,
				generatedLinks: 0,
				processedUrls: 0,
				totalUrls: 0,
		})))
		const pipeTransforms = this.props.fetchSelectors.map((selector, i) => {
			const transform = new PipelineFetchStep(selector.selector)
			transform.onFinished(() => {
				this.updateFetchSelector(i, {state: fetchState.Success})
			})
		// 	// transform.onReceived
		// 	// transform.onProcessed
			transform.onData(data => {
				this.updateFetchSelector(i, {
					generatedLinks: this.props.fetchSelectors[i].generatedLinks + 1
				})
			})
			return transform
		})
		const me = this

		const lastTransform = pipeTransforms.reduce((a, b) => a.pipe(b))
		lastTransform.pipe(new class extends PipelineReceiverStep {
			process (document: DocumentWrapper) {
				const fields = me.getFieldsFromDoc(document)
				me.props.onUpdateProject('resultRecords', me.props.resultRecords.concat(fields))
			}
		})

		pipeTransforms[0].push(this.props.startingUrl.url)
		pipeTransforms[0].finish()
	}
}