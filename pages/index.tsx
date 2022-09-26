import type { NextPage } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import { ClientToServerEvents, ServerToClientEvents } from '../server/SocketTypes';
import styles from '../styles/Index.module.css';
import Description from '../components/description';
import Login from '../components/login';
import { io, Socket } from 'socket.io-client';

const Index: NextPage = () => {
    const [playing, setPlaying] = useState(false);

    const play = (room: string, name: string) => {
        setPlaying(true);

        const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
        socket.on('connect', () => {
            socket.emit('play', room, name)
        })
    }

    return (
        <div className={styles.container}>
            <Description visible={!playing}/>

            <Login visible={!playing} playNowListener={(room, name) => play(room, name)}/>

            <footer className={styles.footer}>
                <a href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                   target="_blank"
                   rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
}

export default Index
