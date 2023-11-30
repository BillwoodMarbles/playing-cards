import { FC } from "react";

interface HandContainerProps {
  children?: React.ReactNode;
}

const HandContainer: FC<HandContainerProps> = ({ children }) => {
  return (
    <div className="px-6">
      <div className="flex py-4 flex-wrap justify-center w-full pr-12 pb-16">
        {children}
      </div>
    </div>
  );
};

export default HandContainer;
