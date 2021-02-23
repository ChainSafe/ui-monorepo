export interface IDrawerOverride {
  root?: Record<string, any>;
  backdrop?: {
    root?: Record<string, any>;
    open?: Record<string, any>;
    transparent?: Record<string, any>;
  };
  position?: {
    top?: {
      root?: Record<string, any>;
      open?: Record<string, any>;
    };
    bottom?: {
      root?: Record<string, any>;
      open?: Record<string, any>;
    };
    right?: {
      root?: Record<string, any>;
      open?: Record<string, any>;
    };
    left?: {
      root?: Record<string, any>;
      open?: Record<string, any>;
    };
  };
}
