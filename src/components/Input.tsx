import { HTMLProps, MouseEvent, Ref } from 'react';
import Image from 'next/image';
import styles from '../styles/components/input.module.scss';
import { cn } from '../lib/helpers';
import Input_CS from './Input_CS';

interface InputProps extends HTMLProps<HTMLInputElement> {
  icon?: { iconSrc: string; iconAlt: string; onIconClick: (event: MouseEvent<HTMLImageElement>) => void };
  label: string;
  ref?: Ref<HTMLInputElement>
}

export default function Input({ icon, label, ...props }: InputProps) {
  return (
    <div className={styles['container']}>
      <label htmlFor={props.id}>{label}</label>
      <div className={cn(styles['wrapper'], icon && styles['with-icon'])}>
        <Input_CS {...props} />
        {icon && <Image src={icon.iconSrc} alt={icon.iconAlt} onClick={icon.onIconClick} />}
      </div>
    </div>
  );
}
