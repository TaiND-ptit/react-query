import MainLayout from 'layouts/MainLayout'
import About from 'pages/About'
import AddPost from 'pages/AddPost'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Posts from 'pages/Post'
import { useRoutes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const elements = useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/posts',
      element: <Posts />
    },
    {
      path: '/posts/:id',
      element: <AddPost />
    },
    {
      path: '/posts/add',
      element: <AddPost />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <div className='App'>
      <ToastContainer/>
      <MainLayout>{elements}</MainLayout>
    </div>
  )
}

export default App
