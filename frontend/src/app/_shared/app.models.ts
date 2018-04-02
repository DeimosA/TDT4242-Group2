import { Observable } from "rxjs/Observable";

/**
 * User details
 */
class UserModel{

  id: number | string;
  email: string;
  isAdmin: boolean;
  order_history: OrderModel[];

  constructor(user) {
    if ( (typeof user.id === 'number' || typeof user.id === 'string') && user.id &&
        typeof user.email === 'string' && user.email &&
        typeof user.isAdmin === 'boolean' ) {

      this.id = user.id;
      this.email = user.email;
      this.isAdmin = user.isAdmin;
      if (user.order_history) {this.order_history = user.order_history}

    } else {
      throw new Error('Not a valid user object');
    }
  }
}

/**
 * Product details
 */
interface ProductModel{
  id: number | string;
  name: string;
  price: number;
  description: string;
  manufacturer: string;
  price_mod: number;
  package_get_count: number;
  package_pay_count: number;
  on_sale: string;
  stock_count: number;
  stock_resupply_date: Date;
}

/**
 * An item in the shopping cart
 */
class ShoppingCartItem{

  private _prodId: number;
  private _qty: number;
  private _productResolver: Function;

  constructor(productResolver: Function, productId: number, qty :number = 1){
    this._prodId = productId;
    this._qty = qty;
    this._productResolver = productResolver;
  }

  public get productId() : number{
    return this._prodId;
  }

  public get product() : Observable<ProductModel>{
    return this._productResolver(this._prodId);
  }

  public get quantity(){
    return this._qty;
  }

  public set quantity(qty: number){
    this._qty = qty;
  }
}

/**
 * Product search and filter
 */
interface SearchForm {
  search: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
}

/**
 * Order details
 */
interface OrderModel {
  id: number | string;
  user: UserModel;
  total_price: number;
  status: string;
  user_confirmed: boolean;
  order_details: object[];
}

export { UserModel, ProductModel, ShoppingCartItem, SearchForm, OrderModel }
