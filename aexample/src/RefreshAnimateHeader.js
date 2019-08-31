'use strict';
import React, { useRef, useCallback, useMemo } from 'react';
import { StyleSheet, Animated, Platform, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';
import { RefreshHeader, RefreshState } from 'react-native-refresh';

function RefreshAnimateHeader(props) {
  const { refreshing, onRefresh, source } = props;

  const lottieRef = useRef(React.createRef());
  const progressRef = useRef(new Animated.Value(1));
  const currentState = useRef(RefreshState.Idle);

  const onPullingRefreshCallBack = useCallback((state) => {
    currentState.current = state;
  }, []);

  const onRefreshCallBack = useCallback(
    (state) => {
      currentState.current = state;
      setTimeout(() => {
        lottieRef.current.play();
      }, 0);
      onRefresh && onRefresh(state);
    },
    [onRefresh],
  );

  const onEndRefreshCallBack = useCallback((state) => {
    currentState.current = state;
    setTimeout(() => {
      lottieRef.current.reset();
    }, 70);
  }, []);

  const onChangeOffsetCallBack = useCallback((event) => {
    const { offset } = event.nativeEvent;
    if (currentState.current === RefreshState.Idle) {
      progressRef.current.setValue(offset);
    }
  }, []);

  return (
    <RefreshHeader
      style={styles.container}
      refreshing={refreshing}
      onChangeOffset={onChangeOffsetCallBack}
      onPullingRefresh={onPullingRefreshCallBack}
      onRefresh={onRefreshCallBack}
      onEndRefresh={onEndRefreshCallBack}
    >
      <LottieView
        ref={lottieRef}
        style={styles.lottery}
        resizeMode={'cover'}
        loop={true}
        autoSize={false}
        autoPlay={false}
        speed={2}
        source={source}
        hardwareAccelerationAndroid={true}
        cacheStrategy={'strong'}
        enableMergePathsAndroidForKitKatAndAbove={true}
        progress={progressRef.current.interpolate({
          inputRange: [0, 300],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })}
      />
      {props.children}
    </RefreshHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottery: {
    height: 80,
  },
});

export default React.memo(RefreshAnimateHeader);
