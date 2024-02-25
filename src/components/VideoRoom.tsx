import AgoraRTC, { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng"
import { useEffect, useState } from "react"
import { VideoPlayer } from "./VideoPlayer"

export const VideoRoom = () => {

    const App_Id = 'eca14af318404192983a6e89702db7e8'
    const Token = '007eJxTYMgKXbQ8r0VeVub/N4YP0YZ/NarSl3Q8D3xg8qHfe6phXpQCQ2pyoqFJYpqxoYWJgYmhpZGlhXGiWaqFpbmBUUqSeaqFtsPt1IZARobkLDsWRgYIBPFZGNIzS6oYGAAlwR5n'
    const CHANNEL = 'gitz'

    const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: "vp8"
    })
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);
    const handleUserJoined = async (user: any, mediaType: any) => {
        await client.subscribe(user, mediaType);

        if(mediaType === 'video') {
            setUsers((previousUsers)=> [...previousUsers, user]);
        }

        if(mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    const handleUserLeft = (user) => {
        setUsers((prevoiusUsers)=> 
            prevoiusUsers.filter((u) => u.id !== user.uid)
        );
    }

    useEffect(() => {
        client.on('user-published', handleUserJoined)
        client.on('user-left', handleUserLeft)

        client
        .join(App_Id, CHANNEL, Token)
        .then((uid) => 
            Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
        ).then(([tracks, uid]) =>{
                const [audioTrack, videoTrack] = tracks;
                setLocalTracks(tracks);
                setUsers((previousUsers) => [
                    ...previousUsers,
                    {
                        uid,
                        videoTrack,
                        audioTrack,
                    },
                ])
            
                client.publish(tracks);
            });
        return () => {
            for (let localTrack of localTracks){
                localTrack.stop();
                localTrack.close(); 
            }
            client.off('user-published', handleUserJoined)
            client.off('user-left', handleUserLeft)
            client.unpublish(tracks).then(() => client.leave());
        }
    },[]);

return (
    <div >
        VideoRoom
        <div style={{display:'flex', justifyContent:'center'}}>
        {users.map((user) => (
            <VideoPlayer key={user.uid} user={user}/>
        ))}
        </div>
    </div>
);
};


