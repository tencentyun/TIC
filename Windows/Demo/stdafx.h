#pragma once

#ifndef VC_EXTRALEAN
#define VC_EXTRALEAN            // 从 Windows 头中排除极少使用的资料
#endif

#include "targetver.h"

#define _ATL_CSTRING_EXPLICIT_CONSTRUCTORS      // 某些 CString 构造函数将是显式的

// 关闭 MFC 对某些常见但经常可放心忽略的警告消息的隐藏
#define _AFX_ALL_WARNINGS

#include <afxwin.h>         // MFC 核心组件和标准组件
#include <afxext.h>         // MFC 扩展

#ifndef _AFX_NO_OLE_SUPPORT
#include <afxdtctl.h>           // MFC 对 Internet Explorer 4 公共控件的支持
#endif
#ifndef _AFX_NO_AFXCMN_SUPPORT
#include <afxcmn.h>             // MFC 对 Windows 公共控件的支持
#endif // _AFX_NO_AFXCMN_SUPPORT

#include <afxcontrolbars.h>     // 功能区和控件条的 MFC 支持


#include <assert.h>
#include <string>
#include <vector>
#include <functional>
#include <fstream>
#include <io.h>
#include <direct.h>
#include <afxinet.h>
#include <thread>

#include "TIC\TICManager.h"

#define WM_UPDATE_THUMB_IMAGE WM_USER+100

#define ThumpWidth 134
#define ThumpHeight 75

std::wstring a2w(const std::string &str, unsigned int codePage = CP_ACP);
std::string w2a(const std::wstring &wstr, unsigned int codePage = CP_ACP);

std::string  i2s(int num);

void showErrorMsg(TICModule module, int code, const char* desc);

void stretchImage(CImage *pImage, CImage *ResultImage, int outWidth, int outHeight);

std::string savePic(std::string strImgUrl);