import type { UseFetchOptions } from '#app'
import type { FetchOptions } from 'ofetch'

export const useApiClient = () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || '/api'
    const locale = useCookie('locale')
    const accessToken = useCookie('access')
    const loading = ref(false)

    // Common headers function
    function getHeaders(customHeaders?: HeadersInit) {
        return {
            ...customHeaders,
            'Accept-Language': locale.value || 'uz',
            ...(accessToken.value
                ? {
                      Authorization: `Bearer ${accessToken.value}`,
                  }
                : {}),
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
                credentials: 'include'
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

    // Client-side methods using $fetch (for mutations/actions)
    function createFetchOptions(options?: FetchOptions): FetchOptions {
        return {
            ...options,
            baseURL,
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

    const client = {
        async get<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return $fetch<T>(url, createFetchOptions({ ...options, method: 'GET' }))
        },

        async post<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return $fetch<T>(url, createFetchOptions({ ...options, method: 'POST' }))
        },

        async put<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return $fetch<T>(url, createFetchOptions({ ...options, method: 'PUT' }))
        },

        async patch<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return $fetch<T>(url, createFetchOptions({ ...options, method: 'PATCH' }))
        },

        async delete<T = any>(url: string, options?: FetchOptions): Promise<T> {
            return $fetch<T>(url, createFetchOptions({ ...options, method: 'DELETE' }))
        },
    }

    return {
        fetch,
        client,
        loading: readonly(loading),
        baseURL,
    }
}
