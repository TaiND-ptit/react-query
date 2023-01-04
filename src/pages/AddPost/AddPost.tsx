import { useMatch, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from 'utils/http';
import { addPost, getPost, updatePost } from 'api/posts.api';
import { type } from '@testing-library/user-event/dist/type';
import { Post } from 'types/Post.type';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';


type FormStateType = Omit<Post, 'id'> | Post


const initialFormState: FormStateType = {
  userId: 0,
  title: '',
  body: '',
}

export default function AddPost() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState);
  const addMatch = useMatch('/posts/add');
  const isAddMode = Boolean(addMatch);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const addPostMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addPost(body);
    }
  })

  useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id as string),
    enabled: id !== undefined,
    staleTime: 10 * 1000,
    onSuccess: (data) => {
      setFormState(data.data)
    }
  })

  const updatePostMutation = useMutation({
    mutationFn: (_) => updatePost(id as string, formState as Post),
    onSuccess: (data) => {
      queryClient.setQueryData(['post', id], data)
    }
  })


  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAddMode) {
      addPostMutation.mutate(formState, {
        onSuccess: () => {
          setFormState(initialFormState)
        }
      });
    } else {
      updatePostMutation.mutate(undefined, {
        onSuccess: (data) => {
          toast.success('Update success')
        }
      })
    }

  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Post</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='number'
            name='userID'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.userId}
            onChange={handleChange('userId')}
            required
          />
          <label
            htmlFor='UserId'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            User ID
          </label>
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='title'
            id='title'
            value={formState.title}
            onChange={handleChange('title')}
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
          />
          <label
            htmlFor='title'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Title
          </label>
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='body'
            id='body'
            value={formState.body}
            onChange={handleChange('body')}
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
          />
          <label
            htmlFor='body'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Description
          </label>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
