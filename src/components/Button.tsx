export default function Button({children, variant='primary', className='', ...props}){
    const base = "inline-flex items-center justify-center gap-2 font-medium transition";
    const variants = {
      primary: "px-4 py-2 rounded-pill bg-accent text-white hover:bg-accent-600 focus:ring-2 focus:ring-accent-400",
      ghost: "px-4 py-2 rounded-pill glass border border-glass text-text hover:translate-y-[-1px]",
      outline: "px-3 py-1.5 rounded-pill border border-glass text-text",
    }
    return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
  }
  