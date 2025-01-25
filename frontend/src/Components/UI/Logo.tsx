import { FC } from "react";

interface Class {
  classes: string;
}

const Logo: FC<Class> = (props) => {
  return (
    <img
      className={props.classes}
      src="/images/logo_transparent.png"
      alt="Logo"
    />
  );
};

export default Logo;
