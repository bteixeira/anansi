import {Collection, View} from 'backbone'
import DataProject from '../models/dataProject'
import List from './list'
import ProjectForm from './projectForm'

export default class Main extends View {
	private $$list: List
	private $$form: ProjectForm

	constructor (projects: Collection<DataProject>) {
		super()
		this.$$list = new List(projects, projects.first())
		this.$$form = new ProjectForm(projects.first())
	}

	render (): View {
		this.$el.html(`
			<div class="container-fluid">
				<div class="row bg-dark text-white">
					<div class="col-4 col-md-3 col-lg-2">
						<h2>Anansi</h2>
					</div>
					<div class="col-8 col-md-9 col-lg-10">
						<nav class="nav">
							<a class="nav-link" href="#">Data Sources</a>
							<a class="nav-link" href="#">Data Views</a>
						</nav>
					</div>
				</div>
				<div class="row">
					<div class="col-4 col-md-3 col-lg-2 --main--list"></div>
					<div class="col-8 col-md-9 col-lg-10 --main--form"></div>
				</div>
			</div>
		`)

		this.$$list.render()
		this.$('.--main--list').append(this.$$list.$el)
		this.$$list.on('selectProject', project => this.$$form.setProject(project))

		this.$$form.render()
		this.$('.--main--form').append(this.$$form.$el)
		return this
	}
}