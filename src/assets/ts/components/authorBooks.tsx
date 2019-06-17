import * as React from 'react'
import {AuthorInstance} from '../../../server/models/author'
import {BookInstance} from '../../../server/models/book'

interface Props {
	author: AuthorInstance;
	books: BookInstance[];
}
interface State {
	books: BookInstance[];
}

export default class AuthorBooks extends React.Component<Props, State> {
	constructor (props: Props) {
		super(props)
		this.state = {
			books: this.props.books,
		}
	}
	render () {
		return (
			<div className="container">
				<h1>{this.props.author.name}</h1>
				<p>Here are the books by this author:</p>
				<table className="table table-striped table-bordered">
					<thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th/>
					</tr>
					</thead>
					<tbody>
					{this.state.books.map(book => {
						return (
							<tr key={book.id}>
								<td>{book.id}</td>
								<td>{book.title}</td>
								<td>
									<button
										type="button"
										className="btn btn-sm btn-primary"
										onClick={this.onClickEdit.bind(this, book)}
									>
										Edit
									</button>
									{'\n'}
									<button
										type="button"
										className="btn btn-sm btn-danger"
										onClick={this.onClickDelete.bind(this, book)}
									>
										Delete
									</button>
								</td>
							</tr>
						)
					})}
					</tbody>
				</table>
				<p>
					<button
						type="button"
						className="btn btn-primary btn-lg"
						onClick={this.onClickNew.bind(this)}
					>
						New Book
					</button>
				</p>
				<p>
					<a href="/">Back to authors index</a>
				</p>
			</div>
		)
	}

	async onClickNew () {
		const title = window.prompt('What is the book\'s title?')
		const response = await window.fetch(`/api/authors/${this.props.author.id}/books`, {
			method: 'POST',
			headers: {'Content-type': 'application/json'},
			body: JSON.stringify({title}),
		})
		// TODO MUST HANDLE ERROR
		const book: BookInstance = await response.json()
		this.setState(state => ({
			books: state.books.concat(book)
		}))
	}

	async onClickDelete (book: BookInstance) {
		const {id, title} = book
		if (window.confirm(`Really delete "${title}"?`)) {
			await window.fetch(`/api/books/${id}`, {
				method: 'DELETE',
			})
			// TODO MUST HANDLE ERROR
			this.setState(state => ({
				books: state.books.filter(book => book.id !== id)
			}))
		}
	}

	async onClickEdit (book: BookInstance) {
		const title = window.prompt('What is the new title?', book.title)
		const {id} = book
		if (title) {
			const response = await window.fetch(`/api/books/${id}`, {
				method: 'PUT',
				headers: {'Content-type': 'application/json'},
				body: JSON.stringify({title}),
			})
			// TODO MUST HANDLE ERROR
			const newBook: BookInstance = await response.json()
			const newBooks = this.state.books.map(book => (book.id === id) ? newBook : book)
			this.setState({
				books: newBooks,
			})
		}
	}
}
