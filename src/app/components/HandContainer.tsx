import { FC } from "react";

interface HandContainerProps {
  children?: React.ReactNode;
}

const HandContainer: FC<HandContainerProps> = ({ children }) => {
  return (
    <div className="overflow-x-scroll overflow-y-visible flex">
      <div className="flex py-4 w-full mx-4">{children}</div>
    </div>
  );
};

export default HandContainer;
