<template >
    <Teleport to="body">
        <div v-if="visible" :class="['db-message', type]">
            <Icon class="db-icon" />{{ msg }}
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { Teleport, ref, computed, watch, onMounted } from 'vue'
import {
    Info,
    Error,
    Success,
    Warning
} from '../../icon'

const props = defineProps<{
    msg: string;
    type: 'success' | 'warning' | 'info' | 'error';
    visible: boolean;
}>();

const Icon = computed(() => {
    switch (props.type) {
        case 'success':
            return Success
        case 'warning':
            return Warning
        case 'info':
            return Info
        case 'error':
            return Error
    }
})
let timer = 0
const hidden = () => {
    timer = window.setTimeout(() => {
        console.log('update:visible')
        emit('update:visible', false)
    }, 2000)
}


const emit = defineEmits(['update:visible'])

watch(() => props.visible, (val) => {
    console.log('props.visible', props.visible)
    if (val !== false) {
        window.clearTimeout(timer)
        hidden()
    }
})

</script>
<style lang="scss">
.db-message {
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    background-color: #409EFF;
    margin-bottom: 10px;
    width: fit-content;
    border: 1px solid transparent;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -10vh);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;

    .db-icon {
        width: 1.2em;
        height: 1.2em;
        margin-right: .6em;
    }

    &.success {
        background-color: #67c23ac2;
        color: #234711c0;
        border-color: #67c23a;
    }

    &.warning {
        background-color: #e6a23c;
        color: #523408;
        border-color: #df9527;
    }

    &.info {
        background-color: #909399;
        color: #fff;
        border-color: #fff;
    }

    &.error {
        background-color: #f56c6c;
        color: #912d2d;
        border-color: #f56c6cc5;
    }
}
</style>