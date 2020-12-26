export default class Greeting {
	constructor( message ) {
		this._message = message;
	}

	get message() {
		return this._message;
	}

	set message( m ) {
		this._message = m;
	}

	greet() {
		return `${this.message} !`;
	}
}
