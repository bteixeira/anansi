import * as $ from 'jquery'
import * as reactRemount from './reactRemount'
import {Collection} from 'backbone'
import DataProject, {StartingUrl} from './inert/backbone/models/dataProject'
import Main from './inert/backbone/views/main'

$(reactRemount.remountAll)

const proj1 = new DataProject('Proj1', {startingUrls: new Collection([
		new StartingUrl('www.gsmarena.com'),
		new StartingUrl('www.mediamarkt.de'),
		new StartingUrl('www.example.com'),
	])})
const proj2 = new DataProject('Proj2')

const projects = new Collection<DataProject>([proj1, proj2])
const main = new Main(projects)
main.setElement('body').render()
main.on('selectProject', (project: DataProject) => console.log(project.getName()))