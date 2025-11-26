/**
 * @copyright Copyright (c) 2018-2025 Richard Huang <rickypc@users.noreply.github.com>
 * @description Unit tests for example.ts.
 * @file example.test.ts
 * @license AGPL-3.0-or-later
 */

const example = require('#root/src/example');

describe('example.ts', () => {
  // Concurrent for style; single test runs like sequential.
  test.concurrent('runs the example and returns the expected string', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const result = await example();

    expect(result).toBe('Timeable Promise Examples');
    expect(spy).toHaveBeenNthCalledWith(1, '1. Chunk ->', [[1, 2], [3, 4]]);
    expect(spy).toHaveBeenNthCalledWith(2, '2. Concurrent -> ran', 'a, b, c', 'at once -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(3, '3. Concurrents -> ran groups', '[a, b] + [c]', 'at once -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(4, '4. Consecutive -> ran', 'a -> b -> c', 'one by one -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(5, '5. Consecutives -> ran groups', '[a, b] -> [c]', 'one group at a time -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(6, '6. Parallel -> ran', 'a, b, c', 'in parallel -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(7, '7. Poll -> ticked repeatedly until stopped');
    expect(spy).toHaveBeenNthCalledWith(8, '8. Sequential -> ran', 'a -> b -> c', 'in series -> all fulfilled');
    expect(spy).toHaveBeenNthCalledWith(9, '9. Sleep -> paused ~1ms');
    expect(spy).toHaveBeenNthCalledWith(10, '10. ToNumber -> "1" ->', 1);
    expect(spy).toHaveBeenNthCalledWith(11, '11. Settle -> finished before timeout -> return', true);
    expect(spy).toHaveBeenNthCalledWith(12, '12. Timeout -> took too long -> rejected -> return', false);
    expect(spy).toHaveBeenNthCalledWith(13, '13. WaitFor -> waited ~3ms until condition met');

    spy.mockRestore();
  });
});
