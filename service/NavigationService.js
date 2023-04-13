import * as React from 'react';
import { CommonActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.navigate({
      name,
      params,
    })
  );
}

export function reset(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    })
  );
}