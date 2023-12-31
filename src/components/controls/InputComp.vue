<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';

import { Theme } from '@/utils/enums/theme.enum';
import { useAppStore } from '@/state/stores/app.store';


export default defineComponent({
  emits: ['update:modelValue'],

  props: {
    min: Number,
    label: String,
    hasError: Boolean,
    autofocus: Boolean,
    placeholder: String,
    modelValue: [String, Number],
    error: {
      type: String,
      default: 'Invalid value'
    },
    type: {
      type: String,
      default: 'text'
    }
  },

  computed: {
    ...mapState(useAppStore, ['theme']),

    /**
     * @description
     * Checks if dark theme is on
     */
    isDark(): boolean {
      return this.theme === Theme.Dark;
    }
  },

  methods: {

    /**
     * @description
     * Handles model update
     *
     * @param e The event obejct
     */
    onInput(e: Event): void {
      const target = e.target as HTMLInputElement;
      const value = target.value ?? '';

      this.$emit('update:modelValue', value);
    }
  }
});
</script>

<template>
  <div
    class="input"
    :class="{
      'input--dark': isDark,
      'input--error': hasError
    }"
  >
    <label class="input__wrapper">
      <div
        v-if="label"
        class="input__label"
      >{{ label }}</div>

      <input
        :min="min"
        :type="type"
        :value="modelValue"
        class="input__input"
        :autofocus="autofocus"
        :placeholder="placeholder"
        @input="onInput"
      />
    </label>

    <div
      v-if="hasError"
      class="input__error"
    >
      <font-awesome-icon
        icon="triangle-exclamation"
        class="input__error-icon"
      />
      <span class="input__error-message">{{ error }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/style/mixins/selectable';

.input {
  $root: &;

  &__wrapper {
    #{$root}__label {
      margin-bottom: 5px;

      font-size: 14px;
      font-weight: var(--font-weight-light);

      transition-duration: 0.2s;
      transition-property: color;
    }

    #{$root}__input {
      width: 100%;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid var(--color-secondary);

      color: var(--color-primary);

      font-size: 16px;
      font-family: var(--font-family-primary);
      font-weight: var(--font-weight-regular);

      transition-duration: 0.2s;
      transition-property: color border-color;

      &::placeholder {
        font-weight: var(--font-weight-light);
        color: hsl(var(--color-secondary-hsl), 80%);

        transition-duration: 0.2s;
        transition-property: color;
      }

      @extend %focusable;
    }

    &:focus-within {
      #{$root}__label {
        color: hsl(var(--color-secondary-hsl), 60%);
      }
    }
  }

  &__error {
    display: flex;
    align-items: center;

    margin-top: 5px;
    color: var(--color-error);

    animation-name: fadeIn;
    animation-duration: 0.2s;
    animation-direction: normal;
    animation-fill-mode: forwards;

    &-message {
      font-size: 13px;
      font-weight: var(--font-weight-light);
    }

    &-icon {
      opacity: 0.7;
      margin-right: 5px;

      font-size: 11px;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  &--dark {
    #{$root}__input {
      // color: var(--color-primary);
      background-color: hsl(var(--color-secondary-hsl), 35%);
    }
  }

  &--error {
    #{$root}__label {
      color: var(--color-error) !important;
    }

    #{$root}__input {
      border-color: var(--color-error) !important;

      &::placeholder {
        color: var(--color-error);
      }
    }
  }
}
</style>