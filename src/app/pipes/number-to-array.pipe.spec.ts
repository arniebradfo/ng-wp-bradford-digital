import { NumberToArrayPipe } from './number-to-array.pipe';

describe('NumberToArrayPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberToArrayPipe();
    expect(pipe).toBeTruthy();
  });
});
