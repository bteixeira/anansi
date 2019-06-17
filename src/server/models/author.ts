import * as glue from '../glue'
import * as Sequelize from 'sequelize'
import Book, {BookInstance} from './book'

export interface AuthorAttributes {
	id?: number;
	name: string;
	Books?: BookInstance[];
}

export type AuthorInstance = Sequelize.Instance<AuthorAttributes> & AuthorAttributes;

const Author = glue.sequelize.define<AuthorInstance, AuthorAttributes>('Author', {
	name: Sequelize.STRING,
})

Author.hasMany(Book)

export default Author
