import type { NextPage } from 'next'
import { useState } from 'react';
import styles from '../styles/Index.module.css'

type Props = {
	playNowListener: (room: string, name: string) => void,
	visible: boolean
}

const Login: NextPage<Props> = (props) => {
	const [playAGame, setPlayAGame] = useState(false);
	const showPlayAGame = () => setPlayAGame(true);

	const [room, setRoom] = useState('');
	const [name, setName] = useState('');

	return (
		<div className={styles.container} style={{ display: props.visible ? 'inherit' : 'none' }}>
			<button onClick={showPlayAGame} style={{ display: playAGame ? 'none' : 'inherit' }}>Let us play a game!</button>

			<div style={{ display: playAGame ? 'inherit' : 'none' }}>
				<label htmlFor={'room'}>Room Name:</label>
				<input name={'room'} type={'text'} onChange={(e) => setRoom(e.target.value)} required id={'room'} />

				<label htmlFor={'player'}>Your Name:</label>
				<input name={'player'} type={'text'} onChange={(e) => setName(e.target.value)} required id={'player'} />

				<button onClick={() => {props.playNowListener(room, name);}}>Play now!</button>
			</div>
		</div>
	)
}

export default Login
