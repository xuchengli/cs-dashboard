<template>
    <div class="uk-inline">
        <span class="uk-form-icon" :uk-icon="'icon: ' + icon"></span>
        <input :type="type" class="uk-input" :class="clz" :placeholder="placeholder"
            :value="value" @input="updateValue($event.target.value)"
            @focus="focus" @blur="blur">
        <transition name="slide-fade" @after-enter="afterEnter" @before-leave="beforeLeave">
            <div class="tooltip" :style="style" v-if="message != ''">
                <span class="uk-text-nowrap">{{ message }}</span>
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
            status: {
                type: String,
                default: "normal"
            },
            message: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                left: 0,
                timer: null
            }
        },
        computed: {
            clz() {
                return this.status != "normal" ? "uk-form-danger" : "";
            },
            style() {
                let color = "#000";
                if (this.status === "warning") {
                    color = "#faa05a";
                } else if (this.status === "error") {
                    color = "#f0506e";
                }
                return {
                    left: this.left + "px",
                    background: color
                }
            }
        },
        methods: {
            focus() {
                this.$emit("update:status", "normal");
                this.$emit("update:message", "");
            },
            blur() {
                this.$emit("blur");
            },
            updateValue(value) {
                this.$emit("input", value);
            },
            afterEnter(el) {
                if (!this.timer) {
                    this.timer = setTimeout(() => this.$emit("update:message", ""), 1000);
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
    .tooltip {
        position: absolute;
        top: 8px;
        z-index: 1000;
        box-sizing: border-box;
        padding: 3px 6px;
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
