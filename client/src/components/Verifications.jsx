import React from "react";

const Verifications = ({ stateName, line1, line2 }) => {
  if (line2 == "") line2 = line1;
  return (
    <div className="text-xs pl-3">
      {!stateName && <p className="text-red-500">{line1} <span className="text-sm">!</span>
        
        </p>}
      {stateName && <p className="text-green-500">{line2} ✔</p>}
    </div>
  );
};

export default Verifications;
