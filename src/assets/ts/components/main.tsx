import * as React from 'react'
import ProjectsList from './projectsList'
import ProjectForm from './projectForm'

export type Dictionary = {[index: string]: string}

export interface DataProject {
	name: string
	startingUrl: string
	fetchSelectors: string[]
	fixedFieldName: string
	fixedFieldSelector: string
	fixedFieldXpath: string
	dynamicFieldSelector: string
	dynamicFieldNameScript: string
	dynamicFieldValueScript: string
	resultUrl: string
	resultRecords: Dictionary[]
}

interface Props {}
interface State {
	selectedProjectIndex: number,
	projects: DataProject[],
}

export default class Main extends React.Component<Props, State> {
	constructor (props: Props) {
		super(props)
		this.state = {
			selectedProjectIndex: 0,
			projects: [{
				name: 'GSM Arena All Casio',
				startingUrl: 'https://www.gsmarena.com/makers.php3',
				fetchSelectors: [
						'.st-text a[href="casio-phones-77.php"]',
						'#review-body li a',
				],
				fixedFieldName: 'Name',
				fixedFieldSelector: '.specs-phone-name-title',
				fixedFieldXpath: 'text()',
				dynamicFieldSelector: '#specs-list tr',
				dynamicFieldNameScript: `$el.find('.ttl').text().trim() || $el.find('th').text().trim()`,
				dynamicFieldValueScript: '$el.find(\'.nfo\').text()',
				resultUrl: '',
				resultRecords: [],
			}]
		}
	}

	updateCurrentProject (fieldName: string, newValue: string): void {
		this.setState(prevState => ({
			projects: prevState.projects.map((project, i) => {
				if (i === this.state.selectedProjectIndex) {
					return {
						...project,
						[fieldName]: newValue,
					}
				} else {
					return project
				}
			})
		}))
	}

	render () {
		return (
				<div className="container-fluid">
					<div className="row">
						<div className="col-2">
							<ProjectsList
									projectNames={this.state.projects.map(p => p.name)}
									selectedProjectIndex={this.state.selectedProjectIndex}
									onSelectProject={newIndex => this.setState({selectedProjectIndex: newIndex})}
									onAddNewProject={() => {
										this.setState(prevState => ({
											projects: prevState.projects.concat({
												name: 'New Project',
												startingUrl: '',
												fetchSelectors: [],
												fixedFieldName: '',
												fixedFieldSelector: '',
												fixedFieldXpath: '',
												dynamicFieldSelector: '',
												dynamicFieldNameScript: '',
												dynamicFieldValueScript: '',
												resultUrl: '',
												resultRecords: [],
											})
										}))
									}}
							/>
						</div>
						<div className="col">
							<ProjectForm
									{...this.state.projects[this.state.selectedProjectIndex]}
									onUpdateProject={(fieldName, newValue) => {
										this.updateCurrentProject(fieldName, newValue)
									}}
							/>
						</div>
					</div>
				</div>
		)
	}
}