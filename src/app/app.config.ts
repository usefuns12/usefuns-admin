import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCircleCheck,
  faClock,
  faComment,
  faEye,
  faFileAlt,
  faGem,
  faImage,
  faImages,
  faPenToSquare,
  faTrashCan,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faBan,
  faBars,
  faChevronDown,
  faChevronUp,
  faCircle,
  faCode,
  faCropSimple,
  faEllipsisVertical,
  faFileCsv,
  faGear,
  faGift,
  faHeadset,
  faMagnifyingGlass,
  faMobileScreen,
  faQ,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { tokenInterceptor } from './services/http-interceptors/token.interceptor';

const setupFontAwesome = (library: FaIconLibrary) => {
  library.addIcons(
    faUser,
    faHeadset,
    faGem,
    faBars,
    faChevronDown,
    faChevronUp,
    faImage,
    faComment,
    faCropSimple,
    faArrowRightFromBracket,
    faMagnifyingGlass,
    faCircle,
    faEye,
    faPenToSquare,
    faBan,
    faClock,
    faCircleCheck,
    faXmark,
    faTrashCan,
    faGift,
    faImages,
    faTrashCan,
    faEllipsisVertical,
    faMobileScreen,
    faGear,
    faCode,
    faQ,
    faFileAlt,
    faFileCsv
  );
};

export const tooltipConfig: MatTooltipDefaultOptions = {
  showDelay: 1000,
  disableTooltipInteractivity: true,
  hideDelay: 0,
  touchendHideDelay: 0,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(
      NgxSkeletonLoaderModule.forRoot({ animation: 'progress-dark' }),
      JwtModule.forRoot({})
    ),
    provideAnimationsAsync(),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        setupFontAwesome(library);
        return library;
      },
    },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipConfig },
    provideToastr({
      positionClass: 'toast-bottom-center',
      timeOut: 3000,
    }),
  ],
};
