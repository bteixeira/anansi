import * as $ from 'jquery'
import * as reactRemount from './reactRemount'
import {Collection} from 'backbone'
import DataProject from './inert/backbone/models/dataProject'
import Main from './inert/backbone/views/main'

$(reactRemount.remountAll)

const proj1 = new DataProject('Proj1', {resultUrl: 'Sel1'})
const proj2 = new DataProject('Proj2', {resultUrl: 'Sel2'})

const projects = new Collection<DataProject>([proj1, proj2])
const main = new Main(projects)
main.setElement('body').render()
main.on('selectProject', (project: DataProject) => console.log(project.getName()))