import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="text-textColor w-full min-h-screen flex justify-center items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-subTextColor">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
