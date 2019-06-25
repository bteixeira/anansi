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
			new Promise((resolve, reject) => {
				this.fetchDocument(url).then(text => {
					resolve({url: url, body: text})
				}).catch(reject)
			})
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

	public static pipeTransforms (urls: string[], selectors: string[]): Promise<DocumentWrapper[]> {
		let promise = TransformUtils.fetchUrls(...urls)

		selectors.forEach(selector => {
			promise = promise.then(wrappers => {
				return this.singleTransformStep(wrappers, selector)
			})
		})

		return promise
	}

	public static fetchDocument (url: string): Promise<string> {
		return window.fetch(`api/fetch?url=${url}`).then(response => response.text())
	}
}