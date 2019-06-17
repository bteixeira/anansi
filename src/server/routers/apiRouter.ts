import {Request, Response, Router} from 'express'
import Author, {AuthorInstance} from '../models/author'
import Book, {BookInstance} from '../models/book'

const apiRouter = Router()

/*** Authors ***/

apiRouter.post('/authors', (request: Request, response: Response) => {
	const {name} = request.body
	Author.create({name}).then((author: AuthorInstance) => {
		response.status(201).json(author)
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

apiRouter.delete('/authors/:id', (request: Request, response: Response) => {
	const {id} = request.params
	Author.destroy({where: {id}}).then((count: number) => {
		response.status(204).send()
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

apiRouter.put('/authors/:id', (request: Request, response: Response) => {
	const {id} = request.params
	const {name} = request.body
	Author.update({name}, {where: {id}, returning: true}).then((result: [number, AuthorInstance[]]) => {
		const author: AuthorInstance = result[1][0]
		response.status(200).json(author)
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

/*** Books ***/

apiRouter.post('/authors/:id/books', (request: Request, response: Response) => {
	const {title} = request.body
	Book.create({
		AuthorId: request.params.id,
		title,
	}).then((book: BookInstance) => {
		response.status(201).json(book)
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

apiRouter.delete('/books/:id', (request: Request, response: Response) => {
	const {id} = request.params
	Book.destroy({where: {id}}).then((count: number) => {
		response.status(204).send()
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

apiRouter.put('/books/:id', (request: Request, response: Response) => {
	const {id} = request.params
	const {title} = request.body
	Book.update({title}, {where: {id}, returning: true}).then((result: [number, BookInstance[]]) => {
		const book: BookInstance = result[1][0]
		response.status(200).json(book)
	}).catch(err => {
		console.error(err) // TODO REPLACE WITH LOGGER
		response.status(500).json(err)
	})
})

export default apiRouter
