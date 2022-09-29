import type { NextPage } from 'next';
import { ReactNode } from 'react';
import styles from '../styles/VisibleContainer.module.sass';

type Props = {
	visible: boolean
	className?: string
	children: ReactNode
}

const VisibleContainer: NextPage<Props> = (props) => {
	const className = !props.visible ? (props.className ? ' ' : '') + styles.hidden : '';

	return (
		<div className={ `${ props.className ?? '' }${ className }` }>
			{ props.children }
		</div>
	);
};

export default VisibleContainer;
