import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, debounceAsync, throttle } from '~/shared/lib/utils/debounce';

describe('Debounce Utility', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('debounce', () => {
        it('should debounce function calls', () => {
            const mockFn = vi.fn();
            const debouncedFn = debounce(mockFn, 300);

            debouncedFn();
            debouncedFn();
            debouncedFn();

            expect(mockFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(300);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should pass arguments correctly', () => {
            const mockFn = vi.fn();
            const debouncedFn = debounce(mockFn, 300);

            debouncedFn('test', 123);

            vi.advanceTimersByTime(300);

            expect(mockFn).toHaveBeenCalledWith('test', 123);
        });

        it('should reset timer on multiple calls', () => {
            const mockFn = vi.fn();
            const debouncedFn = debounce(mockFn, 300);

            debouncedFn();
            vi.advanceTimersByTime(200);
            debouncedFn();
            vi.advanceTimersByTime(200);

            expect(mockFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should use default wait time', () => {
            const mockFn = vi.fn();
            const debouncedFn = debounce(mockFn);

            debouncedFn();

            vi.advanceTimersByTime(299);
            expect(mockFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('debounceAsync', () => {
        it('should debounce async function calls', async () => {
            const mockAsyncFn = vi.fn().mockResolvedValue('result');
            const debouncedFn = debounceAsync(mockAsyncFn, 300);

            const promise = debouncedFn();

            vi.advanceTimersByTime(300);

            const result = await promise;

            expect(result).toBe('result');
            expect(mockAsyncFn).toHaveBeenCalledTimes(1);
        });

        it('should reject previous calls when new call is made', async () => {
            const mockAsyncFn = vi.fn().mockResolvedValue('result');
            const debouncedFn = debounceAsync(mockAsyncFn, 300);

            const promise1 = debouncedFn();
            vi.advanceTimersByTime(100);
            const promise2 = debouncedFn();

            await expect(promise1).rejects.toThrow('Debounced');

            vi.advanceTimersByTime(300);

            const result = await promise2;
            expect(result).toBe('result');
        });

        it('should handle async errors', async () => {
            const mockAsyncFn = vi.fn().mockRejectedValue(new Error('Test error'));
            const debouncedFn = debounceAsync(mockAsyncFn, 300);

            const promise = debouncedFn();

            vi.advanceTimersByTime(300);

            await expect(promise).rejects.toThrow('Test error');
        });
    });

    describe('throttle', () => {
        it('should throttle function calls', () => {
            const mockFn = vi.fn();
            const throttledFn = throttle(mockFn, 300);

            throttledFn();
            throttledFn();
            throttledFn();

            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        it('should allow calls after wait time', () => {
            const mockFn = vi.fn();
            const throttledFn = throttle(mockFn, 300);

            throttledFn();
            expect(mockFn).toHaveBeenCalledTimes(1);

            vi.advanceTimersByTime(300);

            throttledFn();
            expect(mockFn).toHaveBeenCalledTimes(2);
        });

        it('should pass first call arguments', () => {
            const mockFn = vi.fn();
            const throttledFn = throttle(mockFn, 300);

            throttledFn('first', 1);
            throttledFn('second', 2);

            expect(mockFn).toHaveBeenCalledWith('first', 1);
            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });
});
