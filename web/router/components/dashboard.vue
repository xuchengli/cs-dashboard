<template>
    <div class="uk-container uk-width-1-1 uk-padding-remove">
        <router-view name="header"></router-view>
        <div uk-grid>
            <div class="uk-width-1-4">
                <router-view name="sidebar"></router-view>
            </div>
            <div class="uk-width-3-4">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
