
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExampleTwoComponent, ExampleComponent } from './example/example.component';

// based on: https://github.com/wardbell/ng-dynamic-app/blob/master/src/app/embedded/embedded.module.ts
// video: https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s

/**
 *
 * based on: https://github.com/wardbell/ng-dynamic-app/blob/master/src/app/embedded/embedded.module.ts
 * video: https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s
 *
 * LIMITATIONS OF "EMBEDDABLE" COMPONENTS:
 * - cannot bind to dynamic @Input properties
 * - cannot interact with component content with @ContentChild
 * - cannot nest embeddable components (maybe...)
 * - no lazy loading (maybe...)
 * - CAN use an embeddable as a wrapper for a fully functional component
 *
 * this should be done a different way once Angualr Elements are finalized:
 * https://www.youtube.com/watch?v=vHI5C-9vH-E
 *
 * Any components or services used inside embedded components must be declared or imported here.
 * It is not enough just to import them inside the AppModule.
 *
 */

/** Components that can be embedded in docs such as CodeExampleComponent */
export const embeddableComponents: any[] = [
  ExampleTwoComponent,
  ExampleComponent,
];

/** Injectable service that returns embeddable components */
export class EmbeddableComponentsService {
  components = embeddableComponents;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    embeddableComponents,
    // non-embedded components that are used by embeddable components
    // { go here }
  ],
  providers: [
    EmbeddableComponentsService,
    // other services needed only by these components
    // { go here }
  ],
  entryComponents: [ embeddableComponents ]
})
export class ShortcodesModule { }

