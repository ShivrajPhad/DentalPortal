import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{
		path: 'login',
		loadChildren: () => import('./features/auth/auth.module').then((module) => module.AuthModule),
	},
	{
		path: 'home',
		loadChildren: () => import('./features/home/home.module').then((module) => module.HomeModule),
	},
	{ path: '**', redirectTo: 'login' },
];
