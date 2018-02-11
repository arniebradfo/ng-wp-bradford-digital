import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngwp-example',
  template: `
    <ng-content></ng-content>
    <p>this content is part of the Angular template</p>
  `
})
export class ExampleComponent implements OnInit {

  input: string;

  constructor() { }

  ngOnInit() {
    console.log(this.input);
  }

}

@Component({
  selector: 'ngwp-example-2',
  template: `
    <ng-content></ng-content>
    <p>this is another example template</p>
  `
})
export class ExampleTwoComponent extends ExampleComponent {}

