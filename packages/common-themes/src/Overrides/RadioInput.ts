export interface IRadioInputOverride {
  radioContainer?: Record<string, any>;
  radioInput?: Record<string, any>;
  radio?: {
    root?: Record<string, any>;
    checked?: Record<string, any>;
    disabled?: Record<string, any>;
  };
  label?: Record<string, any>;
  labelDisabled?: Record<string, any>;
  error?: Record<string, any>;
}
