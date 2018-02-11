import { NgwpPage } from './app.po';

describe('ngwp App', () => {
  let page: NgwpPage;

  beforeEach(() => {
    page = new NgwpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
