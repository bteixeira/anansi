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
		this.state = Main.deserializeState() || {
			selectedProjectIndex: 0,
			projects: [{
				name: 'New Project',
				startingUrl: '',
				fetchSelectors: [],
				fixedFieldName: '',
				fixedFieldSelector: '',
				fixedFieldXpath: '',
				dynamicFieldSelector: '',
				dynamicFieldNameScript: ``,
				dynamicFieldValueScript: '',
				resultUrl: '',
				resultRecords: [],
			}],
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

	static deserializeState (): State {
		if (typeof window === 'undefined') {
			return null
		}
		const serialized = window.localStorage.getItem('state')
		return JSON.parse(serialized)
	}

	static serializeState (state: State): void {
		if (typeof window === 'undefined') {
			return
		}
		const serialized = JSON.stringify(state)
		window.localStorage.setItem('state', serialized)
	}

	render () {
		Main.serializeState(this.state)
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