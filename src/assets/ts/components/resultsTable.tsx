import * as React from 'react'

interface Status {
}

interface Props {
	records: { [index: string]: string }[],
}

export default class ResultsTable extends React.Component<Props, Status> {
	constructor (props: Props) {
		super(props)
	}

	render () {
		const orderedKeys: string[] = this.getFieldNames()
		return <table className="table">
			<thead>
				<tr>{
					orderedKeys.map(fieldName => <th>{fieldName}</th>)
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

	private getFieldNames (): string[] {
		const bigObject = Object.assign({}, ...this.props.records)
		return Object.keys(bigObject)
	}
}