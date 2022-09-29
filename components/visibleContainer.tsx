import type { NextPage } from 'next'
import { ReactNode } from 'react';

type Props = {
	visible: boolean
	className?: string
	children: ReactNode
}

const VisibleContainer: NextPage<Props> = (props) => {
	return (
		<div className={props.className} style={{ display: props.visible ? 'inherit' : 'none' }}>
			{props.children}
		</div>
	)
}

export default VisibleContainer
