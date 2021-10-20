import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { Error404Component } from './pages/error404/error404.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { AuthGuard } from './guards/auth.guard';
import { AccountComponent } from './pages/account/account.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [

	{path: '', component: HomeComponent },
	{path: 'products/:param', component: ProductsComponent},
	{path: 'product/:param', component: ProductComponent },
	{path: 'search/:param', component: SearchComponent },
	{path: 'login', component: LoginComponent },
	{path: 'register', component: RegisterComponent },
	{path: 'account', component: AccountComponent},
	{path: 'shopping-cart', component: ShoppingCartComponent},
	{path: 'shopping-cart/checkout', component: CheckoutComponent},
	{path: 'checkout', component: CheckoutComponent},
	{path: '**', pathMatch:'full', component: Error404Component }

];

@NgModule({
  
  imports: [RouterModule.forRoot(routes),
			RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
