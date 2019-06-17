import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'

export function remountAll () {
	$('[data-react-class]').each((i, el) => {
		const dataClass = el.dataset.reactClass
		const dataProps = el.dataset.reactProps
		const reactClass = require('./components/' + dataClass).default
		const props = JSON.parse(dataProps)

		const element = React.createElement(reactClass, props)
		if ($(el).children().length) {
			ReactDOM.hydrate(element, el)
		} else {
			ReactDOM.render(element, el)
		}
	})
}
