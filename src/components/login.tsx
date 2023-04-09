import type { NextPage } from 'next';
import { useState } from 'react';

const Login: NextPage = () => {
	const [playAGame, setPlayAGame] = useState(false);

	return (
		<div>
			<button onClick={ () => setPlayAGame(true) }
			        style={ { display: playAGame ? 'none' : 'inherit' } }>
				Let us play a game!
			</button>

			<div style={ { display: playAGame ? 'inherit' : 'none' } }>
				<form action={ '/play' } method={ 'GET' }>
					<label htmlFor={ 'room' }>Room Name:</label>
					<input name={ 'room' } type={ 'text' } id={ 'room' } required />

					<label htmlFor={ 'name' }>Your Name:</label>
					<input name={ 'name' } type={ 'text' } id={ 'name' } required />

					<button type={ 'submit' }>Play now!</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
