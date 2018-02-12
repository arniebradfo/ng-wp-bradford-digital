import {
  Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
  DoCheck, ElementRef, EventEmitter, Injector, Input, OnDestroy,
  Output, ViewEncapsulation
} from '@angular/core';
import { EmbeddableComponentsService } from '../../shortcodes/shortcodes.module';

// based on: https://github.com/wardbell/ng-dynamic-app/blob/master/src/app/docviewer/docviewer.component.ts
// video: https://www.youtube.com/watch?v=__H65AsA_bE&feature=youtu.be&t=2h14m13s

@Component({
  selector: 'ngwp-content',
  template: '<span></span>'
})
export class ContentComponent implements DoCheck, OnDestroy {

  private embeddableComponentFactories: Map<string, ComponentFactory<any>>;
  private embeddedComponentInstances: ComponentRef<any>[] = [];
  private contentElement: HTMLElement;

  @Output()
  contentRendered = new EventEmitter();

  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    elementRef: ElementRef,
    embeddableComponentsService: EmbeddableComponentsService,
    private injector: Injector,
  ) {
    this.contentElement = elementRef.nativeElement;

    // Create factories for each type of embeddable component
    this.createEmbeddedComponentFactories(embeddableComponentsService, componentFactoryResolver);
  }

  @Input()
  set content(content: string) {
    this.onContentChanged();
    if (content) {
      this.build(content);
      this.contentRendered.emit();
    }
  }

  /**
   * Add doc content to host element and build it out with embedded components
   */
  private build(content: string) {

    // security: content is always authored by someone "trustworthy"
    // and is considered to be safe
    this.contentElement.innerHTML = content || '';

    if (!content) return;
    this.createEmbeddedComponentInstances();
  }

  ngDoCheck() {
    this.embeddedComponentInstances.forEach(
      comp => comp.changeDetectorRef.detectChanges()
    );
  }

  ngOnDestroy() {
    this.onContentChanged();
  }

  //// helpers ////

  /**
   * Create the map of EmbeddedComponentFactories, keyed by their selectors.
   * @param embeddableComponents The embedded component classes
   * @param componentFactoryResolver Finds the ComponentFactory for a given Component
   */
  private createEmbeddedComponentFactories(
    embeddableComponents: EmbeddableComponentsService,
    componentFactoryResolver: ComponentFactoryResolver) {

    this.embeddableComponentFactories = new Map<string, ComponentFactory<any>>();

    for (const component of embeddableComponents.components) {
      const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
      const selector = componentFactory.selector;
      this.embeddableComponentFactories.set(selector, componentFactory);
    }
  }

  /**
   * Create and inject embedded components into the current doc content
   * wherever their selectors are found
   **/
  private createEmbeddedComponentInstances() {
    this.embeddableComponentFactories.forEach(
      (componentFactory, selector) => {

      // All current doc elements with this embedded component's selector
      const embeddedComponentElements =
        this.contentElement.querySelectorAll(selector) as any as HTMLElement[];

      // Create an Angular embedded component for each element.
      for (const element of embeddedComponentElements) {
        const content = [Array.from(element.childNodes)];

        // JUST LIKE BOOTSTRAP
        // factory creates the component, using the DocViewer's parent injector,
        // and replaces the given element's content with the component's resolved template.
        // **Security** Simply forwarding the incoming innerHTML which comes from
        // docs authors and as such is considered to be safe.
        const embeddedComponent =
          componentFactory.create(this.injector, content, element);

        // Assume all attributes are also properties of the component; set them.
        const attributes = (element as any).attributes;
        for (const attr of attributes) {
          embeddedComponent.instance[attr.nodeName] = attr.nodeValue;
        }

        this.embeddedComponentInstances.push(embeddedComponent);
      }
    });
  }

  /**
   * Destroy the current embedded component instances
   * or else there will be memory leaks.
   **/
  private onContentChanged() {
    this.embeddedComponentInstances.forEach(comp => comp.destroy());
    this.embeddedComponentInstances.length = 0;
  }
}

