import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './ng-modules/material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './core/translation/http-loader-factory';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { ToolbarComponent } from './core/layout/components/toolbar/toolbar.component';
import { ProjectidPipe } from './shared/pipes/projectid/projectid.pipe';
import { EmployeeidPipe } from './shared/pipes/employeeid/employeeid.pipe';
import { SettingsPageComponent } from './features/settings/pages/settings-page/settings-page.component';
import { LoginComponent } from './core/auth/pages/login/login.component';
import { RightSectionComponent } from './core/layout/components/right-section/right-section.component';
import { LeftSectionComponent } from './core/layout/components/left-section/left-section.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NavigationComponent,
    ToolbarComponent,
    ProjectidPipe,
    EmployeeidPipe,
    SettingsPageComponent,
    LoginComponent,
    RightSectionComponent,
    LeftSectionComponent,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
