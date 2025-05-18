import * as api from './api';
import * as types from '@/types'

type RouteConfig = {
  'login/': types.LoginFormData;
  'register/': types.RegisterFormData;
}

export default async function handleSubmit<T extends keyof RouteConfig>(
  formData: RouteConfig[T],
  route: T
) {
  try {
    const response = await fetch(api.BASE_API_URL + route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}



