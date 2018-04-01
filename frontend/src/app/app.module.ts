import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { UserAuthService } from "./_shared/services/user-auth.service";
import { ProductsService } from "./_shared/services/products.service";
import { ShoppingCartService } from './_shared/services/shopping-cart.service';
import { OrderService } from './_shared/services/order.service';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './_shared/shared.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { DealsComponent } from './deals/deals.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductContainerComponent } from './product-container/product-container.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingCartListComponent } from './shopping-cart-list/shopping-cart-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


/**
 * Root app module
 */
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    NotFoundComponent,
    ProductCreationComponent,
    DealsComponent,
    ProductListComponent,
    ProductContainerComponent,
    ProductFilterComponent,
    ShoppingCartComponent,
    ShoppingCartListComponent,
    ProductDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    UserAuthService,
    ProductsService,
    ShoppingCartService,
    OrderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (userAuthService: UserAuthService) => {
        return () => {
          // Check if a user is already logged in on app initialization
          userAuthService.getCurrentUser().subscribe(next => {});
          return Promise.resolve({});
        }
      },
      deps: [UserAuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
