import React, { useState } from 'react';
import ErrorPage from './pages/error-page';
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import {
  createBrowserRouter,
  RouterProvider, Outlet
} from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';

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
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
