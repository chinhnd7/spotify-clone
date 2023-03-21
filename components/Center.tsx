import { usePlaylistContext } from '@/contexts/PlaylistContext'
import UserIcon from '../assets/user.png'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { pickRandom } from '@/utils/pickRandom'
import Songs from './Songs'

const colours = [
    'from-indigo-800',
    'from-blue-800',
    'from-green-800',
    'from-rose-800',
    'from-yellow-800',
    'from-red-800',
    'from-purple-800',
]

const Center = () => {
    const { playlistContextState: { selectedPlaylist, selectedPlaylistId } } = usePlaylistContext()
    const { data: session } = useSession()

    const [fromColour, setFromColour] = useState<string | null>(null)

    useEffect(() => {
        setFromColour(pickRandom(colours))
    }, [selectedPlaylistId])

    return (
        <div className='flex-grow text-white relative h-screen overflow-y-scroll scrollbar-hidden'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2' onClick={() => {
                    signOut()
                }}>
                    <Image src={session?.user?.image || UserIcon} alt='User Avartar' height='40' width='40' className='rounded-full object-cover' />
                    <h2>{session?.user?.name}</h2>
                    <ChevronDownIcon className='icon' />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b ${fromColour} to-black h-80 p-8`}>
                {
                    selectedPlaylist && (
                        <>
                            <Image src={selectedPlaylist.images[0].url} alt='Playlist Image' height='176' width='176' className='shadow-2xl' />
                            <div>
                                <p>PLAYLIST</p>
                                <h1 className='text-2xl font-bold md:text-3xl xl:text-5xl' >
                                    {selectedPlaylist.name}
                                </h1>
                            </div>
                        </>
                    )
                }
            </section>

            <div>
                <Songs />
            </div>
        </div >
    )
}

export default Center