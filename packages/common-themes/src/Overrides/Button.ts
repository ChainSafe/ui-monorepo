export interface IButtonOverride {
  root?: Record<string, any>;
  size?: {
    large?: Record<string, any>;
    medium?: Record<string, any>;
    small?: Record<string, any>;
  };
  icon?: {
    root?: Record<string, any>;
    large?: Record<string, any>;
    medium?: Record<string, any>;
    small?: Record<string, any>;
  };
  variants?: {
    primary?: {
      root?: Record<string, any>;
      hover?: Record<string, any>;
      focus?: Record<string, any>;
      active?: Record<string, any>;
    };
    outline?: {
      root?: Record<string, any>;
      hover?: Record<string, any>;
      focus?: Record<string, any>;
      active?: Record<string, any>;
    };
    dashed?: {
      root?: Record<string, any>;
      hover?: Record<string, any>;
      focus?: Record<string, any>;
      active?: Record<string, any>;
    };
  };
  state?: {
    danger?: {
      root?: Record<string, any>;
      hover?: Record<string, any>;
      focus?: Record<string, any>;
      active?: Record<string, any>;
    };
    disabled?: {
      root?: Record<string, any>;
      hover?: Record<string, any>;
    };
  };
}
