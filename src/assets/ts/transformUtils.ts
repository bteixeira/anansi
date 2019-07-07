export interface DocumentWrapper {
	url: string,
	body: string,
}

export default class TransformUtils {
	/**
	 * Returns a Promise that resolves with an array of DocumentWrappers
	 * @param urls
	 */
	public static fetchUrls (...urls: string[]): Promise<DocumentWrapper[]> {
		const promises: Promise<DocumentWrapper>[] = urls.map(url =>
			this.fetchDocument(url)
		)

		return Promise.all(promises)
	}

	/**
	 *
	 * @param wrapper
	 * @param selector
	 */
	public static getLinksFromDocument (wrapper: DocumentWrapper, selector: string): string[] {
		const parser = new DOMParser()
		const doc = parser.parseFromString(wrapper.body, 'text/html')
		const $links = $(doc).find(selector)
		return $links.map((i, link) => {
			const $link = $(link)
			return new URL($link.attr('href'), wrapper.url).href
		}).get()
	}

	public static singleTransformStep (wrappers: DocumentWrapper[], selector: string): Promise<DocumentWrapper[]> {
		const links: string[] = wrappers
				.map(wrapper => TransformUtils.getLinksFromDocument(wrapper, selector))
				.reduce((accum, links) => accum.concat(links))
		return TransformUtils.fetchUrls(...links)
	}

	public static pipeTransforms (documents: DocumentWrapper[], selectors: string[]): Promise<DocumentWrapper[]> {
		let promise: Promise<DocumentWrapper[]> = Promise.resolve(documents)

		selectors.forEach(selector => {
			promise = promise.then(wrappers => {
				return this.singleTransformStep(wrappers, selector)
			})
		})

		return promise
	}

	public static fetchDocument (url: string): Promise<DocumentWrapper> {
		return window.fetch(`api/fetch?url=${url}`).then(response => response.text()).then(text => {
			return {url: url, body: text}
		})
	}
}