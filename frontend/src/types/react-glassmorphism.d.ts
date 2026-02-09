declare module "react-glassmorphism" {
  import { ReactNode, FC } from "react";

  const Glassmorphism: FC<{
    blur?: number;
    transparency?: number;
    color?: string;
    borderRadius?: number;
    className?: string;
    children?: ReactNode;
  }>;

  export default Glassmorphism;
}
