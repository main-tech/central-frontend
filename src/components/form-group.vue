<!--
Copyright 2020 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <label class="form-group" :class="htmlClass">
    <slot name="before"></slot>
    <input ref="input" v-bind="$attrs" class="form-control" :value="modelValue"
      :placeholder="requiredLabel(placeholder, required)" :required="required"
      :autocomplete="autocomplete"
      @input="$emit('update:modelValue', $event.target.value)">
    <password-strength v-if="autocomplete === 'new-password'"
      :password="modelValue"/>
    <span class="form-label">{{ requiredLabel(placeholder, required) }}</span>
    <slot name="after"></slot>
  </label>
</template>

<script setup>
import { computed, ref } from 'vue';

import PasswordStrength from './password-strength.vue';

import { requiredLabel } from '../util/dom';

defineOptions({
  inheritAttrs: false
});
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  required: Boolean,
  hasError: Boolean,
  autocomplete: {
    type: String,
    required: true
  }
});
defineEmits(['update:modelValue']);

const htmlClass = computed(() => ({
  'new-password': props.autocomplete === 'new-password',
  'has-error': props.hasError
}));

const input = ref(null);
const focus = () => { input.value.focus(); };
defineExpose({ focus });
</script>

<style lang="scss">
.form-group {
  // Hide a password strength meter for password confirmation.
  &.new-password ~ .form-group.new-password .password-strength {
    display: none;
  }
}
</style>
