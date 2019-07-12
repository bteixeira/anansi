import PipelineReceiverStep from './pipelineReceiverStep'
import TransformUtils, {DocumentWrapper} from './transformUtils'

type DataCallback = (url: string) => void

export default class PipelineFetchStep extends PipelineReceiverStep {
	private dataCallbacks: DataCallback[] = []

	constructor (private selector: string) {
		super()
	}

	onData (callback: DataCallback): void {
		this.dataCallbacks.push(callback)
	}

	private emit (url: string): void {
		this.dataCallbacks.forEach(cb => cb(url))
	}

	process (document: DocumentWrapper): void {
		const links: string[] = TransformUtils.getLinksFromDocument(document, this.selector)
		links.forEach(link => this.emit(link))
	}

	pipe<T extends PipelineReceiverStep> (receiver: T): T {
		this.onData(data => receiver.push(data))
		this.onFinished(() => receiver.finish())
		return receiver
	}
}