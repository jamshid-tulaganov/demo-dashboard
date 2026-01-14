import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApiClient } from '~/shared/lib/api/useApiClient';

export interface UserHair {
    color: string;
    type: string;
}

export interface UserAddress {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
}

export interface UserCompany {
    name: string;
    department: string;
    title: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName?: string;
    middleName?: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password?: string;
    birthDate: string;
    image: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    eyeColor?: string;
    hair?: UserHair;
    address?: UserAddress;
    university?: string;
    company?: UserCompany;
    ein?: string;
    ssn?: string;
    userAgent?: string;
    role?: string;
    status?: string;
}

export interface UsersResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}

export interface UserFilters {
    ageMin?: number;
    ageMax?: number;
    gender?: string;
    role?: string;
    status?: string;
}

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([]);
    const currentUser = ref<User | null>(null);
    const total = ref(0);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const newlyCreatedIds = ref<Set<number>>(new Set());

    const getAllUsers = computed(() => users.value);
    const getUserById = computed(() => (id: number) =>
        users.value.find((u) => u.id === id)
    );
    const isLoading = computed(() => loading.value);
    const hasMore = computed(() => users.value.length < total.value);

    async function fetchUsers(limit = 30, skip = 0) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const response = await client.get<UsersResponse>(
                `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
            );

            if (skip === 0) {
                users.value = response.users;
            } else {
                users.value = [...users.value, ...response.users];
            }

            total.value = response.total;
            return response;
        } catch (err: any) {
            error.value = 'Failed to fetch users';
            console.error('Users fetch error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function fetchUserById(id: number) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const user = await client.get<User>(
                `https://dummyjson.com/users/${id}`
            );

            currentUser.value = user;
            return user;
        } catch (err: any) {
            error.value = 'Failed to fetch user details';
            console.error('User fetch error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function searchUsers(query: string) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const response = await client.get<UsersResponse>(
                `https://dummyjson.com/users/search?q=${query}`
            );

            users.value = response.users;
            total.value = response.total;
            return response;
        } catch (err: any) {
            error.value = 'Failed to search users';
            console.error('Users search error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function filterUsers(key: string, value: string) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const response = await client.get<UsersResponse>(
                `https://dummyjson.com/users/filter?key=${key}&value=${value}`
            );

            users.value = response.users;
            total.value = response.total;
            return response;
        } catch (err: any) {
            error.value = 'Failed to filter users';
            console.error('Users filter error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function addUser(userData: Omit<User, 'id'>) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();
            const newUser = await client.post<User>(
                'https://dummyjson.com/users/add',
                { body: userData }
            );

            newlyCreatedIds.value.add(newUser.id);

            users.value = [newUser, ...users.value];
            total.value += 1;

            return newUser;
        } catch (err: any) {
            error.value = 'Failed to add user';
            console.error('User add error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateUser(id: number, userData: Partial<User>) {
        loading.value = true;
        error.value = null;

        try {
            const index = users.value.findIndex((u) => u.id === id);

            if (newlyCreatedIds.value.has(id)) {
                const currentUserData = users.value[index];
                const updatedUser = { ...currentUserData, ...userData };

                if (index > -1) {
                    users.value[index] = updatedUser;
                }
                currentUser.value = updatedUser;

                return updatedUser;
            }

            const { client } = useApiClient();
            const updatedUser = await client.patch<User>(
                `https://dummyjson.com/users/${id}`,
                { body: userData }
            );

            const mergedUser = index > -1
                ? { ...users.value[index], ...updatedUser }
                : updatedUser;

            currentUser.value = mergedUser;

            if (index > -1) {
                users.value[index] = mergedUser;
            }

            return mergedUser;
        } catch (err: any) {
            error.value = 'Failed to update user';
            console.error('User update error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteUser(id: number) {
        loading.value = true;
        error.value = null;

        try {
            if (newlyCreatedIds.value.has(id)) {
                users.value = users.value.filter((u) => u.id !== id);
                total.value -= 1;
                newlyCreatedIds.value.delete(id);

                return true;
            }

            const { client} = useApiClient();
            await client.delete(`https://dummyjson.com/users/${id}`);

            users.value = users.value.filter((u) => u.id !== id);
            total.value -= 1;

            return true;
        } catch (err: any) {
            error.value = 'Failed to delete user';
            console.error('User delete error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteMultipleUsers(ids: number[]) {
        loading.value = true;
        error.value = null;

        try {
            const { client } = useApiClient();

            const realUserIds = ids.filter(id => !newlyCreatedIds.value.has(id));
            const newUserIds = ids.filter(id => newlyCreatedIds.value.has(id));

            if (realUserIds.length > 0) {
                await Promise.all(
                    realUserIds.map(id => client.delete(`https://dummyjson.com/users/${id}`))
                );
            }

            newUserIds.forEach(id => newlyCreatedIds.value.delete(id));

            users.value = users.value.filter((u) => !ids.includes(u.id));
            total.value -= ids.length;

            return true;
        } catch (err: any) {
            error.value = 'Failed to delete users';
            console.error('Users bulk delete error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function toggleUserStatus(id: number, status: string) {
        loading.value = true;
        error.value = null;

        const index = users.value.findIndex((u) => u.id === id);

        // Get old status - if user doesn't have a status field, default to 'active'
        const oldStatus = index > -1 ? (users.value[index].status || 'active') : 'active';

        // Optimistically update the UI first
        if (index > -1) {
            users.value[index] = { ...users.value[index], status };
        }

        try {
            // For newly created users, just update locally
            if (newlyCreatedIds.value.has(id)) {
                return users.value[index];
            }

            // Use PATCH to send only the status field
            const { client } = useApiClient();
            await client.patch<User>(
                `https://dummyjson.com/users/${id}`,
                { body: { status } }
            );

            // API doesn't return status in response, so keep our optimistic update
            // The status is already set in the users.value[index] above

            return users.value[index];
        } catch (err: any) {
            // Revert the optimistic update on error
            if (index > -1) {
                users.value[index] = { ...users.value[index], status: oldStatus };
            }
            error.value = 'Failed to toggle user status';
            console.error('User status toggle error:', err);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateUserRole(id: number, role: string) {
        return updateUser(id, { role });
    }

    function clearUsers() {
        users.value = [];
        total.value = 0;
    }

    return {
        users,
        currentUser,
        total,
        loading,
        error,
        getAllUsers,
        getUserById,
        isLoading,
        hasMore,
        fetchUsers,
        fetchUserById,
        searchUsers,
        filterUsers,
        addUser,
        updateUser,
        deleteUser,
        deleteMultipleUsers,
        toggleUserStatus,
        updateUserRole,
        clearUsers,
    };
});
