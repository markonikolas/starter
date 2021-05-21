import { flatten, flattenDeep } from 'lodash-es';

function testingFlatten() {
	const deepArray = [
		[
			'string', 'another string', [ 1, 2, 3 ],
		],
		[
			'123', [ 4, 5, 6 ],
		],
	];
	
	return [
		flatten( deepArray ),
		flattenDeep( deepArray ),
	];
}

const flattenArrays = testingFlatten();
console.log( ... flattenArrays );
