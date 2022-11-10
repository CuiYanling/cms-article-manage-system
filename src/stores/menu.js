import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
    //state
    let isCollapsed = ref(false);

    //getters
    let icon = computed(() => isCollapsed.value ? 'Expand' : 'Fold')
    //action
    let toggle = () => {
        isCollapsed.value = !isCollapsed.value;
    };

    //返回一个对象
    return {
        isCollapsed,
        icon,
        toggle,
    }
})
