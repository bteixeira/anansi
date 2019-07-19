import TransformStep from './transformStep'
import transformUtils, {DocumentWrapper} from './transformUtils'

export default class LinksOnlyStep extends TransformStep<DocumentWrapper, string> {
	constructor (private selector: string) {
		super()
	}

	process (document: DocumentWrapper, done: (() => void)): void {
		transformUtils.getLinksFromDocument(document, this.selector).forEach((link: string) => {
			this.emit(link)
		})
		done()
	}
}