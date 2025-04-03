import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const EmailOutline = () => (
  <Svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x={3}
      y={6}
      width={18}
      height={12}
      rx={2}
      stroke="#333333"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.5737 7L12 13L3.42635 7"
      stroke="#333333"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default EmailOutline;
