export default class DIContainer extends Map<string, any> {

	/**
	 * Extend super method `get` for throwing exception
	 * when value not found because this situation is very unexpected.
	 *
	 */
	get(key) {
		if (!this.has(key)) {
			const errorMessage = `Impossible to inject \`${key}\`.`;
			if (process.env.NODE_ENV !== 'test') {
				console.error(errorMessage); /* eslint no-console: 0 */
			}
			throw new Error(errorMessage);
		}
		return super.get(key);
	}

	include(container: DIContainer) {
		for (const obj of container.entries()) {
			const [key, value] = obj;
			this.set(key, value);
		}
	}

	/**
	 * Add all keys with values of object to injector.
	 * @param {Object} object
	 */
	setObject(object) {
		Object.keys(object).forEach(key => {
			this.set(key, object[key]);
		});
	}

	/**
	 * Add all keys with values of class to injector.
	 * @param {Class} class
	 */
	setClass(object) {
		const keys = Object.getOwnPropertyNames(object.prototype);
		keys.forEach(key => {
			if (key !== 'constructor') {
				this.set(key, object[key]);
			}
		});
	}
}
