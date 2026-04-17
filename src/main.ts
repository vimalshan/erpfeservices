import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from '@customer-portal/environments';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
    enableProdMode();
}

 bootstrapApplication(AppComponent, appConfig)
    .then(() => {
    const loader = document.getElementById('initial-loader');

    if (loader) {
    document.body.style.backgroundColor = 'transparent';
    loader.classList.remove('loader-visible');
    loader.classList.add('loader-hidden');
    }
    }).catch((err) => console.error(err));