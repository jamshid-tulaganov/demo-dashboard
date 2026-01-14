export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
    };
}

export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
    func: T,
    wait: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timeout: NodeJS.Timeout | null = null;
    let latestResolve: ((value: ReturnType<T>) => void) | null = null;
    let latestReject: ((reason?: any) => void) | null = null;

    return function executedFunction(...args: Parameters<T>): Promise<ReturnType<T>> {
        return new Promise((resolve, reject) => {
            if (timeout) {
                clearTimeout(timeout);
                if (latestReject) {
                    latestReject(new Error('Debounced'));
                }
            }

            latestResolve = resolve;
            latestReject = reject;

            timeout = setTimeout(async () => {
                timeout = null;
                try {
                    const result = await func(...args);
                    if (latestResolve === resolve) {
                        resolve(result);
                    }
                } catch (error) {
                    if (latestReject === reject) {
                        reject(error);
                    }
                }
            }, wait);
        });
    };
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    let lastResult: any;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            lastResult = func(...args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, wait);
        }

        return lastResult;
    };
}
