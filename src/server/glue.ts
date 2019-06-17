import * as fs from 'fs'
import * as path from 'path'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import defaultLayout from './layouts/defaultLayout'
import {Response} from 'express'
import * as Sequelize from 'sequelize'
import * as databaseConfig from '../../config/database.json' // TODO MUST GET THIS FROM .sequelizerc
import * as bunyan from 'bunyan'
import * as BunyanFormat from 'bunyan-format'

/**
 * Escapes a string to be usable in a double-quoted HTML attribute.
 * NOT SAFE FOR ANY OTHER USAGE (including single-quoted attributes)
 */
function escapeForHtml (str: string) {
	return str.
			replace(/&/g, '&amp;').
			replace(/>/g, '&gt;').
			replace(/</g, '&lt;').
			replace(/"/g, '&quot;')
}

export function render<T> (response: Response, componentPath: string, reactClass: React.ComponentClass<T>, props: T) {
	const element = React.createElement(reactClass, props)
	const elementMarkup = ReactDOMServer.renderToString(element)
	const wrapperMarkup = `
		<div
			data-react-class="${escapeForHtml(componentPath)}"
			data-react-props="${escapeForHtml(JSON.stringify(props))}"
		>${elementMarkup}</div>
	`
	const documentMarkup = defaultLayout(wrapperMarkup)
	response.send(documentMarkup)
}

export const sequelize = new Sequelize(databaseConfig.development)
sequelize.authenticate()

export const LOG_DIR = 'log'
if (!fs.existsSync(LOG_DIR)){
	fs.mkdirSync(LOG_DIR);
}
export const logger = bunyan.createLogger({
	name: 'webstrap', // TODO CONFIG
	streams: [
		{stream: new BunyanFormat({outputMode: 'short'})},
		{path: path.join(LOG_DIR, 'webstrap.log')},
	],
	level: 'debug', // TODO CONFIG
})
