import * as React from 'react'
import {Dictionary} from './main'

interface State {}

interface Props {
	records: Dictionary[],
}

export default class ResultsTable extends React.Component<Props, State> {
	constructor (props: Props) {
		super(props)
	}

	render () {
		const orderedKeys: string[] = this.getFieldNames()
		// TODO SHOULD ADD key TO BOTH LOOPS
		return <table className="table">
			<thead>
				<tr>{
					orderedKeys.map((fieldName, i) => <th key={`${i}-${fieldName}`}>{fieldName}</th>)
				}</tr>
			</thead>
			<tbody>
			{
				this.props.records.map(record => (
						<tr>
							{
								orderedKeys.map(key => (
										<td>{
											record[key]
										}</td>
								))
							}
						</tr>
				))
			}
			</tbody>
		</table>
	}

	protected getFieldNames (): string[] {
		const bigObject = Object.assign({}, ...this.props.records)
		return Object.keys(bigObject)
	}
}