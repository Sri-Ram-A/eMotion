import * as api from './api';
import * as types from '@/types'

type RouteConfig = {
  'register/': types.RegisterFormData;
  'login/': types.LoginFormData;
  'profile/': void;
  'history/': void;
  'leaderboards/': void;
  'demand/': void;
  '': void;
}

export default async function handleSubmit<T extends keyof RouteConfig>(
  formData:RouteConfig[T],
  route: T,
  method: 'GET' | 'POST' = 'POST',
  pk?: String  // Optional primary key for GET requests
) {
  try {
    let url = api.BASE_API_URL + route;
    // Append primary key to URL if provided 
    if (pk !== undefined) {
      url += `${pk}/`;
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'POST' ? JSON.stringify(formData) : undefined
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