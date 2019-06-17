import {Request, Response, Router} from 'express'
import * as request from 'request'

const apiRouter = Router()

apiRouter.get('/fetch', (req: Request, res: Response) => {
	const url: string = req.query.url
	request(url).pipe(res)
})

export default apiRouter
