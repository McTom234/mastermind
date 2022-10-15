import { NextPage } from 'next';
import { useState } from 'react';
import { Roles } from '../server/SocketTypes';
import VisibleContainer from './visibleContainer';

const RoleSelector: NextPage<{ setRole: (role: Roles) => void }> = ({ setRole }) => {
	let [visible, setVisible] = useState(true);
	return (
		<>
			<VisibleContainer visible={ visible }>
				<p>No connected player selected a role for the next round. Make your choice:</p>
				<div>
					<button onClick={ () => {
						setRole(Roles.GUESSER);
						setVisible(false);
					} }>I would like to guess the code!
					</button>
					<button onClick={ () => {
						setRole(Roles.SETTER);
						setVisible(false);
					} }>Let me choose a random code!
					</button>
				</div>
			</VisibleContainer>
			<VisibleContainer visible={ !visible }>
				<p>You made your choice. Let{ '\'' }s wait for server feedback...</p>
			</VisibleContainer>
		</>
	);
};

export default RoleSelector;
