<template>
    <div class="uk-card uk-card-default uk-width-large uk-align-center uk-margin-auto-vertical">
        <div class="uk-card-header">
            <h3 class="uk-card-title">
                <router-link to="/" uk-icon="icon: arrow-left; ratio: 1.5"></router-link>
                Register
            </h3>
        </div>
        <div class="uk-card-body">
            <form>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: user"></span>
                        <input class="uk-input" type="text" placeholder="User ID">
                    </div>
                </div>
                <div class="uk-margin">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input" type="password" placeholder="Password">
                    </div>
                </div>
                <div class="uk-margin uk-margin-remove-bottom">
                    <div class="uk-inline uk-width-1-1">
                        <span class="uk-form-icon" uk-icon="icon: lock"></span>
                        <input class="uk-input" type="password" placeholder="Retype password">
                    </div>
                </div>
            </form>
        </div>
        <div class="uk-card-footer">
            <button class="uk-button uk-button-primary uk-align-right">Register</button>
        </div>
    </div>
</template>
