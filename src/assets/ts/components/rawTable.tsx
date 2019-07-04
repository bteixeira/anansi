import ResultsTable from './resultsTable'
import * as React from 'react'

export default class RawTable extends ResultsTable {
	render () {
		return <textarea value={this.getRawText()} className="form-control text-monospace anansi-raw-data" readOnly rows={10}/>
	}

	getRawText (): string {
		const orderedKeys: string[] = this.getFieldNames()
		return orderedKeys.join('\t') + '\n' + this.props.records.map(record => (
			orderedKeys.map(key => (record[key] || '').replace(/[\n\t]+/g, ' ').trim()).join('\t')
		)).join('\n')
	}
}