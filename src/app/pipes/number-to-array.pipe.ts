import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberToArray'
})
export class NumberToArrayPipe implements PipeTransform {

	transform(value: number): undefined[] {
		return new Array(value).fill(undefined);
	}

}
