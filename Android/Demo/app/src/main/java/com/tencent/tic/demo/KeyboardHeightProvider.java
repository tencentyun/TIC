package com.tencent.tic.demo;

import android.app.Activity;
import android.graphics.Point;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnAttachStateChangeListener;
import android.view.ViewTreeObserver;
import android.view.WindowManager.LayoutParams;
import android.widget.PopupWindow;


/**
 * The keyboard height provider, this class uses a PopupWindow to calculate the window height when
 * the floating keyboard is opened and closed.
 */
public class KeyboardHeightProvider extends PopupWindow {

    /**
     * The tag for logging purposes
     */
    private final static String TAG = "KeyboardHeightProvider";

    /**
     * The keyboard height observer
     */
    private KeyboardHeightObserver observer;

    /**
     * The cached landscape height of the keyboard
     */
    private int keyboardLandscapeHeight;

    /**
     * The cached portrait height of the keyboard
     */
    private int keyboardPortraitHeight;

    /**
     * The view that is used to calculate the keyboard height
     */
    private View popupView;

    /**
     * The parent view
     */
    private View parentView;

    /**
     * The root activity that uses this KeyboardHeightProvider
     */
    private Activity activity;


    private OnAttachStateChangeListener attachStateChangeListener;

    private int lastHeight = 0;

    /**
     * Construct a new KeyboardHeightProvider
     *
     * @param activity The parent activity
     */
    public KeyboardHeightProvider(Activity activity) {
        super(activity);
        this.activity = activity;

        LayoutInflater inflator = (LayoutInflater) activity.getBaseContext().
                getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
        popupView = inflator.inflate(R.layout.popupwindow, null, false);
        setContentView(popupView);
        setSoftInputMode(LayoutParams.SOFT_INPUT_ADJUST_RESIZE
                | LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        setInputMethodMode(PopupWindow.INPUT_METHOD_NEEDED);


        parentView = activity.findViewById(android.R.id.content);

        Log.i(TAG, "KeyboardHeightProvider parentView: " + parentView.toString());
        setWidth(0);
        setHeight(LayoutParams.MATCH_PARENT);

        
        popupView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Log.i(TAG, "onGlobalLayout");
                if (popupView != null) {
                    handleOnGlobalLayout();
                }
            }
        });

        attachStateChangeListener = new OnAttachStateChangeListener() {
            @Override
            public void onViewAttachedToWindow(View v) {
                Log.i(TAG, "onViewAttachedToWindow");
                if (null != v.getWindowToken()) {
                    setBackgroundDrawable(new ColorDrawable(0));
                    showAtLocation(parentView, Gravity.NO_GRAVITY, 0, 0);
                }
            }

            @Override
            public void onViewDetachedFromWindow(View v) {
                Log.i(TAG, "onViewDetachedFromWindow");
            }
        };
        parentView.addOnAttachStateChangeListener(attachStateChangeListener);
    }

    /**
     * Start the KeyboardHeightProvider, this must be called after the onResume of the Activity.
     * PopupWindows are not allowed to be registered before the onResume has finished of the
     * Activity.
     */
    public void start() {

        if (!isShowing() && parentView.getWindowToken() != null) {
            Log.i(TAG, "start !isShowing() && parentView.getWindowToken() != null");
            setBackgroundDrawable(new ColorDrawable(0));
            showAtLocation(parentView, Gravity.NO_GRAVITY, 0, 0);
        }
    }

    @Override
    public void dismiss() {
        parentView.removeOnAttachStateChangeListener(attachStateChangeListener);
        super.dismiss();
    }

    /**
     * Close the keyboard height provider, this provider will not be used anymore.
     */
    public void close() {
        this.observer = null;
        dismiss();
    }

    /**
     * Set the keyboard height observer to this provider. The observer will be notified when the
     * keyboard height has changed. For example when the keyboard is opened or closed.
     *
     * @param observer The observer to be added to this provider.
     */
    public void setKeyboardHeightObserver(KeyboardHeightObserver observer) {
        this.observer = observer;
    }

    /**
     * Popup window itself is as big as the window of the Activity. The keyboard can then be
     * calculated by extracting the popup view bottom from the activity window height.
     */
    private void handleOnGlobalLayout() {
        Log.i(TAG, "handleOnGlobalLayout");

        Point screenSize = new Point();
        activity.getWindowManager().getDefaultDisplay().getSize(screenSize);

        Rect rect = new Rect();
        popupView.getWindowVisibleDisplayFrame(rect);

        // REMIND, you may like to change this using the fullscreen size of the phone
        // and also using the status bar and navigation bar heights of the phone to calculate
        // the keyboard height. But this worked fine on a Nexus.
        int orientation = getScreenOrientation();
        int keyboardHeight = screenSize.y - rect.bottom;

        Log.w(TAG, "screenSize y:" + screenSize.y+" rect.bottom："+rect.bottom);

        Log.w(TAG, "handleOnGlobalLayout width:" + activity.getWindowManager().getDefaultDisplay().getWidth());
        Log.w(TAG, "handleOnGlobalLayout height:" + activity.getWindowManager().getDefaultDisplay().getHeight());

        if (keyboardHeight != lastHeight) {
            Log.i(TAG, "handleOnGlobalLayout keyboardHeight: " + keyboardHeight + ", lastHeight: "
                    + lastHeight);
            notifyKeyboardHeightChanged(keyboardHeight, orientation);
            lastHeight = keyboardHeight;
        }

    }

    private int getScreenOrientation() {
        return activity.getResources().getConfiguration().orientation;
    }

    private void notifyKeyboardHeightChanged(int height, int orientation) {
        Log.i(TAG, "notifyKeyboardHeightChanged height: " + height + ", orientation: " + orientation);
        if (observer != null) {
            observer.onKeyboardHeightChanged(height, orientation);
        }
    }

}
