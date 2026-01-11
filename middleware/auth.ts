export default defineNuxtRouteMiddleware(async (to, from) => {
    const accessToken = useCookie('access')
    const refreshToken = useCookie('refresh')

    // If trying to access login page while authenticated, redirect to home
    if (to.path === '/login' && accessToken.value) {
        return navigateTo('/')
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/login']
    if (publicRoutes.includes(to.path)) {
        return
    }

    // Check if user has access token
    if (!accessToken.value) {
        // Try to refresh token if refresh token exists
        if (refreshToken.value) {
            try {
                const config = useRuntimeConfig()
                const response = await $fetch<{ accessToken: string; refreshToken: string }>(
                    '/auth/refresh',
                    {
                        baseURL: config.public.apiBaseUrl,
                        method: 'POST',
                        body: {
                            refreshToken: refreshToken.value,
                            expiresInMins: 60,
                        },
                    }
                )

                // Update tokens
                accessToken.value = response.accessToken
                refreshToken.value = response.refreshToken

                // Allow navigation
                return
            } catch (error) {
                console.error('Token refresh failed in middleware:', error)
                // Clear invalid tokens
                accessToken.value = null
                refreshToken.value = null
            }
        }

        // No valid token, redirect to login
        return navigateTo('/login')
    }
})
