import React, { useEffect } from 'react';
import ErrorPage from './pages/error/error-page';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
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
import LayoutAdmin from './components/Admin/LayoutAdmin';
import ManageUser from './components/Admin/User/ManageUser';
import ManageBook from './components/Admin/Book/ManageBook';

const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <div style={{ padding: '20px 0', background: '#f5f5f5' }}><Outlet /></div>
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
        path: "book/:slug",
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
    element: <LayoutAdmin />,
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
        element: <ManageUser />,
      },
      {
        path: "book",
        element: <ManageBook />,
      },
    ],
  },
]);


export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    if (window.location.pathname !== '/login' || window.location.pathname !== '/register') {
      let res = await getAccount();
      if (res && res.data) {
        dispatch(getAccountAction(res.data.user));
      }
    }
  };

  return (
    <>
      {!isLoading || window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/'
        ? <RouterProvider router={router} />
        : <Loading />}
    </>
  );
}
