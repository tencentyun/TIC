package com.tencent.tic.core.impl.observer;

import com.tencent.imsdk.TIMMessage;
import com.tencent.tic.core.TICManager;

import java.lang.ref.WeakReference;
import java.util.Iterator;
import java.util.LinkedList;

public class TICMessageObservable extends TICObservable<TICManager.TICMessageListener> implements TICManager.TICMessageListener {

    @Override
    public void onTICRecvTextMessage(String s, String s1) {

        LinkedList<WeakReference<TICManager.TICMessageListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICMessageListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICMessageListener t = it.next().get();
            if (t != null) {
                t.onTICRecvTextMessage(s, s1);
            }
        }
    }

    @Override
    public void onTICRecvCustomMessage(String s, byte[] bytes) {

        LinkedList<WeakReference<TICManager.TICMessageListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICMessageListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICMessageListener t = it.next().get();
            if (t != null) {
                t.onTICRecvCustomMessage(s, bytes);
            }
        }
    }

    @Override
    public void onTICRecvGroupTextMessage(String fromUserId, String text) {

        LinkedList<WeakReference<TICManager.TICMessageListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICMessageListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICMessageListener t = it.next().get();
            if (t != null) {
                t.onTICRecvGroupTextMessage(fromUserId, text);
            }
        }
    }

    @Override
    public void onTICRecvGroupCustomMessage(String fromUserId, byte[] data){

        LinkedList<WeakReference<TICManager.TICMessageListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICMessageListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICMessageListener t = it.next().get();
            if (t != null) {
                t.onTICRecvGroupCustomMessage(fromUserId, data);
            }
        }
    }

    @Override
    public void onTICRecvMessage(TIMMessage message) {

        LinkedList<WeakReference<TICManager.TICMessageListener>> tmpList = new LinkedList<>(listObservers);
        Iterator<WeakReference<TICManager.TICMessageListener>> it = tmpList.iterator();

        while(it.hasNext())
        {
            TICManager.TICMessageListener t = it.next().get();
            if (t != null) {
                t.onTICRecvMessage(message);
            }
        }
    }
}
