import { useSourcesStore } from '../stores/sources.store'
import { SourceHelper } from '@/utils/helpers/source.helper'



/**
 * @description
 * Hooks in sources effects
 */
export function hookSourcesEffect() {
  const store = useSourcesStore();

  store.$onAction(({ name, store, args, after }) => {
    after(() => {
      switch (name) {
        case 'setPlaying': {
          for (const source of store.sources) {
            if (store.playing) {
              SourceHelper.play(source.id);
            } else {
              SourceHelper.pause(source.id);
            }
          }

          break;
        }

        case 'setVolume': {
          for (const source of store.sources) {
            SourceHelper.setVolume(source.id, store.volume);
          }

          break;
        }

        case 'setSpeed': {
          for (const source of store.sources) {
            SourceHelper.setSpeed(source.id, store.speed);
          }

          break;
        }

        case 'seek': {
          for (const source of store.sources) {
            SourceHelper.seek(source.id, ...args);
          }

          break;
        }
      }
    });
  });
}