import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

import { RequestListComponent } from './components/request-list/request-list.component';
import { HelpRequestComponent } from './components/help-request/help-request.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'requests', component: RequestListComponent },
    { path: 'requests/new', component: HelpRequestComponent },
    { path: 'chat/:id', component: ChatComponent },
];
