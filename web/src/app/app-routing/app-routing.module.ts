import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from '../dashboard/dashboard.component';
import { AboutComponent } from '../about/about.component';
import { PrivacyPageComponent } from '../privacy-page/privacy-page.component';
import { TermsOfServicePageComponent } from '../terms-of-service-page/terms-of-service-page.component';
import { ModuleDetailComponent }   from '../module-detail/module-detail.component';
import { UserSummaryComponent } from '../user-summary/user-summary.component';
import { CreditsComponent } from '../credits/credits.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyPageComponent },
  { path: 'tos', component: TermsOfServicePageComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'moduledetail/:id', component: ModuleDetailComponent },
  { path: 'user/:id', component: UserSummaryComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}