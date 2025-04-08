import App from "../App";
import Home from "../pages/home";
import Login from "../pages/login";
import PostEditor from "../pages/postEditor";
import Signup from "../pages/signup";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/auth/admin/signup',
        element: <Signup />
      },
      {
        path: '/auth/login',
        element: <Login />
      },
      {
        path: '/posts/:postId/edit',
        element: <PostEditor />
      }
    ],
  },
];

export default routes;