import {Request, Response, Router} from 'express'
import * as glue from '../glue'
import apiRouter from './apiRouter'
import Main from '../../assets/ts/components/main'

const defaultRouter = Router()

defaultRouter.get('/', (request: Request, response: Response) => {
	glue.render(response, 'main', Main, {}, false)
})

defaultRouter.use('/api/', apiRouter)

export default defaultRouter
