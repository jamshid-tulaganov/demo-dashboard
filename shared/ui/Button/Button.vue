<script setup lang="ts">
interface Props {
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    size?: 'large' | 'middle' | 'small';
    loading?: boolean;
    disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
    type: 'default',
    size: 'middle',
    loading: false,
    disabled: false,
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

</script>
