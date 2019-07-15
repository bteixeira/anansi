import {View} from 'backbone'
import DataProject from '../models/dataProject'
import StartingUrlList from './projectForm/startingUrlList'
import SingleValue from '../models/shared/singleValue'
import FetchTransformList from './projectForm/fetchTransformList'
import FetchTransform from '../models/fetchTransform'

export default class ProjectForm extends View {
	private $inputName: JQuery
	private $$startingUrlList: StartingUrlList
	private $$fetchTransformList: FetchTransformList

	constructor (private project: DataProject) {
		super()
	}

	setProject (project: DataProject): void {
		this.project = project
		this.$inputName.val(project.getName())
		this.$$startingUrlList.setCollection(project.getStartingUrls())
		this.$$startingUrlList.render()
		this.$$fetchTransformList.setCollection(project.getFetchSelectors())
	}

	render (): View {
		this.$el.html(`
			<div class="container-fluid">
				<hr/>
				<div class="row">
					<div class="col">
						<h3>Data Project</h3>
					</div>
				</div>
				<div class="form-row form-group">
					<label class="col-auto col-form-label">
						Name
					</label>
					<div class="col">
						<input
								type="text"
								class="form-control --projectForm--inputName"
								name="name"
								value=${this.project.getName()}
						/>
					</div>
					<div class="col-auto">
						<button class="btn btn-danger --projectForm--buttonDelete" type="button">
							Delete Project
						</button>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<div class="btn-group">
							<button
									type="button"
									class="btn btn-primary --projectForm--buttonDelete"
							>
								Go
							</button>
						</div>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<h4>Starting URLs</h4>
					</div>
				</div>
				<div class="row">
					<div class="col --projectForm--startingUrls"></div>
				</div>
				<div class="row">
					<div class="col">
						<button class="btn btn-primary --projectForm--buttonAddStartingUrl">+</button>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<h4>Fetch Transforms</h4>
					</div>
				</div>
				<div class="row">
					<div class="col --projectForm--fetchTransforms"></div>
				</div>
				<div class="row">
					<div class="col">
						<button class="btn btn-primary --projectForm--buttonAddFetchTransform">+</button>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<h3>Field Mapping</h3>
					</div>
				</div>
				<div class="row">
					<div class="col">
						Fixed Field name
						<input
								type="text"
								class="form-control"
								name="fixedFieldName"
								value={this.props.fixedFieldName}
								onChange={this.onUpdateField}
						/>
					</div>
					<div class="col">
						Fixed Field selector
						<input
								type="text"
								class="form-control"
								name="fixedFieldSelector"
								value={this.props.fixedFieldSelector}
								onChange={this.onUpdateField}
						/>
					</div>
					<div class="col">
						Fixed Field xpath
						<input
								type="text"
								class="form-control"
								name="fixedFieldXpath"
								value={this.props.fixedFieldXpath}
								onChange={this.onUpdateField}
						/>
					</div>
				</div>
				<div class="row">
					<div class="col">
						Dynamic Field selector
						<input
								type="text"
								class="form-control"
								name="dynamicFieldSelector"
								value={this.props.dynamicFieldSelector}
								onChange={this.onUpdateField}
						/>
					</div>
					<div class="col">
						Dynamic Field name script
						<input
								type="text"
								class="form-control"
								name="dynamicFieldNameScript"
								value={this.props.dynamicFieldNameScript}
								onChange={this.onUpdateField}
						/>
					</div>
					<div class="col">
						Dynamic Field value script
						<input
								type="text"
								class="form-control"
								name="dynamicFieldValueScript"
								value={this.props.dynamicFieldValueScript}
								onChange={this.onUpdateField}
						/>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<h3>Output</h3>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<ResultsTable records={this.props.resultRecords}/>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<RawTable records={this.props.resultRecords}/>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<div class="btn-group">
							<button
									type="button"
									class="btn btn-primary"
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
		`)
		this.$inputName = this.$('.--projectForm--inputName')
		this.$inputName.on('input', (ev: JQuery.ChangeEvent<HTMLInputElement>) => {
			this.project.setName(ev.target.value)
		})

		this.$('.--projectForm--buttonDelete').on('click', () => {
			if (window.confirm('Delete this project?')) {
				this.project.destroy()
			}
		})

		this.$$startingUrlList = new StartingUrlList(this.project.getStartingUrls())
		this.$$startingUrlList.setElement(this.$('.--projectForm--startingUrls'))
		this.$$startingUrlList.render()
		this.$('.--projectForm--buttonAddStartingUrl').on('click', () => {
			const startingUrl = new SingleValue('')
			this.project.getStartingUrls().add(startingUrl)
		})

		this.$$fetchTransformList = new FetchTransformList(this.project.getFetchSelectors())
		this.$$fetchTransformList.setElement(this.$('.--projectForm--fetchTransforms'))
		this.$$fetchTransformList.render()
		this.$('.--projectForm--buttonAddFetchTransform').on('click', () => {
			const fetchTransform = new FetchTransform('')
			this.project.getFetchSelectors().add(fetchTransform)
		})

		return this
	}
}