import { FC } from "react";

interface Class {
  classes: string;
}

const SmallLogo: FC<Class> = (props) => {
  return (
    <img
      className={props.classes}
      src="/images/logo_transparent_small.png"
      alt="Logo"
    />
  );
};

export default SmallLogo;
