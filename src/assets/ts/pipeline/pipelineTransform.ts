type DataCallback = (url: string) => void

export default class PipelineTransform {
	private dataCallbacks: DataCallback[] = []

	constructor (private selector: string) {}

	/**
	 *
	 * @param url
	 */
	push (url: string): void {

	}

	private fetch (url: string) {
		// TODO FETCH URL
		// TODO ON DONE, PROCESS LINKS ACCORDING TO SELECTOR
		// TODO FOR EACH GENERATED LINK, ISSUE CALLBACKS
	}



	pipe (other: PipelineTransform): void {

	}

	protected done (): void {}

}