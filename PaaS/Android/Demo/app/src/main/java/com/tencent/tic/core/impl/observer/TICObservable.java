package com.tencent.tic.core.impl.observer;

import java.lang.ref.WeakReference;
import java.util.Iterator;
import java.util.LinkedList;

public class TICObservable<T>{
    // 成员监听链表
    protected LinkedList<WeakReference<T>> listObservers = new LinkedList<WeakReference<T>>();

    // 添加观察者
    public void addObserver(T l) {

        for (WeakReference<T> listener : listObservers) {
            T t = listener.get();
            if (t != null && t.equals(l)) {
                return;
            }
        }

        WeakReference<T> weaklistener = new WeakReference<T>(l);
        listObservers.add(weaklistener);
    }

    // 移除观察者
    public void removeObserver(T l) {
        Iterator<WeakReference<T>> it = listObservers.iterator();
        while(it.hasNext())
        {
            T t = it.next().get();
            if (t != null && t.equals(l)) {
                it.remove();
                break;
            }
        }
    }
}
