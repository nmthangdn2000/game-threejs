import { DetailPage, HomePage, ProductsPage } from '@pages';
import { createBrowserRouter } from 'react-router-dom';

export const rootRouter = createBrowserRouter([
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'products',
    element: <ProductsPage />,
    children: [
      {
        path: 'detail/:id',
        element: <DetailPage />,
      },
    ],
  },
]);
