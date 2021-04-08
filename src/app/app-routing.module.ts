import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapventasexpComponent } from "../app/paginas/capventasexp/capventasexp.component";
import { CapventasnacionalComponent } from "../app/paginas/capventasnacional/capventasnacional.component";
import { RepedoctaclienteComponent } from "../app/paginas/repedoctacliente/repedoctacliente.component"
import { ReprecuperacionsemanalnacComponent } from "../app/paginas/reprecuperacionsemanalnac/reprecuperacionsemanalnac.component"
import { LoginComponent } from "../app/paginas/login/login.component"
import { InicioComponent } from "../app/paginas/inicio/inicio.component"
import { RepacumuladodeventasComponent } from './paginas/repacumuladodeventas/repacumuladodeventas.component';
import { CappedidosComponent } from './paginas/cappedidos/cappedidos.component'  ;
import { RepcobranzaComponent } from './paginas/repcobranza/repcobranza.component'

const routes: Routes = [
{ path:'inicio', component: InicioComponent },
{ path:'login', component: LoginComponent },
{ path:'capventasexp', component: CapventasexpComponent },
{ path:'capventasnacional', component: CapventasnacionalComponent },
{ path:'repedoctacliente', component: RepedoctaclienteComponent },
{ path:'reprecuperacionsemanalnac', component: ReprecuperacionsemanalnacComponent },
{ path:'repacumuladodeventas', component: RepacumuladodeventasComponent },
{ path:'repcobranza', component:RepcobranzaComponent },
{ path: 'cappedidos', component: CappedidosComponent},
{ path: '',component:LoginComponent,pathMatch:'full'},
{ path: '**', redirectTo: '/', pathMatch: 'full' },
 


 ];

@NgModule({
  declarations: [],
  imports: [BrowserModule,CommonModule,RouterModule.forRoot(routes),],  
  exports: [RouterModule]
})
export class AppRoutingModule { }