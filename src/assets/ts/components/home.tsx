import * as React from 'react'
import {AuthorInstance} from '../../../server/models/author'

interface HomeProps {authors: AuthorInstance[];}
interface HomeState {authors: AuthorInstance[];} // TODO THEY'RE BOTH THE SAME

export default class Home extends React.Component<HomeProps, HomeState> {
	constructor (props: HomeProps) {
		super(props)
		this.state = {
			authors: this.props.authors,
		}
	}
	render () {
		return (
			<div className="container">
				<h1>Hello World!</h1>
				<p>Here are some authors:</p>
				<table className="table table-striped table-bordered">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th/>
						</tr>
					</thead>
					<tbody>
						{this.state.authors.map(author => {
							return (
								<tr key={author.id}>
									<td>{author.id}</td>
									<td>{author.name}</td>
									<td>
										<a href={`authors/${author.id}`}>Books</a>
										{'\n'}
										<button
											type="button"
											className="btn btn-sm btn-primary"
											onClick={this.onClickEdit.bind(this, author)}
										>
											Edit
										</button>
										{'\n'}
										<button
											type="button"
											className="btn btn-sm btn-danger"
											onClick={this.onClickDelete.bind(this, author)}
										>
											Delete
										</button>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
				<div>
					<button
						type="button"
						className="btn btn-primary btn-lg"
						onClick={this.onClickNew.bind(this)}
					>
						New Author
					</button>
				</div>
			</div>
		)
	}

	async onClickNew () {
		const name = window.prompt('What is the author\'s name?')
		const response = await window.fetch('/api/authors', {
			method: 'POST',
			headers: {'Content-type': 'application/json'},
			body: JSON.stringify({name}),
		})
		// TODO MUST HANDLE ERROR
		const author: AuthorInstance = await response.json()
		this.setState(state => ({
			authors: state.authors.concat(author)
		}))
	}

	async onClickDelete (author: AuthorInstance) {
		const {id, name} = author
		if (window.confirm(`Really delete ${name}?`)) {
			await window.fetch(`/api/authors/${id}`, {
				method: 'DELETE',
			})
			// TODO MUST HANDLE ERROR
			this.setState(state => ({
				authors: state.authors.filter(author => author.id !== id)
			}))
		}
	}

	async onClickEdit (author: AuthorInstance) {
		const name = window.prompt('What is the new name?', author.name)
		const {id} = author
		if (name) {
			const response = await window.fetch(`/api/authors/${id}`, {
				method: 'PUT',
				headers: {'Content-type': 'application/json'},
				body: JSON.stringify({name}),
			})
			// TODO MUST HANDLE ERROR
			const newAuthor: AuthorInstance = await response.json()
			const newAuthors = this.state.authors.map(author => (author.id === id) ? newAuthor : author)
			this.setState({
				authors: newAuthors,
			})
		}
	}
}
