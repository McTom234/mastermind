'use client';

import { ForwardedRef, forwardRef, HTMLProps } from 'react';

const input = forwardRef((props: HTMLProps<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
  return <input ref={ref} {...props} />;
})
input.displayName = 'Input';

export default input;