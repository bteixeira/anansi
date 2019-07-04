import * as React from 'react'
import FetchSelector from './fetchSelector'
import ResultsTable from './resultsTable'
import RawTable from './rawTable'
import {DataProject, Dictionary} from './main'
import {ChangeEvent} from 'react'
import TransformUtils, {DocumentWrapper} from '../transformUtils'

interface Props extends DataProject {
	onUpdateProject: (fieldName: string, newValue: any) => void
	onDeleteProject: () => void
}
interface State {}

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
						<div className="col">
							<label>Name</label>
							<input
									type="text"
									className="form-control"
									name="name"
									value={this.props.name}
									onChange={this.onUpdateField}
							/>
						</div>
					</div>
					<div className="form-row">
						<div className="col">
							<button className="btn btn-danger" onClick={this.onClickDelete}>
								Delete Project
							</button>
						</div>
					</div>
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
									name="startingUrl"
									value={this.props.startingUrl}
									onChange={this.onUpdateField}
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
						this.props.fetchSelectors.map((fetchSelector, i) =>
							<FetchSelector
									key={`${i}-${fetchSelector}`}
									value={fetchSelector}
									onDelete={() => this.props.onUpdateProject(
											'fetchSelectors',
											this.props.fetchSelectors.filter((fs, j) => (i !== j))
									)}
									onChange={newValue => this.props.onUpdateProject(
											'fetchSelectors',
											this.props.fetchSelectors.map((fs, j) => (i === j ? newValue : fs))
									)}
							/>
						)
					}
					<div className="row">
						<div className="col">
							<button type="button" className="btn btn-primary" onClick={() => this.props.onUpdateProject(
									'fetchSelectors',
									this.props.fetchSelectors.concat(''),
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

	getFieldsFromDoc (doc: Document): Dictionary {
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
		TransformUtils.pipeTransforms([this.props.startingUrl], this.props.fetchSelectors)
				.then((documents: DocumentWrapper[]) => {
					const newRecords = documents.map(document => {
						const parser = new DOMParser()
						const doc = parser.parseFromString(document.body, 'text/html')
						return this.getFieldsFromDoc(doc)
					})
					this.props.onUpdateProject('resultRecords', newRecords)
				})
	}
}