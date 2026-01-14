interface RefreshResponse {
    accessToken: string
    refreshToken: string
}

interface TokenServiceState {
    isRefreshing: boolean
    refreshPromise: Promise<RefreshResponse> | null
    failedQueue: Array<{
        resolve: (token: string) => void
        reject: (error: Error) => void
    }>
}

// Module-level state to ensure singleton behavior across all composable instances
const state: TokenServiceState = {
    isRefreshing: false,
    refreshPromise: null,
    failedQueue: [],
}

export const useTokenService = () => {
    const config = useRuntimeConfig()

    const accessToken = useCookie('access', {
        maxAge: 60 * 60, // 1 hour
        sameSite: 'lax',
    })

    const refreshToken = useCookie('refresh', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
    })

    /**
     * Get current access token
     */
    function getAccessToken(): string | null {
        return accessToken.value ?? null
    }

    /**
     * Get current refresh token
     */
    function getRefreshToken(): string | null {
        return refreshToken.value ?? null
    }

    /**
     * Set tokens after login
     */
    function setTokens(access: string, refresh: string): void {
        accessToken.value = access
        refreshToken.value = refresh
    }

    /**
     * Clear all tokens (logout)
     */
    function clearTokens(): void {
        accessToken.value = null
        refreshToken.value = null
    }

    /**
     * Check if user has valid access token
     */
    function hasAccessToken(): boolean {
        return !!accessToken.value
    }

    /**
     * Check if user has refresh token
     */
    function hasRefreshToken(): boolean {
        return !!refreshToken.value
    }

    /**
     * Process queued requests after successful refresh
     */
    function processQueue(error: Error | null, token: string | null): void {
        state.failedQueue.forEach((promise) => {
            if (error) {
                promise.reject(error)
            } else if (token) {
                promise.resolve(token)
            }
        })
        state.failedQueue = []
    }

    /**
     * Refresh access token with queue management
     * Ensures only one refresh request is made at a time
     * Multiple concurrent 401s will wait for the same refresh
     */
    async function refreshAccessToken(): Promise<string> {
        // If no refresh token, reject immediately
        if (!refreshToken.value) {
            const error = new Error('No refresh token available')
            processQueue(error, null)
            throw error
        }

        // If already refreshing, queue this request
        if (state.isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                state.failedQueue.push({ resolve, reject })
            })
        }

        state.isRefreshing = true

        try {
            const response = await $fetch<RefreshResponse>('/auth/refresh', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                body: {
                    refreshToken: refreshToken.value,
                    expiresInMins: 60,
                },
            })

            // Update tokens
            accessToken.value = response.accessToken
            refreshToken.value = response.refreshToken

            // Process queued requests with new token
            processQueue(null, response.accessToken)

            return response.accessToken
        } catch (error: any) {
            // Clear tokens on refresh failure
            clearTokens()

            // Reject all queued requests
            const refreshError = new Error('Token refresh failed')
            processQueue(refreshError, null)

            throw refreshError
        } finally {
            state.isRefreshing = false
            state.refreshPromise = null
        }
    }

    /**
     * Check if a refresh is currently in progress
     */
    function isRefreshing(): boolean {
        return state.isRefreshing
    }

    return {
        // Token getters
        getAccessToken,
        getRefreshToken,
        hasAccessToken,
        hasRefreshToken,

        // Token setters
        setTokens,
        clearTokens,

        // Refresh logic
        refreshAccessToken,
        isRefreshing,

        // Direct cookie refs (for reactivity)
        accessToken: readonly(accessToken),
        refreshToken: readonly(refreshToken),
    }
}
