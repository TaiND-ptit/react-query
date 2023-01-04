import { deletePost, getPost, getPosts } from 'api/posts.api';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Posts as PostsType } from "types/Post.type";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryString } from 'utils/utils';
import classNames from 'classnames'
import { toast } from 'react-toastify';
const LIMIT = 10;
export default function Posts() {

  const queryClient = useQueryClient();

  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  // const [_page] = useState(1);

  const postsQuery = useQuery({
    queryKey: ['posts', page],
    queryFn: () => getPosts(page, LIMIT),
    keepPreviousData: true,
  })

  const deletePostMutation = useMutation({
    mutationFn: (id: number | string) => deletePost(id),
    onSuccess: (_, id) => {
      toast.success(`Xoa thanh cong Post voi id la ${id}`);
      queryClient.invalidateQueries({ queryKey: ['posts', page], exact: true })
    }
  })

  const totalPostsCount = Number(postsQuery.data?.headers['x-total-count'] || 0);
  const totalPage = Math.ceil(totalPostsCount / LIMIT);

  const handleDelete = (id: number) => {
    deletePostMutation.mutate(id);
  }

  const handlePrefectPost = (id: number) => {
    queryClient.prefetchQuery(['post', String(id)], {
      queryFn: () => getPost(id)
    })
  }

  return (
    <div>
      <h1 className='text-lg'>Posts</h1>
      <div className='mt-6'>
        <Link to="/posts/add" className=' rounded bg-blue-500 px-5 py-2 text-white' >
          Add Post
        </Link>
      </div>
      {postsQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!postsQuery.isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    userID
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Title
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Description
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {postsQuery.data?.data.map((post) => (
                  <tr
                    key={post.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handlePrefectPost(post.id)}>
                    <td className='py-4 px-6'>{post.id}</td>
                    <td className='py-4 px-6'>{post.title} </td>
                      
                   
                    <th scope='row' className='py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {post.body}
                    </th>
                    <td className='py-4 px-6 text-right'>
                      <Link to={`/posts/${post.id}`} className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'>
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDelete(post.id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  ) : (
                    <Link to={`/posts?page=${page - 1}`} className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </Link>
                  )}

                </li>
                {Array(totalPage).fill(0).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber;
                  return (
                    <li key={pageNumber}>
                      <Link
                        className={classNames(
                          'border border-gray-300 py-2 px-3 leading-tight hover:bg-gray-100 hover:text-gray-700', {
                          'bg-gray-100 text-gray-700': isActive,
                          'bg-white text-gray-500': !isActive
                        })}
                        to={`/posts?page=${pageNumber}`}
                      >
                        {pageNumber}
                      </Link>
                    </li>
                  )
                })}

                <li>
                  {page === totalPage ? (
                    <span
                      className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Next
                    </span>
                  ) : (
                    <Link
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      to={`/posts?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}

                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
