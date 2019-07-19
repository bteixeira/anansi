import transformUtils, {DocumentWrapper} from './transformUtils'
import TransformStep from './transformStep'

export default class FetchOnlyStep extends TransformStep<string, DocumentWrapper> {
	process (url: string, done: (() => void)): void {
		transformUtils.fetchDocument(url)
				.then(result => {
					this.onData.trigger(result)
				})
				.catch(reason => {
					this.onError.trigger(reason)
				})
				.finally(() => {
					done()
				})
	}
}