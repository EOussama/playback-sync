<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';

import { useAppStore } from '@/state/stores/app.store';

import { PageType } from '@/utils/enums/pageType.enum';
import { Validation } from '@/utils/enums/validation.enum';
import { ReadyState } from '@/utils/enums/readyState.enum';

import { DOMHelper } from '@/utils/helpers/dom.helper';
import { TimeHelper } from '@/utils/helpers/time.helper';
import { ModalHelper } from '@/utils/helpers/modal.helper';
import { SourceHelper } from '@/utils/helpers/source.helper';
import { ValidationHelper } from '@/utils/helpers/validation.helper';

import type { TSource } from '@/utils/types/composition/source.type';
import type { TSourceDetailType } from '@/utils/types/components/sourceDetail.type';

export default defineComponent({

  data: (): TSourceDetailType => ({
    source: null,
    loading: false,
    submitted: false,
    initialized: false,
    previewLoaded: false
  }),

  props: {
    modalId: String,
    params: Object as PropType<{ type: PageType, source: TSource }>
  },

  methods: {

    /**
     * @description
     * Initializes the source form
     */
    async initForm(): Promise<void> {
      if (this.params) {
        if (this.params.type === PageType.Creation) {
          this.source = await SourceHelper.init();
        } else {
          this.source = this.params.source;
        }
      }
    },

    /**
     * @description
     * Formats value as time stamp
     *
     * @param value The value to format
     */
    valueFormater(value: number): string {
      return TimeHelper.secondsToTime(value);
    },

    /**
     * @description
     * Checks if the form is valid
     */
    isFormValid(): boolean {
      return this.isInputValid('title') && this.isInputValid('url') && (this.previewLoaded && !this.forceLoad);
    },

    /**
     * @description
     * Checks if an input is valid
     *
     * @param input The name of the input
     */
    isInputValid(input: keyof TSource): boolean {
      const source: any = this.source ?? {};
      return !ValidationHelper.isInvalid(input, source[input]);
    },

    /**
     * @description
     * Checks if the validion error can be shown for a specific input
     *
     * @param input The name if the input to show the error for
     */
    canShowError(input: keyof TSource): boolean {
      if (input === 'url') {
        return (!this.isInputValid(input) || !this.previewLoaded) && this.submitted;
      } else {
        return !this.isInputValid(input) && this.submitted;
      }
    },

    /**
     * @description
     * Resets the form
     */
    async onClear(): Promise<void> {
      this.submitted = false;
      this.source = await SourceHelper.reset(this.source?.id ?? '');
    },

    /**
     * @description
     * Returns the source
     */
    async onValidate(): Promise<void> {
      this.submitted = true;

      if (this.isFormValid()) {
        if (this.modalId) {
          ModalHelper.close(this.modalId, this.source);
        }
      }
    },

    /**
     * @description
     * Handles start update
     *
     * @param start The start value
     */
    onStartChanged(start: number): void {
      if (this.source) {
        this.source.metadata.start = start;
      }
    },

    /**
     * @description
     * Handles end update
     *
     * @param end The end value
     */
    onEndChanged(end: number): void {
      if (this.source) {
        this.source.metadata.end = end;
      }
    },

    /**
     * @description
     * Updates source loading state
     *
     * @param loading The loading state
     */
    onLoad(loading: boolean): void {
      this.loading = loading;
    }
  },

  watch: {
    source(): void {
      setTimeout(() => {
        const { elementRef } = this.$refs;
        DOMHelper.focus('input', elementRef as HTMLElement);
      });
    },

    'source.url'(): void {
      const player = document.getElementById(this.previewPlayerId) as HTMLVideoElement;

      if (player) {
        player.onloadedmetadata = () => {
          if (this.source && !this.previewLoaded && !this.initialized) {
            if (this.params?.type === PageType.Creation) {
              this.source.metadata.start = 0;
              this.source.metadata.end = player.duration;
            }

            this.source.metadata.duration = player.duration;
          }

          this.initialized = true;
          this.previewLoaded = player.readyState > ReadyState.HaveNothing;
        }

        this.previewLoaded = false;
        player.load();
      }
    }
  },

  computed: {

    /**
     * @description
     * The label to display on the validation button
     */
    validateLabel(): string {
      return this.params?.type === PageType.Creation ? 'Add' : 'Edit';
    },

    /**
     * @description
     * The preview player's ID on the DOM
     */
    previewPlayerId(): string {
      return `preview-player-${this.source?.id}`;
    },

    /**
     * @description
     * The view source link
     */
    previewUrl(): string {
      return `${this.source?.url}#t=${this.source?.metadata?.start},${this.source?.metadata?.end}`;
    },

    /**
     * @description
     * Checks if the loader should be forced into activation
     */
    forceLoad(): boolean {
      return Boolean(!this.previewLoaded && this.source && this.source.url.length > 0);
    },

    /**
     * @description
     * The placeholder of the title input
     */
    titleError(): string {
      const source: any = this.source ?? {};
      const error = ValidationHelper.isInvalid('title', source.title);

      return ValidationHelper.getErrorMessage(error);
    },

    /**
     * @description
     * The placeholder of the URL input
     */
    urlError(): string {
      const source: any = this.source ?? {};
      const error = ValidationHelper.isInvalid('url', source.url);

      return error !== false
        ? ValidationHelper.getErrorMessage(error)
        : !this.previewLoaded
          ? ValidationHelper.getErrorMessage(Validation.URLInvalid)
          : '';
    }
  },

  created() {
    this.initForm();
    useAppStore().$onAction(({ name, after }) => {
      after(() => {
        if (name === 'onValidate') {
          this.onValidate();
        }
      });
    });
  },

  setup() {
    const elementRef = ref(null);
    return { elementRef };
  }
});
</script>

