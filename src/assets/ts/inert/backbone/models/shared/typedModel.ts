import {Model} from 'backbone'

export default class TypedModel<T extends { [key: string]: any }> {
	private model: Model

	constructor (data?: Partial<T>) { // TODO MAYBE IT SHOULDN'T BE PARTIAL
		this.model = new Model(data)
	}

	get<K extends keyof T> (key: K): T[K] {
		return this.model.get(key as string) // TODO NO IDEA WHY THIS NEEDS CAST
	}
}

type Shape1 = {
	thing: string
	other: number
}

let coiso1 = new TypedModel<Shape1>()
let coiso2 = new TypedModel<Shape1>({})
// let coiso3 = new TypedModel<Shape1>({thing: 3})

// coiso1.get('ddd')
coiso1.get('thing')