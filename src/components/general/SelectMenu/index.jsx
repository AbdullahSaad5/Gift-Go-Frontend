import { Select } from "@mantine/core";
import React from "react";
const SelectMenu = (
  {
    value,
    placeholder,
    leftIcon,
    searchable,
    required,
    label,
    pb,
    data,
    clearable,
    withAsterisk,
    onChange,
    creatable,
    form,
    size = "md",
    validateName,
    width,
    borderRadius,
    my,
    borderWhite,
    customIcon,
    flex,
    disabled,
    display,
    ...props
  },
  ref
) => {
  return (
    <Select
      ref={ref}
      my={my}
      w={width}
      display={display}
      disabled={disabled}
      required={required}
      searchable={searchable}
      withAsterisk={withAsterisk}
      label={label}
      pb={pb}
      size={size}
      clearable={clearable}
      onChange={onChange}
      data={data}
      icon={customIcon ? customIcon : leftIcon ? <img src={require(`../../assets/${leftIcon}.svg`)} alt="icon" /> : ""}
      styles={{
        root: {
          flex: flex,
        },
      }}
      placeholder={placeholder || label}
      value={value}
      {...form?.getInputProps(validateName)}
      {...props}
    />
  );
};
export default React.forwardRef(SelectMenu);
