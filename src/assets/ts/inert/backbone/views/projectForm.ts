import {View} from 'backbone'
import DataProject from '../models/dataProject'

export default class ProjectForm extends View {
	private $inputName: JQuery

	constructor (private project: DataProject) {
		super()
	}

	setProject (project: DataProject): void {
		this.project = project
		this.$inputName.val(project.getName())
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
				<div class="form-row form-group">
					<div class="col">
						<input
								type="url"
								class="form-control form-control-sm --projectForm--inputStartingUrl"
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
					<div class="col-auto">
						<button
							class="btn btn-danger btn-sm"
							type="button"
						>
							&times;
						</button>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<button class="btn btn-primary">+</button>
					</div>
				</div>
				<hr/>
				<div class="row">
					<div class="col">
						<h3>Fetch Transforms</h3>
					</div>
				</div>
				{
					this.props.fetchSelectors.map((fetchSelector, i) =>
						<FetchSelector
								selector={fetchSelector}
								onDelete={() => this.props.onUpdateProject(
										'fetchSelectors',
										this.props.fetchSelectors.filter((fs, j) => (i !== j))
								)}
								onChange={newValue => this.updateFetchSelector(i, {selector: newValue})}
						/>
					)
				}
				<div class="row">
					<div class="col">
						<button type="button" class="btn btn-primary" onClick={() => this.props.onUpdateProject(
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
		return this
	}
}