class ListItem {
	private $el
	constructor (private model = null) {
		this.$el = $('<div class="list-item"></div>')
		this.model.on('remove, destroy', () => {this.$el.remove()})
		this.model.on('change', () => this.render())
	}

	render () {
		this.$el.html(this.model.getName())
	}
}

export default class List {
	private $el

	constructor (private collection = null) {}

	setElement ($element): void {
		this.$el = $element
	}

	render () {
		this.collection.forEach(model => {
			const $$item = new ListItem(model)
			$$item.on('click', () => this.trigger('clicked', model))
			this.$el.append($$item.$el)
		})
	}
}