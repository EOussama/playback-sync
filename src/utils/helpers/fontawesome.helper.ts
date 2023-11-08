import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faCircleNotch, faHourglassHalf, faExpand,
  faPlay, faPause, faRepeat, faBackward, faForward,
  faCompress, faQuestion, faEllipsisVertical, faMoon,
  faThumbTack, faTrash, faChevronDown, faVideo, faSun,
  faVolumeOff, faVolumeLow, faVolumeHigh, faVolumeXmark,
  faPlus, faXmark, faCheck, faPen, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';



/**
 * @description
 * Loads Font Awesome icons
 */
export function initIcons(): void {
  library.add(
    faEllipsisVertical, faMoon, faSun,
    faExpand, faCompress, faQuestion,
    faVideo, faCircleNotch, faHourglassHalf,
    faThumbTack, faTrash, faGithub, faChevronDown,
    faPlay, faPause, faRepeat, faBackward, faForward,
    faVolumeOff, faVolumeLow, faVolumeHigh, faVolumeXmark,
    faPlus, faXmark, faCheck, faPen, faTriangleExclamation
  );
}

/**
 * @description
 * Gets a contextual volume icon
 *
 * @param volume The volume value
 * @param muted The mute state value
 */
export function getVolumeIcon(volume: number, muted: boolean): string {
  if (muted || volume === 0) {
    return 'volume-xmark';
  } else if (volume < 30) {
    return 'volume-off';
  } else if (volume < 60) {
    return 'volume-low';
  } else {
    return 'volume-high';
  }
}
