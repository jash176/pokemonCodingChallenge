import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()

export function navigateTo(routeName: string, params?: object) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
  }