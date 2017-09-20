<template>
    <div class="uk-inline">
        <span class="uk-form-icon" :uk-icon="'icon: ' + icon"></span>
        <input :type="type" class="uk-input" :class="clz" :placeholder="placeholder"
            :value="value" @input="updateValue($event.target.value)"
            @focus="active = true; show = true;" @blur="active = false;">
        <transition name="slide-fade" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div class="warning" :style="style" v-if="warning && show">
                <span class="uk-text-nowrap">{{ emptyMessage }}</span>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        props: {
            icon: {
                type: String,
                required: true
            },
            type: {
                type: String,
                default: "text"
            },
            value: String,
            placeholder: String,
            emptyMessage: String
        },
        data() {
            return {
                left: 0,
                active: true,
                timer: null,
                show: true
            }
        },
        computed: {
            warning() {
                return !this.active && this.value === "";
            },
            clz() {
                return this.warning ? "uk-form-danger" : "";
            },
            style() {
                return {
                    left: this.left + "px"
                }
            }
        },
        methods: {
            updateValue(value) {
                this.$emit("input", value);
            },
            afterEnter(el) {
                if (!this.timer) {
                    this.timer = setTimeout(() => this.show = false, 1000);
                }
            },
            beforeLeave(el) {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
            }
        },
        mounted() {
            let rect = this.$el.getBoundingClientRect();
            this.left = rect.width + 10;
        }
    }
</script>
<style scoped>
    .warning {
        position: absolute;
        top: 8px;
        z-index: 1000;
        box-sizing: border-box;
        padding: 3px 6px;
        background: #faa05a;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(-50px);
        opacity: 0;
    }
    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: transform .5s, opacity .5s;
    }
</style>
