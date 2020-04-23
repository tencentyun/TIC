package com.tencent.tic.core.impl.observer;

import com.tencent.tic.core.TICManager;

import java.lang.ref.WeakReference;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class TICEventObservable extends  TICObservable<TICManager.TICEventListener> implements TICManager.TICEventListener {

    @Override
    public void onTICVideoDisconnect(int i, String s) {
        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICVideoDisconnect(i, s);
            }
        }
    }
    @Override
    public void onTICUserVideoAvailable(final String userId, boolean available) {

        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICUserVideoAvailable(userId, available);
            }
        }
    }

    @Override
    public void onTICUserSubStreamAvailable(final String userId, boolean available) {
        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICUserSubStreamAvailable(userId, available);
            }
        }
    }

    @Override
    public void onTICUserAudioAvailable(final String userId, boolean available) {
        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICUserAudioAvailable(userId, available);
            }
        }
    }

    @Override
    public void onTICClassroomDestroy() {

        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICClassroomDestroy();
            }
        }
    }

    @Override
    public void onTICMemberJoin(List<String> list) {

        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICMemberJoin(list);
            }
        }
    }

    @Override
    public void onTICMemberQuit(List<String> list) {

        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICMemberQuit(list);
            }
        }
    }

    @Override
    public void onTICSendOfflineRecordInfo(int code, String desc) {

        LinkedList<WeakReference<TICManager.TICEventListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICEventListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICEventListener t = it.next().get();
            if (t != null) {
                t.onTICSendOfflineRecordInfo(code, desc);
            }
        }
    }
}
