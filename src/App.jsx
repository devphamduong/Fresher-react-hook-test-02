import React, { useState } from 'react';
import ErrorPage from './components/pages/error-page';
import LoginPage from './components/pages/login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const Layout = () => {
  return (
    <>a</>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
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
