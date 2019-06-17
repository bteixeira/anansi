import * as glue from '../glue'
import * as Sequelize from 'sequelize'
import Author from './author'

export interface BookAttributes {
	id?: number;
	title: string;
	AuthorId: number;
}

export type BookInstance = Sequelize.Instance<BookAttributes> & BookAttributes;

const Book = glue.sequelize.define<BookInstance, BookAttributes>('Book', {
	title: Sequelize.STRING,
	AuthorId: Sequelize.INTEGER,
})

// Book.belongsTo(Author)

// Book.associate = function (models) {
// 	associations can be defined here
// }

export default Book
