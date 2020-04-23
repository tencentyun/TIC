package com.tencent.tic.core.impl.utils;

import android.app.ActivityManager;
import android.content.Context;

import java.util.List;

public class SdkUtil {

    public static boolean isMainProcess(Context context) {
        return context.getPackageName().equals(getProcessName(context));
    }

    // you can use this method to get current process name, you will get
// name like "com.package.name"(main process name) or "com.package.name:remote"
    private static String getProcessName(Context context) {
        int mypid = android.os.Process.myPid();
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> infos = manager.getRunningAppProcesses();
        for(ActivityManager.RunningAppProcessInfo info : infos) {
            if (info.pid == mypid) {
                return info.processName;
            }
        }
        // may never return null
        return null;
    }
}
