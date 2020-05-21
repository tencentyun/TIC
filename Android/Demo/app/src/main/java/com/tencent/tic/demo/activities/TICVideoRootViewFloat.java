package com.tencent.tic.demo.activities;

import android.content.Context;
import android.graphics.Color;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.tencent.rtmp.TXLog;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.tic.demo.R;

import java.util.ArrayList;


public class TICVideoRootViewFloat extends RelativeLayout {
    private final static String TAG     = TICVideoRootViewFloat.class.getSimpleName();
    public static final int MAX_USER    = 4;
    private Context mContext;
    private ArrayList<TXCloudVideoView> mVideoViewList;
    private ArrayList<RelativeLayout.LayoutParams> mFloatParamList;
    private String mSelfUserId;

    public TICVideoRootViewFloat(Context context) {
        super(context);
        initView(context);
    }

    public TICVideoRootViewFloat(Context context, AttributeSet attrs) {
        super(context, attrs);
        initView(context);
    }

    public TICVideoRootViewFloat(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        initView(context);
    }

    public void setUserId(String userId) {
        mSelfUserId = userId;
    }

    private void initView(Context context) {
        mContext = context;
        initFloatLayoutParams();
        initTXCloudVideoView();
        showView();
    }

    public void initTXCloudVideoView() {
        mVideoViewList = new ArrayList<TXCloudVideoView>();
        for (int i = 0; i < MAX_USER; i++) {
            TXCloudVideoView cloudVideoView = new TXCloudVideoView(mContext);
            cloudVideoView.setVisibility(GONE);
            cloudVideoView.setId(1000 + i);
            cloudVideoView.setClickable(true);
            cloudVideoView.setTag(R.string.str_tag_pos, i);
            cloudVideoView.setBackgroundColor(Color.BLACK);
            mVideoViewList.add(i, cloudVideoView);
        }
    }

    public void initFloatLayoutParams() {
        mFloatParamList = new ArrayList<RelativeLayout.LayoutParams>();
        RelativeLayout.LayoutParams layoutParams0 = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        mFloatParamList.add(layoutParams0);

        int lrMargin = dip2px(5);
        int bottomMargin = dip2px(5);
        int subWidth = dip2px(60);
        int subHeight = dip2px(90);

        int grid9W = subWidth;
        int grid9H = subHeight;

        LayoutParams layoutParams1 = new LayoutParams(grid9W, grid9H);
        layoutParams1.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        layoutParams1.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams1.bottomMargin = bottomMargin;
        layoutParams1.leftMargin = lrMargin;

        LayoutParams layoutParams2 = new LayoutParams(grid9W, grid9H);
        layoutParams2.addRule(RelativeLayout.CENTER_HORIZONTAL);
        layoutParams2.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams2.bottomMargin = bottomMargin;

        LayoutParams layoutParams3 = new LayoutParams(grid9W, grid9H);
        layoutParams3.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        layoutParams3.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams3.bottomMargin = bottomMargin;
        layoutParams3.rightMargin = lrMargin;

        mFloatParamList.add(layoutParams3);
        mFloatParamList.add(layoutParams2);
        mFloatParamList.add(layoutParams1);
    }

    private void showView() {
        removeAllViews();
        for (int i = 0; i < mVideoViewList.size(); i++) {
            TXCloudVideoView cloudVideoView = mVideoViewList.get(i);
            RelativeLayout.LayoutParams layoutParams = mFloatParamList.get(i);
            cloudVideoView.setLayoutParams(layoutParams);
            addView(cloudVideoView);
        }
    }

    private int dip2px(float dpValue) {
        final float scale = getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }

    public TXCloudVideoView getCloudVideoViewByIndex(int index) {
        return mVideoViewList.get(index);
    }

    public TXCloudVideoView getCloudVideoViewByUseId(String userId) {
        for (TXCloudVideoView videoView: mVideoViewList) {
            String tempUserID = videoView.getUserId();
            if (tempUserID != null && tempUserID.equalsIgnoreCase(userId)) {
                return videoView;
            }
        }
        return null;
    }

    public void swapViewByIndex(int src, int dst) {
        Log.i(TAG, "swapViewByIndex src:" + src + ",dst:" + dst);
        TXCloudVideoView srcView = mVideoViewList.get(src);
        TXCloudVideoView dstView = mVideoViewList.get(dst);
        mVideoViewList.set(src, dstView);
        mVideoViewList.set(dst, srcView);

        updateLayoutFloat();
    }

    public TXCloudVideoView onMemberEnter(String userId) {
        Log.e(TAG, "onMemberEnter: userId = " + userId);

        if (TextUtils.isEmpty(userId)) return null;
        TXCloudVideoView videoView = null;
        int posIdx = 0;
        int posLocal = mVideoViewList.size();
        for (int i = 0; i < mVideoViewList.size(); i++) {
            TXCloudVideoView renderView = mVideoViewList.get(i);
            if (renderView != null) {
                String vUserId = renderView.getUserId();
                if (userId.equalsIgnoreCase(vUserId)){
                    return renderView;
                }
                if (videoView == null && TextUtils.isEmpty(vUserId)){
                    renderView.setUserId(userId);
                    videoView = renderView;
                    posIdx = i;
                } else if (!TextUtils.isEmpty(vUserId) && vUserId.equalsIgnoreCase(mSelfUserId)) {
                    posLocal = i;
                }
            }
        }
        TXLog.i(TAG, "onMemberEnter->posIdx: " + posIdx + ", posLocal: " + posLocal);

        if (0 == posLocal) {
            swapViewByIndex(posIdx, posLocal);
        }

        updateLayoutFloat();

        return videoView;
    }

    public void onMemberLeave(String userId) {
        Log.e(TAG, "onMemberLeave: userId = " + userId);

        int posIdx = -1, posLocal = mVideoViewList.size();
        for (int i = 0; i < mVideoViewList.size(); i++) {
            TXCloudVideoView renderView = mVideoViewList.get(i);
            if (renderView != null && null != renderView.getUserId()) {
                if (renderView.getUserId().equals(userId)) {
                    renderView.setUserId(null);
                    renderView.setVisibility(View.GONE);
                    posIdx = i;
                } else if (renderView.getUserId().equalsIgnoreCase(mSelfUserId)) {
                    posLocal = i;
                }
            }
        }

        if (0 == posIdx) {
            swapViewByIndex(posIdx, posLocal);
        }

        updateLayoutFloat();
    }

    public void updateLayoutFloat() {
        for (int i = 0; i < mVideoViewList.size(); i++) {
            TXCloudVideoView cloudVideoView = mVideoViewList.get(i);
            if ( i < mFloatParamList.size()) {
                RelativeLayout.LayoutParams layoutParams = mFloatParamList.get(i);
                cloudVideoView.setLayoutParams(layoutParams);
            }
            cloudVideoView.setTag(R.string.str_tag_pos, i);
            cloudVideoView.setClickable(true);
            cloudVideoView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Object object = v.getTag(R.string.str_tag_pos);
                    if (object != null) {
                        int pos = (int) object;
                        TXCloudVideoView renderView = (TXCloudVideoView) v;
                        TXLog.i(TAG, "click on pos: " + pos + "/userId: " + renderView.getUserId());
                        if (null != renderView.getUserId()) {
                            swapViewByIndex(0, pos);
                        }
                    }
                }
            });
            if (i != 0) {
                bringChildToFront(cloudVideoView);
            }
        }
    }
}
