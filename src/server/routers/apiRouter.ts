import {Request, Response, Router} from 'express'
import * as request from 'request'
import Logger = require('bunyan')

const apiRouter = Router()

apiRouter.get('/fetch', (req: Request, res: Response) => {
	const url: string = req.query.url
	const handleError = (error: Error) => {
		(res.locals.logger as Logger).error(error.message)
		res.status(400).end(error.message)
	}
	try {
		request.get(url).on('error', handleError).pipe(res)
	} catch (error) {
		handleError(error)
	}
})

export default apiRouter
