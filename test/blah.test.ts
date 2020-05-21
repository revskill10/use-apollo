import { sum } from '../src/blah';
(global as any).__DEV__ = process.env.NODE_ENV !== 'production';
describe('blah', () => {
  it('works', () => {
    expect(sum(1, 1)).toEqual(2);
  });
});
