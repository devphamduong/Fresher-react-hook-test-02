import React, { useEffect } from 'react';
import ErrorPage from './pages/error-page';
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
import { useDispatch } from 'react-redux';
import { getAccountAction } from './redux/account/accountSlice';

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    let res = await getAccount();
    if (res && res.data) {
      dispatch(getAccountAction(res.data.user));
    }
  };

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
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
