import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const AccountOutline = () => (
  <Svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle
      cx={12}
      cy={7}
      r={4}
      stroke="#000000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 21V17C4 15.8954 4.89543 15 6 15H18C19.1046 15 20 15.8954 20 17V21"
      stroke="#000000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default AccountOutline;
