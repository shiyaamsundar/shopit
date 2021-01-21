
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadUser } from './actions/userActions';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import NewProduct from './components/admin/NewProduct';
import OrdersList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import ProductReviews from './components/admin/ProductReviews';
import ProductsList from './components/admin/ProductsList';
import UpdateProduct from './components/admin/UpdateProduct';
import UpdateUser from './components/admin/UpdateUser';
import UsersList from './components/admin/UserList';
import Cart from './components/cart/Cart';
import CheckoutSteps from './components/cart/CheckoutSteps';
import ConfirmOrder from './components/cart/ConfirmOrder';
import OrderSuccess from './components/cart/OrderSuccess';
import Payment from './components/cart/Payment';
import Shipping from './components/cart/Shipping';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import ProductDetails from './components/products/ProductDetails';
import ProtectedRoute from './components/route/ProtectedRoute';
import ForgotPassword from './components/user/ForgotPassword';
import Login from './components/user/Login';
import NewPassword from './components/user/NewPassword';
import Profile from './components/user/Profile';
import Register from './components/user/Register';
import UpdatePassword from './components/user/UpdatePassword';
import UpdateProfile from './components/user/UpdateProfile';
import store from './store'




function App() {

  const [stripeApiKey, setStripeApiKey] = useState('')

  const {user,loading,isAuthenticated}=useSelector(state=>state.auth)


  useEffect(()=>{
    store.dispatch(loadUser())

    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    console.log('key',stripeApiKey);

    getStripApiKey();


  },[])

  return (
    <Router>
    <div className="App">
      <Header/>
      <div class="container continer-fluid">
        
      
      <Route path="/" component={Home} exact/>
      <Route path="/search/:keyword" component={Home} />
      <Route path="/product/:id" component={ProductDetails} exact/>
      <Route path="/login" component={Login} exact/>
      <Route path="/register" component={Register} exact/>
      <ProtectedRoute path="/me" component={Profile} exact/>
      <ProtectedRoute path="/me/update" component={UpdateProfile} exact/>
      <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>
      <ProtectedRoute path="/shipping" component={Shipping} exact/>
      <ProtectedRoute path="/confirm" component={ConfirmOrder} exact/>
      <ProtectedRoute path="/success" component={OrderSuccess} exact/>
      <ProtectedRoute path="/orders/me" component={ListOrders} exact/>
      <ProtectedRoute path="/order/:id" component={OrderDetails} exact/>


      {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements> 
          }
      <Route path="/password/forgot" component={ForgotPassword} exact/>
      <Route path="/password/reset/:token" component={NewPassword} exact/>
      <Route path="/cart" component={Cart} exact/>
      
      </div>
      <ProtectedRoute isAdmin={true}  path="/dashboard" component={Dashboard} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/products" component={ProductsList} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/product" component={NewProduct} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/product/:id" component={UpdateProduct} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/orders" component={OrdersList} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/order/:id" component={ProcessOrder} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/users" component={UsersList} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/user/:id" component={UpdateUser} exact/>
      <ProtectedRoute isAdmin={true} path="/admin/reviews" component={ProductReviews} exact/>
   
    <Footer/>
   

    </div>
    </Router>
  );
}

export default App;
