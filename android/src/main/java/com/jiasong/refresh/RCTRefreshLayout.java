package com.jiasong.refresh;

import android.content.Context;
import com.scwang.smartrefresh.layout.SmartRefreshLayout;
import android.view.MotionEvent;
import com.facebook.react.uimanager.events.NativeGestureUtil;

public class RCTRefreshLayout extends SmartRefreshLayout  {

    private static final float DEFAULT_CIRCLE_TARGET = 64;

    private boolean mDidLayout = false;
    private boolean mRefreshing = false;
    private float mProgressViewOffset = 0;
    private int mTouchSlop;
    private float mPrevTouchX;
    private boolean mIntercepted;
    public RCTRefreshLayout(Context context) {
        super(context);
    }
    @Override
    public void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);

        if (!mDidLayout) {
            mDidLayout = true;

            // Update values that must be set after initial layout.
            // setProgressViewOffset(mProgressViewOffset);
            // setRefreshing(mRefreshing);
        }

    }


    @Override
    public void requestDisallowInterceptTouchEvent(boolean disallowIntercept) {
        if (getParent() != null) {
            getParent().requestDisallowInterceptTouchEvent(disallowIntercept);
        }
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {
        if (shouldInterceptTouchEvent(ev) && super.onInterceptTouchEvent(ev)) {
            NativeGestureUtil.notifyNativeGestureStarted(this, ev);
            return true;
        }
        return false;
    }


    private boolean shouldInterceptTouchEvent(MotionEvent ev) {
        switch (ev.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mPrevTouchX = ev.getX();
                mIntercepted = false;
                break;

            case MotionEvent.ACTION_MOVE:
                final float eventX = ev.getX();
                final float xDiff = Math.abs(eventX - mPrevTouchX);

                if (mIntercepted || xDiff > mTouchSlop) {
                    mIntercepted = true;
                    return false;
                }
        }
        return true;
    }
}
