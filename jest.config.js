module.exports = {
  "preset": "react-native",
  "setupFilesAfterEnv": [
    "@testing-library/jest-native/extend-expect"
  ],
 "transformIgnorePatterns": [
    "node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-firebase|react-native-reanimated)/)"
  ],
  "setupFiles": [
    "./jest.setup.js"
  ]
};
