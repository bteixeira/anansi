import {Request, Response, Router} from 'express'
import * as glue from '../glue'
import Tryout1 from '../../assets/ts/components/tryout1'
import apiRouter from './apiRouter'

const defaultRouter = Router()

defaultRouter.get('/', (request: Request, response: Response) => {
	glue.render(response, 'tryout1', Tryout1, {})
})

defaultRouter.use('/api/', apiRouter)

export default defaultRouter
