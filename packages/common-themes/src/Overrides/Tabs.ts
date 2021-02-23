export interface ITabsOverride {
  tabList?: Record<string, any>;
  tabBar?: {
    root?: Record<string, any>;
    selected?: Record<string, any>;
  };
}
