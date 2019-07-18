/* Imports */
import * as path from 'path'
import * as express from 'express'
import {NextFunction, Request, Response} from 'express'

import defaultRouter from './routers/defaultRouter'
import * as glue from './glue'
import Logger = require('bunyan')

/* Inits */
const app = express()
const PORT = 3000

app.locals.logger = glue.logger
app.locals.sequelize = glue.sequelize
var n = 10000 /* Counter for request id */

/* Middleware */
app.use(express.json())
app.use((request: Request, response: Response, next: NextFunction) => {
	const logger = glue.logger.child({requestId: n++})
	logger.info(request.method, request.path)
	response.locals.logger = logger
	next()
})

/* Routing */
app.use('/', defaultRouter)
app.use('/', express.static(path.resolve(__dirname, '../../public')))

/* Error handling */
app.use((error: any, request: Request, response: Response, next: NextFunction) => {
	(response.locals.logger as Logger).error(`(${response.statusCode}) ${error}`)
	next()
})

/* Start app */
app.listen(PORT, () => {
	glue.logger.info(`App started on port ${PORT}`)
})
