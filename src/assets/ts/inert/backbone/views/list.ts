import {Collection, View} from 'backbone'
import DataProject from '../models/dataProject'

export default class List extends View {
	private listItemsByProject = new Map<DataProject, JQuery>()

	constructor (private projects: Collection<DataProject>, private selectedProject: DataProject = projects.first()) {
		super()
		projects.forEach((project: DataProject) => {
			const $listItem = this.renderListItem(project)
			this.listItemsByProject.set(project, $listItem)
		})
		projects.on('add', (project: DataProject) => {
			const $listItem = this.renderListItem(project)
			this.listItemsByProject.set(project, $listItem)
			this.$('.list-group').append($listItem)
		})
		projects.on('remove', (project: DataProject) => {
			if (project === this.selectedProject) {
				this.selectProject(this.projects.first())
			}
			const $listItem = this.listItemsByProject.get(project)
			$listItem.remove()
			this.listItemsByProject.delete(project)
		})
		projects.on('change:name', (project: DataProject) => {
			this.listItemsByProject.get(project).text(project.getName())
		})
	}

	private selectProject (project: DataProject): void {
		if (project === this.selectedProject) {
			return
		}

		const $selectedItem = this.listItemsByProject.get(this.selectedProject)
		$selectedItem.removeClass('active')

		const $newSelectedItem = this.listItemsByProject.get(project)
		$newSelectedItem.toggleClass('active', true)

		this.selectedProject = project

		this.trigger('selectProject', project)
	}

	renderListItem (project: DataProject): JQuery {
		const $listItem = $(`
			<li
			 		class="list-group-item list-group-item-action anansi-clickable text-truncate"
			 		title="${project.getName()}"
	        >
				${project.getName()}
			</li>
		`)
		if (project === this.selectedProject) {
			$listItem.addClass('active')
		}
		$listItem.on('click', () => this.selectProject(project))
		return $listItem
	}

	render (): View {
		this.$el.html(`
			<hr/>
			<ul class="list-group"/>
			<hr/>
			<button
					type="button"
					class="btn btn-primary text-truncate"
			>
				+ Project
			</button>
		`)
		const $list = this.$('.list-group')
		this.listItemsByProject.forEach(($listItem: JQuery) => {
			$list.append($listItem)
		})
		const $button = this.$('button')
		$button.on('click', () => {
			const project = new DataProject('New Project')
			this.projects.add(project)
		})
		return this
	}
}