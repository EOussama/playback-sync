import type { App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import ViewComp from '@/components/layout/ViewComp.vue';
import HeadSection from '@/components/layout/HeadSection.vue';
import BodySection from '@/components/layout/BodySection.vue';
import FootSection from '@/components/layout/FootSection.vue';
import ControlsComp from '@/components/layout/ControlsComp.vue';

import ModalComp from '@/components/info/ModalComp.vue';
import TooltipComp from '@/components/info/TooltipComp.vue';
import ConfirmComp from '@/components/info/ConfirmComp.vue';

import SourceComp from '@/components/source/SourceComp.vue';
import SourceDetail from '@/components/source/SourceDetail.vue';

import Tilling from '@/components/tilling/Tilling.vue';
import TillingCustom from '@/components/tilling/TillingCustom.vue';

import RangeComp from '@/components/controls/RangeComp.vue';
import InputComp from '@/components/controls/InputComp.vue';
import SpeedComp from '@/components/controls/SpeedComp.vue';
import VolumeComp from '@/components/controls/VolumeComp.vue';
import SelectComp from '@/components/controls/SelectComp.vue';
import ButtonComp from '@/components/controls/ButtonComp.vue';
import TimelineComp from '@/components/controls/TimelineComp.vue';
import PlayPauseComp from '@/components/controls/PlayPauseComp.vue';



/**
 * @description
 * Registers components globaly
 *
 * @param app The vue app
 */
export function addComponent(app: App<Element>) {
  app.component('ViewComp', ViewComp);
  app.component('HeadSection', HeadSection);
  app.component('BodySection', BodySection);
  app.component('FootSection', FootSection);
  app.component('ControlsComp', ControlsComp);

  app.component('ModalComp', ModalComp);
  app.component('TooltipComp', TooltipComp);
  app.component('ConfirmComp', ConfirmComp);

  app.component('Tilling', Tilling);
  app.component('TillingCustom', TillingCustom);

  app.component('SpeedComp', SpeedComp);
  app.component('RangeComp', RangeComp);
  app.component('InputComp', InputComp);
  app.component('VolumeComp', VolumeComp);
  app.component('ButtonComp', ButtonComp);
  app.component('SelectComp', SelectComp);
  app.component('TimelineComp', TimelineComp);
  app.component('PlayPauseComp', PlayPauseComp);

  app.component('SourceComp', SourceComp);
  app.component('SourceDetail', SourceDetail);

  app.component('font-awesome-icon', FontAwesomeIcon);
}