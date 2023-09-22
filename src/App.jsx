import React, { useEffect } from 'react';
import ErrorPage from './pages/error/error-page';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import {
  createBrowserRouter,
  RouterProvider, Outlet
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import { getAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "book",
        element: <BookPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, element:
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
      },
      {
        path: "user",
        element: <ContactPage />,
      },
      {
        path: "book",
        element: <BookPage />,
      },
    ],
  },
]);


export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    if (window.location.pathname !== '/login') {
      let res = await getAccount();
      if (res && res.data) {
        dispatch(getAccountAction(res.data.user));
      }
    }
  };

  return (
    <>
      {isAuthenticated || window.location.pathname !== '/login'
        ? <RouterProvider router={router} />
        : <Loading />}
    </>
  );
}
