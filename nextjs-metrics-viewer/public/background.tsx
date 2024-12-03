import * as React from "react";
const SvgComponent = (props?: any) => (
  <svg {...props}>
    <defs>
      <pattern
        id="a"
        width={78}
        height={78}
        patternTransform="rotate(135)"
        patternUnits="userSpaceOnUse"
        viewBox="0 0 40 40"
      >
        <rect width="100%" height="100%" fill="rgba(177, 240, 247,1)" />
        <path
          fill="rgba(129, 191, 218,1)"
          d="M-10 30h60v6h-60zm0-40h60v6h-60"
        />
        <path
          fill="rgba(250, 218, 122,1)"
          d="M-10 13h60v3h-60zm0-40h60v3h-60z"
        />
      </pattern>
    </defs>
    <rect width="200%" height="200%" fill="url(#a)" />
  </svg>
);
export default SvgComponent;
