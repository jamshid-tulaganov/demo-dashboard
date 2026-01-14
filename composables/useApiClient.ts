import type { UseFetchOptions } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApiClient = () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || '/api'
    const locale = useCookie('locale')
    const tokenService = useTokenService()
    const loading = ref(false)

    /**
     * Build headers with auth token and locale
     */
    function getHeaders(customHeaders?: HeadersInit): Record<string, string> {
        const token = tokenService.getAccessToken()
        return {
            ...(customHeaders as Record<string, string>),
            'Accept-Language': locale.value || 'uz',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
    }

    /**
     * Handle 401 response - refresh token and retry request
     */
    async function handleUnauthorized<T>(
        requestFn: () => Promise<T>,
        retried = false
    ): Promise<T> {
        try {
            return await requestFn()
        } catch (error: any) {
            // Only retry once and only on 401
            if (error.status === 401 && !retried && tokenService.hasRefreshToken()) {
                try {
                    await tokenService.refreshAccessToken()
                    // Retry the original request with new token
                    return await handleUnauthorized(requestFn, true)
                } catch {
                    // Refresh failed, redirect to login
                    const router = useRouter()
                    tokenService.clearTokens()
                    await router.push('/login')
                    throw new Error('Session expired')
                }
            }
            throw error
        }
    }

    // SSR-friendly methods using useFetch (for data fetching)
    const fetch = {
        get<T = any>(url: string, options?: UseFetchOptions<T>) {
            return useFetch<T>(url, {
                baseURL,
                method: 'GET',
                ...options,
                headers: getHeaders(options?.headers as HeadersInit),
                onRequest({ options }) {
                    options.headers = getHeaders(options.headers as HeadersInit)
                },
                credentials: 'include',
            })
        },

        post<T = any>(url: string, options?: UseFetchOptions<T>) {
            return useFetch<T>(url, {
                baseURL,
                method: 'POST',
                ...options,
                headers: getHeaders(options?.headers as HeadersInit),
                onRequest({ options }) {
                    options.headers = getHeaders(options.headers as HeadersInit)
                },
            })
        },

        put<T = any>(url: string, options?: UseFetchOptions<T>) {
            return useFetch<T>(url, {
                baseURL,
                method: 'PUT',
                ...options,
                headers: getHeaders(options?.headers as HeadersInit),
                onRequest({ options }) {
                    options.headers = getHeaders(options.headers as HeadersInit)
                },
            })
        },

        patch<T = any>(url: string, options?: UseFetchOptions<T>) {
            return useFetch<T>(url, {
                baseURL,
                method: 'PATCH',
                ...options,
                headers: getHeaders(options?.headers as HeadersInit),
                onRequest({ options }) {
                    options.headers = getHeaders(options.headers as HeadersInit)
                },
            })
        },

        delete<T = any>(url: string, options?: UseFetchOptions<T>) {
            return useFetch<T>(url, {
                baseURL,
                method: 'DELETE',
                ...options,
                headers: getHeaders(options?.headers as HeadersInit),
                onRequest({ options }) {
                    options.headers = getHeaders(options.headers as HeadersInit)
                },
            })
        },
    }

    /**
     * Create fetch options with interceptors
     */
    function createFetchOptions(url: string, options?: FetchOptions): FetchOptions {
        const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://')

        return {
            ...options,
            baseURL: isAbsoluteUrl ? undefined : baseURL,
            headers: getHeaders(options?.headers as HeadersInit),
            onRequest({ options }) {
                loading.value = true
                options.headers = getHeaders(options.headers as HeadersInit)
            },
            onResponse() {
                loading.value = false
            },
            onResponseError({ response }) {
                loading.value = false
                console.error('API Error:', response.status, response._data)
            },
        }
    }

    // Client-side methods using $fetch with automatic 401 handling
    const client = {
        async get<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return handleUnauthorized(() =>
                $fetch<T>(url, createFetchOptions(url, { ...options, method: 'GET' }))
            )
        },

        async post<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return handleUnauthorized(() =>
                $fetch<T>(url, createFetchOptions(url, { ...options, method: 'POST' }))
            )
        },

        async put<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return handleUnauthorized(() =>
                $fetch<T>(url, createFetchOptions(url, { ...options, method: 'PUT' }))
            )
        },

        async patch<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return handleUnauthorized(() =>
                $fetch<T>(url, createFetchOptions(url, { ...options, method: 'PATCH' }))
            )
        },

        async delete<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return handleUnauthorized(() =>
                $fetch<T>(url, createFetchOptions(url, { ...options, method: 'DELETE' }))
            )
        },
    }

    return {
        fetch,
        client,
        loading: readonly(loading),
        baseURL,
    }
}
