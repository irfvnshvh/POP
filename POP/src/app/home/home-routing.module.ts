import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ResolverService } from '../resolver/resolver.service';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'discover',
        loadChildren: () => import('../home/discover/discover.module').then(m => m.DiscoverPageModule)
      },
      {
        path: 'camera',
        loadChildren: () => import('../home/camera/camera.module').then(m => m.CameraPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../home/profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: '',
        redirectTo: '/home/discover',
        pathMatch: 'full'
      },
      {
        path: 'profiles/:id',
        resolve: {
          user: ResolverService,
        },
        loadChildren: () => import('../home/profiles/profiles.module').then(m => m.ProfilesPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
