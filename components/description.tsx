import type { NextPage } from 'next'
import styles from '../styles/Index.module.css'

type Props = {
	visible: boolean
}

const Description: NextPage<Props> = (props) => {
	return (
		<div className={styles.container} style={{ display: props.visible ? 'inherit' : 'none' }}>
			<h1>MasterMind</h1>
			<p>
				MasterMind is a famous two player game. The game consists of a game board with slots for colored pins.
				These colored pins are available in eight different colors:{' '}
				<span style={{ color: 'red' }}>Red</span>,{' '}
				<span style={{ color: 'blue' }}>Blue</span>,{' '}
				<span style={{ color: 'green' }}>Green</span>,{' '}
				<span style={{ color: 'yellow' }}>Yellow</span>,{' '}
				<span style={{ color: 'purple' }}>Purple</span>,{' '}
				<span style={{ color: 'sandybrown' }}>Brown</span>,{' '}
				<span style={{ color: 'black', background: 'white' }}>Black</span> and{' '}
				<span style={{ color: 'white' }}>White</span>.
			</p>
			<p>
				One player creates a code of 4 pins which is hidden to the other player. There are many possibilities for the code. Each color may be used multiple times.<br/>
				The other player{"'"}s task is to guess the code. But it is not random guessing. After each guess the player gets a feedback from the player who created the code.<br/>
				Each correct colored and positioned pin in the guess (consisting of 4 pins) gets a black feedback pin and each correct colored pin in the guess gets a white feedback pin.<br/>
			</p>
		</div>
	)
}

export default Description
