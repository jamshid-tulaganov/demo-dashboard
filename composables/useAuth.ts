import type { FetchOptions } from 'ofetch'

interface LoginCredentials {
    username: string
    password: string
    expiresInMins?: number
}

interface AuthResponse {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender: string
    image: string
    accessToken: string
    refreshToken: string
}

interface RefreshResponse {
    accessToken: string
    refreshToken: string
}

export const useAuth = () => {
    const config = useRuntimeConfig()
    const router = useRouter()
    const accessToken = useCookie('access', {
        maxAge: 60 * 60, // 1 hour
        sameSite: 'lax',
    })
    const refreshToken = useCookie('refresh', {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
    })
    const user = useState<AuthResponse | null>('auth-user', () => null)
    const loading = ref(false)

    /**
     * Login with username and password
     */
    async function login(credentials: LoginCredentials) {
        loading.value = true
        try {
            const response = await $fetch<AuthResponse>('/auth/login', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                body: {
                    username: credentials.username,
                    password: credentials.password,
                    expiresInMins: credentials.expiresInMins || 60,
                },
            })

            // Store tokens
            accessToken.value = response.accessToken
            refreshToken.value = response.refreshToken

            // Store user data
            user.value = response

            return response
        } catch (error: any) {
            console.error('Login failed:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async function refresh() {
        if (!refreshToken.value) {
            throw new Error('No refresh token available')
        }

        try {
            const response = await $fetch<RefreshResponse>('/auth/refresh', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                body: {
                    refreshToken: refreshToken.value,
                    expiresInMins: 60,
                },
            })

            // Update access token
            accessToken.value = response.accessToken
            refreshToken.value = response.refreshToken

            return response
        } catch (error: any) {
            console.error('Token refresh failed:', error)
            // If refresh fails, logout user
            await logout()
            throw error
        }
    }

    /**
     * Get current authenticated user
     */
    async function getCurrentUser() {
        if (!accessToken.value) {
            return null
        }

        try {
            const response = await $fetch<AuthResponse>('/auth/me', {
                baseURL: config.public.apiBaseUrl,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken.value}`,
                },
            })

            user.value = response
            return response
        } catch (error: any) {
            console.error('Failed to get current user:', error)

            // If unauthorized, try to refresh token
            if (error.status === 401 && refreshToken.value) {
                try {
                    await refresh()
                    // Retry getting user
                    return await getCurrentUser()
                } catch (refreshError) {
                    await logout()
                    throw refreshError
                }
            }

            throw error
        }
    }

    /**
     * Logout user
     */
    async function logout() {
        accessToken.value = null
        refreshToken.value = null
        user.value = null

        // Redirect to login
        await router.push('/login')
    }

    /**
     * Check if user is authenticated
     */
    function isAuthenticated() {
        return !!accessToken.value
    }

    return {
        user: readonly(user),
        loading: readonly(loading),
        isAuthenticated,
        login,
        logout,
        refresh,
        getCurrentUser,
    }
}
