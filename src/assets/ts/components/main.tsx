import * as React from 'react'
import ProjectsList from './projectsList'
import ProjectForm, {fetchState} from './projectForm'

export type Dictionary = {[index: string]: string}

export interface StartingUrl {
	url: string
	fetchState: fetchState
}

export interface DataProject {
	name: string
	startingUrl: StartingUrl
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
				startingUrl: {
					url: '',
					fetchState: fetchState.New,
				},
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
			}),
		}))
	}

	removeCurrentProject (): void {
		this.setState(prevState => ({
			projects: prevState.projects.filter((project, i) => (i !== this.state.selectedProjectIndex)),
			selectedProjectIndex: (prevState.selectedProjectIndex - 1),
		}))
	}

	addNewProject (): void {
		this.setState(prevState => ({
			projects: prevState.projects.concat({
				name: 'New Project',
				startingUrl: {
					url: '',
					fetchState: fetchState.New,
				},
				fetchSelectors: [],
				fixedFieldName: '',
				fixedFieldSelector: '',
				fixedFieldXpath: '',
				dynamicFieldSelector: '',
				dynamicFieldNameScript: '',
				dynamicFieldValueScript: '',
				resultUrl: '',
				resultRecords: [],
			}),
			selectedProjectIndex: prevState.projects.length,
		}))
	}

	static deserializeState (): State {
		if (typeof window === 'undefined') {
			return null
		}
		const serialized = window.localStorage.getItem('state')
		const state: State = JSON.parse(serialized)
		if (state.selectedProjectIndex >= state.projects.length) {
			state.selectedProjectIndex = state.projects.length - 1
		}
		return state
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
					<div className="row bg-dark text-white">
						<div className="col-4 col-md-3 col-lg-2">
							<h2>Anansi</h2>
						</div>
						<div className="col-8 col-md-9 col-lg-10">
							<nav className="nav">
								<a className="nav-link" href="#">Data Sources</a>
								<a className="nav-link" href="#">Data Views</a>
							</nav>
						</div>
					</div>
					<div className="row">
						<div className="col-4 col-md-3 col-lg-2">
							<ProjectsList
									projectNames={this.state.projects.map(p => p.name)}
									selectedProjectIndex={this.state.selectedProjectIndex}
									onSelectProject={newIndex => this.setState({selectedProjectIndex: newIndex})}
									onAddNewProject={() => this.addNewProject()}
							/>
						</div>
						<div className="col-8 col-md-9 col-lg-10">
							<ProjectForm
									{...this.state.projects[this.state.selectedProjectIndex]}
									onUpdateProject={(fieldName, newValue) => {
										this.updateCurrentProject(fieldName, newValue)
									}}
									onDeleteProject={() => this.removeCurrentProject()}
							/>
						</div>
					</div>
				</div>
		)
	}
}