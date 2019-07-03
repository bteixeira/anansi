import * as React from 'react'

interface Props {
	projectNames: string[],
	selectedProjectIndex: number,
	onSelectProject: (newIndex: number) => void,
	onAddNewProject: () => void,
}

interface State {}

export default class ProjectsList extends React.Component<Props, State> {
	constructor (props: Props) {
		super(props)
	}

	render () {
		return (
				<React.Fragment>
					<hr/>
					<ul className="list-group">
						{
							this.props.projectNames.map((projectName, i) => (
									<li className={`
										list-group-item
										list-group-item-action
										anansi-clickable
										${i === this.props.selectedProjectIndex ? 'active' : ''}
									`} onClick={() => {this.props.onSelectProject(i)}}>
							 			{projectName}
							 		</li>
							))
						}
					</ul>
					<hr/>
					<button type="button" className="btn btn-primary" onClick={() => this.props.onAddNewProject()}>
						+ Project
					</button>
				</React.Fragment>
		)
	}
}