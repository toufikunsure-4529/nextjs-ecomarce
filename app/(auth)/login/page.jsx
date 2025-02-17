'use client';

import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { CircularProgress } from '@mui/material';
import { Button } from '@nextui-org/react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"; import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';


export default function Login() {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (user) {
      router.push("/account")
    }
  }, [user])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side for desktop */}
      <div className="hidden md:flex w-1/2 bg-black text-white justify-center items-center">
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg ">
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-black">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-gray-400"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-black">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full mt-1 p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-gray-400"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Forgot Password & Sign Up Links */}
            <div className="flex justify-between text-sm text-black">
              <Link href="" className="hover:underline">Forgot Password?</Link>
              <Link href="/signup" className="hover:underline">Don't have an account? Sign Up</Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition shadow-md"
            >
              Login
            </button>
            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Sign in with Google */}
            <SignInWithGoogleComponents />
          </form>
        </div>
      </div>
    </div>
  );
}


function SignInWithGoogleComponents() {
  const [loading, setIsLoading] = useState(false)
  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
    } catch (error) {
      console.log(error.message)
    }
    setIsLoading(false)
  }

  return (<Button
    type="button"
    className={`w-full flex items-center justify-center border  py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all shadow-md ${loading ? "bg-gray-200 cursor-not-allowed" : ""}`}
    onClick={handleLogin}
    disabled={loading}

  >

    <FcGoogle className="text-2xl mr-2" /> Sign in with Google
    {loading && <CircularProgress size={20} thickness={7} color="primary" />
    }

  </Button>)
}