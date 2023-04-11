import { ForwardedRef, forwardRef, HTMLProps } from 'react';
import styles from 'src/styles/new/components/atoms/button.module.scss';
import { cn } from 'src/lib/helpers';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  containerClass?: string;
}

const Button = forwardRef(({ containerClass, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <div className={cn(styles['container'], containerClass)}>
      <button ref={ref} {...props}></button>
    </div>
  );
});
Button.displayName = 'Button';

export default Button;