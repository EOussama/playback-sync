import type { App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import HeadSection from '@/components/layout/HeadSection.vue';
import BodySection from '@/components/layout/BodySection.vue';
import FootSection from '@/components/layout/FootSection.vue';
import View from '@/components/layout/View.vue';
import Controls from '@/components/layout/Controls.vue';

import Modal from '@/components/info/Modal.vue';
import Tooltip from '@/components/info/Tooltip.vue';
import Confirm from '@/components/info/Confirm.vue';

import Source from '@/components/source/Source.vue';
import SourceDetail from '@/components/source/SourceDetail.vue';

import Tilling from '@/components/tilling/Tilling.vue';
import TillingCustom from '@/components/tilling/TillingCustom.vue';

import RangeComp from '@/components/controls/RangeComp.vue';
import InputComp from '@/components/controls/InputComp.vue';
import SpeedComp from '@/components/controls/SpeedComp.vue';
import SelectComp from '@/components/controls/SelectComp.vue';
import ButtonComp from '@/components/controls/ButtonComp.vue';
import Volume from '@/components/controls/Volume.vue';
import Timeline from '@/components/controls/Timeline.vue';
import PlayPause from '@/components/controls/PlayPause.vue';



/**
 * @description
 * Registers components globaly
 *
 * @param app The vue app
 */
export function addComponent(app: App<Element>) {
  app.component('HeadSection', HeadSection);
  app.component('BodySection', BodySection);
  app.component('FootSection', FootSection);
  app.component('View', View);
  app.component('Controls', Controls);

  app.component('Modal', Modal);
  app.component('Tooltip', Tooltip);
  app.component('Confirm', Confirm);

  app.component('Tilling', Tilling);
  app.component('TillingCustom', TillingCustom);

  app.component('SpeedComp', SpeedComp);
  app.component('RangeComp', RangeComp);
  app.component('InputComp', InputComp);
  app.component('Volume', Volume);
  app.component('ButtonComp', ButtonComp);
  app.component('SelectComp', SelectComp);
  app.component('Timeline', Timeline);
  app.component('PlayPause', PlayPause);

  app.component('Source', Source);
  app.component('SourceDetail', SourceDetail);

  app.component('font-awesome-icon', FontAwesomeIcon);
}