<template>
  <div
    v-if="source"
    class="source"
    ref="elementRef"
  >
    <div class="source__form">
      <div class="source__input">
        <InputComp
          type="text"
          label="Source Title"
          v-model="source.title"
          :autofocus="true"
          :error="titleError"
          :hasError="canShowError('title')"
          placeholder="Enter a title for the source"
        />
      </div>

      <div class="source__input">
        <InputComp
          type="text"
          label="Source URL"
          v-model="source.url"
          :error="urlError"
          :hasError="canShowError('url')"
          placeholder="Enter the URL of the source"
        />
      </div>

      <div
        class="source__preview"
        v-show="source.url.length > 0"
      >
        <SourceLoader
          @load="onLoad"
          :forceLoad="forceLoad"
        >
          <video
            :id="previewPlayerId"
            :controls="!loading"
            class="source__player"
          >
            <source
              type="video/mp4"
              :src="previewUrl"
            >
          </video>
        </SourceLoader>
      </div>

      <div
        class="source__crop"
        v-show="source.url.length > 0"
      >
        <RangeComp
          :min="0"
          :start="source.metadata?.start"
          :end="source.metadata?.end"
          :max="source.metadata?.duration"
          :disabled="!previewLoaded"
          :valueFormater="valueFormater"
          @endChanged="onEndChanged"
          @startChanged="onStartChanged"
        />
      </div>

    </div>

    <div class="source__controls">
      <div class="source__clear">
        <ButtonComp
          label="Clear"
          type="outline"
          @click="onClear"
        />
      </div>

      <div class="source__resolve">
        <ButtonComp
          icon="check"
          type="primary"
          :label="validateLabel"
          @click="onValidate"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.source {
  $root: &;
  width: 620px;
  max-width: 100%;

  &__form {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(var(--color-secondary-rgb), 0.5);

    #{$root}__input {
      margin-bottom: 15px;
    }

    #{$root}__preview {
      width: 100%;
      height: 100%;
      margin: 0 auto 15px auto;

      #{$root}__player {
        display: block;

        width: 100%;
        height: 100%;
      }
    }
  }

  &__controls {
    display: flex;
    align-content: center;
    justify-content: flex-end;

    #{$root}__clear {
      margin-right: 12px;
    }
  }
}
</style>