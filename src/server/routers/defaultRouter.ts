import {Request, Response, Router} from 'express'
import Home from '../../assets/ts/components/home'
import AuthorBooks from '../../assets/ts/components/authorBooks'
import * as glue from '../glue'
import Author, {AuthorInstance} from '../models/author'
import apiRouter from './apiRouter'
import Book from '../models/book'

const defaultRouter = Router()

console.log(Book)

defaultRouter.get('/', (request: Request, response: Response) => {
	response.locals.logger.info('Hello from the controller')
	Author.findAll().then((authors: AuthorInstance[]) => {
		glue.render(response, 'home', Home, {
			authors: authors,
		})
	})
})

defaultRouter.get('/authors/:authorId', (request: Request, response: Response) => {
	Author.findById(
		request.params.authorId,
		{
			include: [{
				model: Book,
			}],
		}
	).then((author: AuthorInstance) => {
		glue.render(response, 'authorBooks', AuthorBooks, {
			author: author,
			books: author.Books,
		})
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

defaultRouter.use('/api/', apiRouter)

export default defaultRouter
