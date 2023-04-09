import React, { ForwardedRef, forwardRef, HTMLProps, ReactNode } from 'react';
import styles from '../../styles/new/components/input.module.scss';
import { cn } from '../../lib/helpers';

interface InputProps extends HTMLProps<HTMLInputElement> {
  icon?: ReactNode;
  label: string;
  containerClass?: string;
}

const Input = forwardRef(({ icon, label, containerClass, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div className={cn(styles['container'], containerClass)}>
      <label htmlFor={props.id}>{label}</label>
      <div className={cn(styles['wrapper'], icon ? styles['with-icon'] : undefined)}>
        <input ref={ref} {...props} />
        {icon && icon}
      </div>
    </div>
  );
});
Input.displayName = 'Input';

export default Input;
