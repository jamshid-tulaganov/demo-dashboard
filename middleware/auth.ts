export default defineNuxtRouteMiddleware(async (to) => {
    const tokenService = useTokenService()

    const hasAccess = tokenService.hasAccessToken()
    const hasRefresh = tokenService.hasRefreshToken()

    // If trying to access login page while authenticated, redirect to home
    if (to.path === '/login' && hasAccess) {
        return navigateTo('/')
    }

    // Public routes that don't require authentication
    const publicRoutes = ['/login']
    if (publicRoutes.includes(to.path)) {
        return
    }

    // Check if user has access token
    if (!hasAccess) {
        // Try to refresh if we have a refresh token
        if (hasRefresh) {
            try {
                await tokenService.refreshAccessToken()
                // Token refreshed successfully, allow navigation
                return
            } catch {
                // Refresh failed, tokens already cleared by service
            }
        }

        // No valid token, redirect to login
        return navigateTo('/login')
    }
})
