import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComment, faGem, faImage, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars, faChevronDown, faChevronUp, faCropSimple, faHeadset } from '@fortawesome/free-solid-svg-icons';

const setupFontAwesome = (library: FaIconLibrary) => {
  library.addIcons(faUser, faHeadset, faGem, faBars, faChevronDown, faChevronUp, faImage, faComment, faCropSimple);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    {
      provide: FaIconLibrary,
      useFactory: () => {
        const library = new FaIconLibrary();
        setupFontAwesome(library);
        return library;
      }
    }
  ],
};
