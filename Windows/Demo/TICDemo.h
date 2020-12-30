#pragma once

#ifndef __AFXWIN_H__
	#error "在包含此文件之前包含“stdafx.h”以生成 PCH 文件"
#endif

#include "resource.h"

class CTICDemoApp : public CWinApp
{
	DECLARE_MESSAGE_MAP()
public:
	CTICDemoApp();

	virtual BOOL InitInstance();

	void setSdkAppId(int sdkappid) { this->sdkAppId_ = sdkappid; };
	void setUserId(const std::string& uid) { this->uid_ = uid; };
	void setUserSig(const std::string& sig) { this->usig_ = sig; };
	void setClassId(int cls) { this->clsid_ = cls; }

	int getSdkAppId() { return sdkAppId_; };
	std::string getUserId() { return uid_; };
	std::string getUserSig() { return usig_; }
	int getClassId() { return clsid_; }

private:
	int sdkAppId_;
	std::string uid_;
	std::string usig_;
	int clsid_ = 0;
};

extern CTICDemoApp theApp;
