import { useTokenService } from './useTokenService'

interface LoginCredentials {
    username: string
    password: string
    expiresInMins?: number
}

interface AuthUser {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender: string
    image: string
}

interface AuthResponse extends AuthUser {
    accessToken: string
    refreshToken: string
}

export const useAuth = () => {
    const config = useRuntimeConfig()
    const router = useRouter()
    const tokenService = useTokenService()

    const user = useState<AuthUser | null>('auth-user', () => null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Login with username and password
     */
    async function login(credentials: LoginCredentials): Promise<AuthUser> {
        loading.value = true
        error.value = null

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

            // Store tokens via token service
            tokenService.setTokens(response.accessToken, response.refreshToken)

            // Store user data (without tokens)
            const userData: AuthUser = {
                id: response.id,
                username: response.username,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                gender: response.gender,
                image: response.image,
            }
            user.value = userData

            return userData
        } catch (err: any) {
            error.value = err?.data?.message || 'Login failed'
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Refresh access token using token service
     */
    async function refresh(): Promise<string> {
        return tokenService.refreshAccessToken()
    }

    /**
     * Get current authenticated user
     */
    async function getCurrentUser(): Promise<AuthUser | null> {
        if (!tokenService.hasAccessToken()) {
            return null
        }

        try {
            const response = await $fetch<AuthUser>('/auth/me', {
                baseURL: config.public.apiBaseUrl,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokenService.getAccessToken()}`,
                },
            })

            user.value = response
            return response
        } catch (err: any) {
            // If unauthorized, try to refresh token
            if (err.status === 401 && tokenService.hasRefreshToken()) {
                try {
                    await refresh()
                    // Retry getting user with new token
                    return await getCurrentUser()
                } catch {
                    await logout()
                    return null
                }
            }

            throw err
        }
    }

    /**
     * Logout user and clear all auth state
     */
    async function logout(): Promise<void> {
        tokenService.clearTokens()
        user.value = null
        error.value = null

        await router.push('/login')
    }

    /**
     * Check if user is authenticated
     */
    function isAuthenticated(): boolean {
        return tokenService.hasAccessToken()
    }

    /**
     * Initialize auth state on app start
     * Call this in a plugin or layout
     */
    async function initAuth(): Promise<void> {
        if (tokenService.hasAccessToken() && !user.value) {
            try {
                await getCurrentUser()
            } catch {
                // Silent fail - user will be redirected by middleware if needed
            }
        }
    }

    return {
        // State
        user: readonly(user),
        loading: readonly(loading),
        error: readonly(error),

        // Methods
        login,
        logout,
        refresh,
        getCurrentUser,
        isAuthenticated,
        initAuth,
    }
}
