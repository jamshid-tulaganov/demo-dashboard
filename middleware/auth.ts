export default defineNuxtRouteMiddleware(async (to) => {
    // Skip on server-side for static builds - cookies not available during SSG
    if (import.meta.server) {
        return
    }

    const tokenService = useTokenService()

    const hasAccess = tokenService.hasAccessToken()
    const hasRefresh = tokenService.hasRefreshToken()

    if (to.path === '/login' && hasAccess) {
        return navigateTo('/')
    }

    const publicRoutes = ['/login']
    if (publicRoutes.includes(to.path)) {
        return
    }

    if (!hasAccess) {
        // Try to refresh if we have a refresh token
        if (hasRefresh) {
            try {
                await tokenService.refreshAccessToken()
                // Token refreshed successfully, allow navigation
                return
            } catch(err) {
                console.error("User has error", err)
            }
        }

        // No valid token, redirect to login
        return navigateTo('/login')
    }
})
