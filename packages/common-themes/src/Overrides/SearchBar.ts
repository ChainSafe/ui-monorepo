export interface ISearchBarOverride {
  root?: Record<string, any>;
  standardIcon?: {
    root: Record<string, any>;
    size?: {
      large?: Record<string, any>;
      medium?: Record<string, any>;
      small?: Record<string, any>;
    };
  };
  size?: {
    large?: Record<string, any>;
    medium?: Record<string, any>;
    small?: Record<string, any>;
  };
  input?: {
    root?: Record<string, any>;
    hover?: Record<string, any>;
    focus?: Record<string, any>;
    disabled?: Record<string, any>;
  };
  inputArea?: {
    large?: {
      root?: Record<string, any>;
      input?: Record<string, any>;
    };
    medium?: {
      root?: Record<string, any>;
      input?: Record<string, any>;
    };
    small?: {
      root?: Record<string, any>;
      input?: Record<string, any>;
    };
  };
}
