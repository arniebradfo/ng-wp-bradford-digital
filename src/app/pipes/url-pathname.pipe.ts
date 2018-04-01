import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'urlPathname'
})
export class UrlPathnamePipe implements PipeTransform {

	transform(url: string, args?: any): any {
		return new URL(url).pathname;
	}

}
