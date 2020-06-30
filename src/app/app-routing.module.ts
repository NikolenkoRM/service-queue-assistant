import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueuePanelComponent } from './components/queue-panel/queue-panel.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: QueuePanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
