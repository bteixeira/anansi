import {Request, Response, Router} from 'express'
import * as glue from '../glue'
import Tryout1 from '../../assets/ts/components/tryout1'

const defaultRouter = Router()

defaultRouter.get('/', (request: Request, response: Response) => {
	glue.render(response, 'tryout1', Tryout1, {})
})

export default defaultRouter
