import * as $ from 'jquery'
import * as reactRemount from './reactRemount'
import {Collection} from 'backbone'
import DataProject from './inert/backbone/models/dataProject'
import Main from './inert/backbone/views/main'
import SingleValue from './inert/backbone/models/shared/singleValue'

$(reactRemount.remountAll)

const proj1 = new DataProject('Proj1', {
	startingUrls: new Collection([
		new SingleValue('www.gsmarena.com'),
		new SingleValue('www.mediamarkt.de'),
		new SingleValue('www.example.com'),
	]),
	fetchSelectors: new Collection([
		new SingleValue('selector 1'),
		new SingleValue('selector 2'),
	])
})
const proj2 = new DataProject('Proj2')

const projects = new Collection<DataProject>([proj1, proj2])
const main = new Main(projects)
main.setElement('body').render()
main.on('selectProject', (project: DataProject) => console.log(project.getName()))