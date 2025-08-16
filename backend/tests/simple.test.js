// Simple test to verify Jest is working
describe('Simple Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with async operations', async () => {
    const result = await Promise.resolve('test');
    expect(result).toBe('test');
  });
});
