import { NextPage } from 'next';
import styles from '../styles/Index.module.css';

const RoleSelector: NextPage<{ setRole: (role: 'guesser' | 'setter') => void }> = ({ setRole }) => {
	return (
		<div className={ styles.container }>
			<p>No connected player selected a role for the next round. Make your choice:</p>
			<div>
				<button onClick={ () => setRole('guesser') }>I would like to guess the code!</button>
				<button onClick={ () => setRole('setter') }>Let me choose a random code!</button>
			</div>
		</div>
	);
};

export default RoleSelector;
