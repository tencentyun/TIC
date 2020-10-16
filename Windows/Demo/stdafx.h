//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#ifndef VC_EXTRALEAN
#define VC_EXTRALEAN  // 从 Windows 头中排除极少使用的资料
#endif

#include "targetver.h"

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS  // 某些 CString 构造函数将是显式的

// 关闭 MFC 对某些常见但经常可放心忽略的警告消息的隐藏
#define _AFX_ALL_WARNINGS

#include <afxext.h>  // MFC 鎵╁睍
#include <afxwin.h>  // MFC 鏍稿績缁勪欢鍜屾爣鍑嗙粍浠?#13;

#ifndef _AFX_NO_OLE_SUPPORT
#include <afxdtctl.h>  // MFC 对 Internet Explorer 4 公共控件的支持
#endif
#ifndef _AFX_NO_AFXCMN_SUPPORT
#include <afxcmn.h>  // MFC 对 Windows 公共控件的支持
#endif               // _AFX_NO_AFXCMN_SUPPORT

#include <afxcontrolbars.h>  // 鍔熻兘鍖哄拰鎺т欢鏉＄殑 MFC 鏀寔
#include <afxinet.h>
#include <assert.h>
#include <direct.h>
#include <io.h>

#include <fstream>
#include <functional>
#include <string>
#include <thread>
#include <vector>

#include "..\SDK\TIC\TICManager.h"

#define WM_UPDATE_THUMB_IMAGE WM_USER + 100

#define ThumpWidth 134
#define ThumpHeight 75

std::wstring a2w(const std::string &str, unsigned int codePage = CP_ACP);
std::string w2a(const std::wstring &wstr, unsigned int codePage = CP_ACP);

std::string i2s(int num);

void showErrorMsg(TICModule module, int code, const char *desc);

void stretchImage(CImage *pImage, CImage *ResultImage, int outWidth,
                  int outHeight);

std::string savePic(std::string strImgUrl);
