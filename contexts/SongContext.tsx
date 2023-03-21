import useSpotify from "@/hooks/useSpotify"
import { songReducer } from "@/reducers/songReducer"
import { ISongContext, SongContextState, SongReducerActionType } from "@/types"
import { useSession } from "next-auth/react"
import { createContext, ReactNode, useContext, useEffect, useReducer } from "react"

const defaultSongContextState: SongContextState = {
    selectedSongId: undefined,
    selectedSong: null,
    isPlaying: false,
    volume: 50,
    deviceId: null
}

export const SongContext = createContext<ISongContext>({
    songContextState: defaultSongContextState,
    dispatchSongAction: () => { }
})

export const useSongContext = () => useContext(SongContext)

const SongContextProvider = ({ children }: { children: ReactNode }) => {
    const spotifyApi = useSpotify()
    const { data: session } = useSession()

    const [songContextState, dispatchSongAction] = useReducer(songReducer, defaultSongContextState)

    useEffect(() => {
        const setCurrentDevice = async () => {
            const availableDevicesResponse = await spotifyApi.getMyDevices()

            if (!availableDevicesResponse.body.devices.length) return

            const { id: deviceId, volume_percent } = availableDevicesResponse.body.devices[0]

            dispatchSongAction({
                type: SongReducerActionType.SetDevice,
                payload: {
                    deviceId,
                    volume: volume_percent as number
                }
            })

            // transfer to my app
            await spotifyApi.transferMyPlayback([deviceId as string])
        }

        if (spotifyApi.getAccessToken()) {
            setCurrentDevice()
        }
    }, [spotifyApi, session])

    useEffect(() => {
        const getCurrentPlayingSong = async () => {
            const songInfo = await spotifyApi.getMyCurrentPlayingTrack()

            if (!songInfo.body) return

            console.log('Song info', songInfo.body)

            dispatchSongAction({
                type: SongReducerActionType.SetCurrentPlayingSong,
                payload: {
                    selectedSongId: songInfo.body.item?.id,
                    selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
                    isPlaying: songInfo.body.is_playing
                }
            })
        }

        if (spotifyApi.getAccessToken()) {
            getCurrentPlayingSong()
        }
    }, [spotifyApi, session])

    const songContextProviderData: ISongContext = {
        songContextState,
        dispatchSongAction
    }

    return (
        <SongContext.Provider value={songContextProviderData}>
            {children}
        </SongContext.Provider>
    )
}

export default SongContextProvider