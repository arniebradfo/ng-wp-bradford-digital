import {
	Component,
	Input,
	HostBinding,
	ChangeDetectionStrategy
} from '@angular/core';
// import { Status } from '../../../mobius.enums';

/** J5:
 * this component requires icon-defs.component to be loaded into the root component
 * icon-defs.component contains svg <symbol> tags that this components references in <use> tags

 * TODO: import some singlton service that adds the icon-defs.component to the root component once
**/

@Component({
	selector: 'ngwp-icon',
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {

	@Input() name: string = 'icon_X';

	constructor() { }

}
