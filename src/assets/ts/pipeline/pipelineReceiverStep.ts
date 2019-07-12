import transformUtils, {DocumentWrapper} from './transformUtils'

type FinishedCallback = () => void

export default abstract class PipelineReceiverStep {
	private finishedCallbacks: FinishedCallback[] = []
	private finished: boolean = false

	finish (): void {
		this.finished = true
		this.finishedCallbacks.forEach(cb => cb())
	}

	onFinished (callback: FinishedCallback): void {
		this.finishedCallbacks.push(callback)
	}

	push (url: string): void {
		transformUtils.fetchDocument(url).then(document => {
			this.process(document)
		})
	}

	abstract process (document: DocumentWrapper): void
}