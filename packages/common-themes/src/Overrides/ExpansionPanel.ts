export interface IExpansionPanelOverride {
  root?: Record<string, any>;
  basic?: Record<string, any>;
  borderless?: Record<string, any>;
  icon?: Record<string, any>;

  heading?: {
    root?: Record<string, any>;
    active?: Record<string, any>;
    borderless?: {
      root?: Record<string, any>;
      active?: Record<string, any>;
    };
    basic?: {
      root?: Record<string, any>;
      active?: Record<string, any>;
    };
  };

  content?: {
    root?: Record<string, any>;
    active?: Record<string, any>;
    basic?: {
      root?: Record<string, any>;
      active?: Record<string, any>;
    };
  };
}
