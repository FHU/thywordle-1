import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { StatBar } from './../components/stats/StatBar'
import {
  auth,
  db,
  logout,
  signInWithGoogle,
  singInWithApple,
  singInWithFacebook,
} from './../lib/firebase'
import { GameStats } from './../lib/localStorage'
import { loadStats } from './../lib/stats'

function Profile() {
  const [user, loading] = useAuthState(auth)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPhotoUrl, setUserPhotoUrl] = useState('')
  const [gameStats, setGameStats] = useState<GameStats>()

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return
    }
    if (user) {
      fetchUserName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      const data = doc.docs[0].data()
      setUserName(data.name)
      setUserEmail(data.email)
      setUserPhotoUrl(data.photoUrl)
    } catch (error) {
      console.error(error)
      alert('An error occured while fetching user data')
    }
  }

  const saveAndDisplayStats = async () => {
    try {
      const stats = loadStats()
      // get a stats instance for signed in user id
      const q = query(collection(db, 'stats'), where('uid', '==', user?.uid))
      const docs = await getDocs(q)

      // if no stat instance exists, save current game stats from local storage to firestore
      if (docs.docs.length === 0) {
        await addDoc(collection(db, 'stats'), {
          uid: user?.uid,
          bestSteak: stats.bestStreak,
          currentSteak: stats.currentStreak,
          gamesFailed: stats.gamesFailed,
          successRate: stats.successRate,
          totalGames: stats.totalGames,
          winDistribution: stats.winDistribution,
        })
      }

      // display user stats from firestore
      const displayStats = await getDocs(q)
      generateStatsDisplay(displayStats.docs[0].data())
    } catch (err) {
      console.error(err)
    }
  }

  function generateStatsDisplay(stats: DocumentData) {
    const displayStats: GameStats = {
      winDistribution: stats.winDistribution,
      gamesFailed: stats.gamesFailed,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
      totalGames: stats.totalGames,
      successRate: stats.successRate,
    }

    setGameStats(displayStats)
  }

  const isLoading = (
    <h2 className="text-l my-12 font-bold dark:text-white">Loading...</h2>
  )

  return (
    <div className="grid w-full grid-cols-8 gap-4">
      <div className="col-span-6 col-start-2 mt-2 min-h-screen rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <h1 className="text-l my-12 font-bold dark:text-white sm:text-xl md:text-3xl">
          Profile
        </h1>

        {loading ? (
          isLoading
        ) : (
          <>
            {user && (
              <>
                <h1 className="text-black dark:text-white">{userName}</h1>
                <h2 className="text-black dark:text-white">{userEmail}</h2>

                <img
                  src={userPhotoUrl}
                  className="mx-auto my-4 rounded-full"
                  alt="signedInUserImg"
                />
              </>
            )}

            {gameStats && <StatBar gameStats={gameStats} />}

            <div className="flex flex-col">
              {user ? (
                <>
                  <button
                    onClick={saveAndDisplayStats}
                    className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4"
                  >
                    Show my Stats
                  </button>
                  <button
                    onClick={logout}
                    className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={signInWithGoogle}
                    className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4"
                  >
                    Sign in with Google
                  </button>
                  <button
                    onClick={singInWithFacebook}
                    className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4"
                  >
                    Sign in with Facebook
                  </button>
                  <button
                    onClick={singInWithApple}
                    className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4"
                  >
                    Sign in with Apple
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
