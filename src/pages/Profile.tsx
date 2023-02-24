import React from 'react'

import {
  isSignedIn,
  signInWithGoogle,
  signOutOfGoogle,
} from './../lib/firebase'

function Profile() {
  const signedInName = localStorage.getItem('name')
  const signedInEmail = localStorage.getItem('email')
  const singedInImg = localStorage.getItem('userImg')

  return (
    <div className="grid w-full grid-cols-8 gap-4">
      <div className="col-span-6 col-start-2 mt-2 min-h-screen rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <h1 className="text-l my-12 font-bold dark:text-white sm:text-xl md:text-3xl">
          Profile
        </h1>
        {isSignedIn() ? (
          <div>
            <button
              onClick={signOutOfGoogle}
              className="rounded-md bg-slate-200 p-4"
            >
              Log Out
            </button>
            <div className="my-12">
              <h1 className="text-black dark:text-white">{signedInName}</h1>
              <h2 className="text-black dark:text-white">{signedInEmail}</h2>
              {singedInImg ? (
                <img
                  src={singedInImg}
                  className="mx-auto my-4 rounded-full"
                  alt="signedInUserImg"
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="rounded-md bg-slate-200 p-4"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  )
}

export default Profile
