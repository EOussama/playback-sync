import { v4 } from 'uuid';

import { useModalStore } from '@/state/stores/modal.store';
import { ModalAlignment } from '../enums/modalAlignment.enum';

import type { TModal } from '../types/composition/modal.type';
import type { TNullable } from '../types/generic/nullable.type';
import type { TComponent } from '../types/composition/component.type';
import type { TModalParams } from '../types/composition/modalParams.type';



/**
 * @description
 * Helpes with modals
 */
export class ModalHelper {

  /**
   * @description
   * Creates a new modal
   * 
   * @param title The title of the modal
   * @param params Modal parameters
   * @param component The component to show in the body of the modal
   * @param props The properties to pass to the modal
   */
  private static create<T extends TComponent, U = any>(title: string, params: TNullable<TModalParams>, component: InstanceType<T>, props: U): TModal<T, U> {
    const id = v4();
    const modalParams = params ?? {
      dialog: true,
      overlay: true,
      dismissive: true,
      alignment: ModalAlignment.Center
    };

    return { id, title, component, props, params: modalParams };
  }

  /**
   * @description
   * Opens a component as a modal
   *
   * @param title The title to show on top of the modal
   * @param params Modal parameters
   * @param component The component to show in the body of the modal
   * @param props Optional props to pass to the component
   */
  static open<T extends TComponent, U = { id: string, payload: any }, V = any>(title: string, params: TNullable<TModalParams>, component: InstanceType<T>, props?: V): Promise<U> {
    return new Promise(resolve => {
      const store = useModalStore();
      const modal = this.create(title, params, component, props);

      if (modal.params?.dismissive) {
        for (const modal of store.modals) {
          ModalHelper.close(modal.id);
        }
      }

      store.addModal(modal);
      const unsubscribe = store.$onAction(({ name, args, after }) => {
        after(() => {
          if (name === 'removeModal') {
            const [id, payload] = args;

            if (id === modal.id) {
              unsubscribe();
              resolve(payload as any);
            }
          }
        });
      });
    });
  }

  /**
   * @description
   * Closes the modal
   *
   * @param id The ID of the modal to close
   * @param payload Optional data to return from the modal
   */
  static close<T = any>(id: string, payload?: T): void {
    const store = useModalStore();
    store.removeModal(id, { id, payload });
  }
}