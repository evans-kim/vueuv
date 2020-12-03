<template>
    <button ref="btn" type="button"
            style="min-height: 40px"
            class="text-13 lg:text-15 py-2 px-2 transition-ease is-activated focus:outline-none focus:gray-shadow whitespace-no-wrap"
            :class="getClass" v-on:click="clickHandler">
        <slot></slot>
    </button>
</template>
<script>
    export default {
        name: 'EvButton',
        props: {
            type: {
                type: String,
                default: 'basic'
            }
        },
        data(){
            return {
                defaultClass : [
                    'py-2',
                    'px-2',
                    'transition-ease',
                    'is-activated',
                    'focus:outline-none',
                    'focus:gray-shadow',
                ],
                typeClass : {
                    primary : [
                        'bg-main-400',
                        'text-white',
                    ],
                    basic : [
                        'border',
                        'border-main-200',
                        'bg-white',
                        'text-main-400'
                    ],
                    secondary : [
                        'bg-blue-500',
                        'focus:bg-blue-400',
                        'text-white',
                    ],
                    warning : [
                        'bg-orange-500',
                        'focus:bg-orange-400',
                        'text-white',
                    ],
                    danger : [
                        'bg-red-500',
                        'focus:bg-red-400',
                        'text-white',
                    ],
                    plain : [
                        'bg-white-400',
                        'hover:text-gray-700',
                        'focus:bg-gray-400',
                        'text-gray-600',
                    ]
                }
            }
        },
        methods: {
            clickHandler(e) {
                if(this.$listeners.click){
                    return this.$listeners.click(e);
                }
            }
        },
        computed: {
            getClass() {
                return this.typeClass[this.type];
            }
        }
    }
</script>
<style scoped lang="scss">
    .focus\:gray-shadow:focus{
        box-shadow: 0 0 0 3px #606060
    }
    .is-activated:active{
        transform: translateY(2px);
    }
</style>
