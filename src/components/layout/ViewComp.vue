<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';

import { useAppStore } from '@/state/stores/app.store';
import { useSourcesStore } from '@/state/stores/sources.store';

import SourceDetail from '@/components/source/SourceDetail.vue';

import { DragHelper } from '@/utils/helpers/drag.helper';
import { ModalHelper } from '@/utils/helpers/modal.helper';

import { Theme } from '@/utils/enums/theme.enum';
import { PageType } from '@/utils/enums/pageType.enum';
import type { TSource } from '@/utils/types/composition/source.type';

export default defineComponent({

  computed: {
    ...mapState(useAppStore, ['fullscreen', 'theme']),
    ...mapState(useSourcesStore, ['sources', 'tilling']),

    /**
     * @description
     * The grid columns template
     */
    gridTemplateColumns(): string {
      return `repeat(${this.tilling}, 1fr)`;
    },

    /**
     * @description
     * Pinned sources
     */
    pinnedSources(): Array<TSource> {
      return this.sources.filter(source => source.pinned);
    },

    /**
     * @description
     * Unpinned sources
     */
    unpinnedSources(): Array<TSource> {
      return this.sources.filter(source => !source.pinned);
    },

    /**
     * @description
     * If not sources are available
     */
    empty(): boolean {
      return this.sources.length === 0;
    },

    /**
     * @description
     * Checks if dark theme is on
     */
    isDark(): boolean {
      return this.theme === Theme.Dark;
    }
  },

  methods: {
    ...mapActions(useAppStore, ['toggleFullscreen']),
    ...mapActions(useSourcesStore, [
      'getSource',
      'addSource',
      'setPlaying',
      'updateSource',
      'removeSource',
      'switchSources',
      'toggleSourcePin',
      'updateSourceMetadata'
    ]),

    /**
     * @description
     * Removes a source
     *
     * @param id The ID of the source to remove
     */
    onRemove(id: string) {
      this.removeSource(id);
    },

    /**
     * @description
     * Opens source addition modal
     */
    onAdd(): void {
      ModalHelper
        .open('Add Source', null, SourceDetail, { type: PageType.Creation })
        .then(modal => {
          if (modal.payload) {
            this.addSource(modal.payload);
          }
        });
    },

    /**
     * @description
     * Edits a source
     *
     * @param id The ID of the source to edit
     */
    onEdit(id: string) {
      const source = this.getSource(id);

      ModalHelper
        .open('Edit Source', null, SourceDetail, { type: PageType.Edition, source: { ...source } })
        .then(modal => {
          if (modal.payload) {
            this.updateSource(modal.payload);
          }
        });
    },

    /**
     * @description
     * Pins a source
     *
     * @param id The ID of the source to pin
     */
    onPin(id: string): void {
      this.toggleSourcePin(id, true);
    },

    /**
     * @description
     * Unpins a source
     *
     * @param id The ID of the source to unpin
     */
    onUnpin(id: string): void {
      this.toggleSourcePin(id, false);
    },

    /**
     * @description
     * Toggles the mute state for a source
     *
     * @param id The ID of the source to toggle the mute state for
     * @param mute The mute state value to toggle to
     */
    onToggleMute(id: string, mute: boolean): void {
      this.updateSourceMetadata(id, { muted: mute });
    },

    /**
     * @description
     * Handles dragging
     *
     * @param id The ID of the source to drag
     * @param e The drag event object
     */
    onDrag(id: string, e: DragEvent): void {
      e.dataTransfer?.setData('sourceId', id);
    },

    /**
     * @description
     * Handles dropping
     *
     * @param id The ID of the source to drop on
     * @param e The Drop event object
     */
    onDrop(id: string, e: DragEvent): void {
      const sourceId = e.dataTransfer?.getData('sourceId');

      if (sourceId && id !== sourceId) {
        this.switchSources(sourceId, id);
      }

      e.dataTransfer?.clearData();
      this.setPlaying(false);
    },

    /**
     * @description
     * Checks the drag permission
     *
     * @param id The ID of the source drag on
     * @param e The drag event object
     */
    onDragOver(id: string, e: DragEvent): void {
      const source = this.getSource(id);

      if (!source.pinned) {
        e.preventDefault();
      }
    },

    /**
     * @description
     * Enables dragging for a source
     *
     * @param id The ID of the source to enable the drag for
     */
    onDragEnable(id: string): void {
      DragHelper.enable(id);
    },

    /**
     * @description
     * Disable dragging for a source
     *
     * @param id The ID of the source to disable the drag for
     */
    onDragDisable(id: string): void {
      DragHelper.disable(id);
    },

    /**
     * @description
     * Toggles fullscreen mode
     */
    onToggleFullscreen(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const name = target.nodeName.toLowerCase();

      if (name !== 'button' && !target.closest('button')) {
        this.toggleFullscreen();
      }
    }
  }
});
</script>

<template>
  <div
    class="view"
    @dblclick.stop="onToggleFullscreen"
    :class="{
      'view--dark': isDark,
      'view--empty': empty,
      'view--fullscreen': fullscreen
    }"
  >
    <SourceEmpty
      :isEmpty="empty"
      @add="onAdd"
    >
      <div class="sources sources--pinned">
        <div
          v-for="source in pinnedSources"
          class="source"
          :key="source.id"
        >
          <SourceComp
            :source="source"
            @edit="onEdit"
            @unpin="onUnpin"
            @remove="onRemove"
            @toggleMute="onToggleMute"
            @enableDrag="onDragEnable"
            @disableDrag="onDragDisable"
          />
        </div>
      </div>

      <div
        class="sources sources--unpinned"
        :style="{ gridTemplateColumns }"
      >
        <div
          v-for="source in unpinnedSources"
          class="source"
          :key="source.id"
          :draggable="!source.pinned"
          @drop="e => onDrop(source.id, e)"
          @dragstart="e => onDrag(source.id, e)"
          @dragover="e => onDragOver(source.id, e)"
        >
          <SourceComp
            :source="source"
            @pin="onPin"
            @edit="onEdit"
            @remove="onRemove"
            @toggleMute="onToggleMute"
          />
        </div>
      </div>
    </SourceEmpty>
  </div>
</template>

<style scoped lang="scss">
.view {
  $root: &;

  flex: 1;
  overflow: auto;
  position: relative;

  box-sizing: border-box;
  max-height: calc(100vh - 208px);

  --dot-size: 2px;
  --dot-space: 22px;
  --dot-bg: #ffffff;
  --dot-color: hsl(var(--color-secondary-hsl), 94%);

  background:
    linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
    linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
    var(--dot-color);

  .sources {
    &--unpinned {
      $gap: 4px;

      height: 100%;
      display: grid;

      padding: $gap;
      row-gap: $gap;
      column-gap: $gap;
    }

    &--pinned {
      position: absolute;
      left: 0;
      top: 0;

      height: 0;
      width: 0;

      z-index: 1000;
    }
  }

  &--empty {
    max-height: calc(100vh - 73px);
  }

  &--fullscreen {
    max-height: 100%;
  }

  &--dark {
    --dot-bg: var(--color-secondary);
    --dot-color: hsl(var(--color-secondary-hsl), 35%);
  }
}
</style>