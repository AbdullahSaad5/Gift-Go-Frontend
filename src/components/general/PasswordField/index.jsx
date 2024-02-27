import { PasswordInput, TextInput } from "@mantine/core";

const PasswordField = ({
  placeholder,
  leftIcon,
  required,
  type = "text",
  label,
  pb,
  onChange,
  form,
  value,
  size = "md",
  validateName,
  disabled,
  onKeyDown,
  mask,
  maxLength,
  component,
  readOnly = false,
  ...props
}) => {
  return (
    <PasswordInput
      withAsterisk={required ? true : false}
      label={label}
      pb={pb}
      size={size}
      type={type}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      component={component}
      mask={mask}
      readOnly={readOnly}
      {...form?.getInputProps(validateName)}
      leftSection={
        leftIcon ? <img src={new URL(`../../../assets/${leftIcon}.svg`, import.meta.url).href} alt="icon" /> : ""
      }
      placeholder={placeholder || label}
      {...props}
    />
  );
};
export default PasswordField;
