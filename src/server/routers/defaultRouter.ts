import {Request, Response, Router} from 'express'
import * as glue from '../glue'
import apiRouter from './apiRouter'
import Main from '../../assets/ts/components/main'
import defaultLayout from '../layouts/defaultLayout'

const defaultRouter = Router()

defaultRouter.get('/', (request: Request, response: Response) => {
	glue.render(response, 'main', Main, {}, false)
})

defaultRouter.get('/inert', (request: Request, response: Response) => {
	const content = defaultLayout('')
	response.send(content)
})

defaultRouter.use('/api/', apiRouter)

export default defaultRouter
