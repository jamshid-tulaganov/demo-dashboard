<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
    open: boolean;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
    icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    open: false,
});

const emit = defineEmits<{
    'update:open': [value: boolean];
}>();

const { t } = useI18n();

// Mock notifications data - you can replace this with real API data later
const notifications = ref<Notification[]>([
    // Empty for now - will show empty state
]);

const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
);

const handleClose = () => {
    emit('update:open', false);
};

const markAsRead = (id: number) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
        notification.read = true;
    }
};

const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true);
};

const deleteNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
};

const clearAll = () => {
    notifications.value = [];
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case 'success': return 'text-green-500';
        case 'warning': return 'text-yellow-500';
        case 'error': return 'text-red-500';
        default: return 'text-blue-500';
    }
};

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'warning';
        case 'error': return 'error';
        default: return 'info';
    }
};

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};
</script>

<template>
    <a-drawer
        :open="open"
        :title="t('header.notifications.title')"
        placement="right"
        :width="400"
        @close="handleClose"
        class="notifications-drawer"
    >
        <!-- Header Actions -->
        <template #extra>
            <div class="flex items-center gap-2" v-if="notifications.length > 0">
                <a-button
                    type="text"
                    size="small"
                    @click="markAllAsRead"
                    v-if="unreadCount > 0"
                >
                    {{ t('header.notifications.markAllRead') }}
                </a-button>
                <a-button
                    type="text"
                    size="small"
                    danger
                    @click="clearAll"
                >
                    {{ t('header.notifications.clearAll') }}
                </a-button>
            </div>
        </template>

        <!-- Empty State -->
        <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center h-full py-12">
            <div class="w-24 h-24 mb-4 rounded-full bg-gray-100 dark:bg-dark-tertiary flex items-center justify-center">
                <Icon name="notification" :size="48" class="text-gray-400 dark:text-dark-text-secondary" />
            </div>
            <h3 class="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                {{ t('header.notifications.empty.title') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-dark-text-secondary text-center max-w-sm">
                {{ t('header.notifications.empty.description') }}
            </p>
        </div>

        <!-- Notifications List -->
        <div v-else class="space-y-2">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item p-4 rounded-lg border transition-all cursor-pointer"
                :class="{
                    'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800': !notification.read,
                    'bg-white dark:bg-dark-secondary border-gray-200 dark:border-dark-quaternary': notification.read,
                    'hover:shadow-md': true
                }"
                @click="markAsRead(notification.id)"
            >
                <div class="flex items-start gap-3">
                    <!-- Icon -->
                    <div
                        class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        :class="`bg-${notification.type === 'info' ? 'blue' : notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : 'red'}-100 dark:bg-${notification.type === 'info' ? 'blue' : notification.type === 'success' ? 'green' : notification.type === 'warning' ? 'yellow' : 'red'}-900/20`"
                    >
                        <Icon
                            :name="getNotificationIcon(notification.type)"
                            :size="20"
                            :class="getNotificationColor(notification.type)"
                        />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-2 mb-1">
                            <h4 class="font-medium text-light-text-primary dark:text-dark-text-primary">
                                {{ notification.title }}
                            </h4>
                            <button
                                @click.stop="deleteNotification(notification.id)"
                                class="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Icon name="close" :size="16" />
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-dark-text-secondary mb-2">
                            {{ notification.message }}
                        </p>
                        <span class="text-xs text-gray-400 dark:text-dark-text-tertiary">
                            {{ formatTimestamp(notification.timestamp) }}
                        </span>
                    </div>
                </div>

                <!-- Unread Indicator -->
                <div
                    v-if="!notification.read"
                    class="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"
                ></div>
            </div>
        </div>
    </a-drawer>
</template>

<style scoped>
.notifications-drawer :deep(.ant-drawer-header) {
    @apply bg-light-menu dark:bg-dark-secondary;
    @apply border-b border-gray-200 dark:border-dark-quaternary;
}

.notifications-drawer :deep(.ant-drawer-title) {
    @apply text-light-text-primary dark:text-dark-text-primary;
    @apply font-semibold;
}

.notifications-drawer :deep(.ant-drawer-body) {
    @apply bg-light-bg dark:bg-dark-primary;
    @apply p-4;
}

.notifications-drawer :deep(.ant-drawer-close) {
    @apply text-light-text-primary dark:text-dark-text-primary;
}

.notification-item {
    position: relative;
}
</style>
