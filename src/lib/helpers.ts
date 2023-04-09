export function cn(...classNames: (string | undefined)[]) {
  return classNames.reduce((classes, className) => (className ? `${classes} ${className}` : classes), '') ?? '';
}
