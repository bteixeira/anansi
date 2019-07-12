import List from './list'

export default class Main {
	private $el = $('#main')
	private $$list = new List(/* projects collection */)
	private $$form

	render () {
		this.$el.html(`
			<div class="row">
				<div class="col"></div>
				<div class="col"></div>
			</div>
		`)
	}
}