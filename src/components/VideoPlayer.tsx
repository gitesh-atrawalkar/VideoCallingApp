import { useEffect, useRef } from "react"

export const VideoPlayer = ({user}) => {

    const ref = useRef();
    useEffect(() => {
        user.videoTrack.play(ref.current)
    },[])
    return (
        <div>
        uid: {user.uid}
        <div ref={ref} style={{width:'200px', height: '200px'}}>
            
        </div>
        </div>
    )
}