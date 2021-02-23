export interface ITextInputOverride {
  root?: Record<string, any>;
  disabled?: Record<string, any>;
  size?: {
    large?: Record<string, any>;
    medium?: Record<string, any>;
    small?: Record<string, any>;
  };

  inputArea?: {
    root?: Record<string, any>;
    size?: {
      large?: Record<string, any>;
      medium?: Record<string, any>;
      small?: Record<string, any>;
    };
  };

  input?: {
    root?: Record<string, any>;
    focus?: Record<string, any>;
    hover?: Record<string, any>;
    disabled?: Record<string, any>;
  };

  caption?: Record<string, any>;
  label?: Record<string, any>;
  icon?: {
    root?: Record<string, any>;
    size?: {
      large?: {
        root?: Record<string, any>;
        left?: Record<string, any>;
        right?: Record<string, any>;
      };
      medium?: {
        root?: Record<string, any>;
        left?: Record<string, any>;
        right?: Record<string, any>;
      };
      small?: {
        root?: Record<string, any>;
        left?: Record<string, any>;
        right?: Record<string, any>;
      };
    };
  };
}
