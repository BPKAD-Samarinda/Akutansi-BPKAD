declare module "react-glassmorphism" {
  import { ReactNode } from "react";

  const Glassmorphism: React.FC<{
    blur?: number;
    transparency?: number;
    color?: string;
    borderRadius?: number;
    className?: string;
    children?: ReactNode;
  }>;

  export default Glassmorphism;
}
