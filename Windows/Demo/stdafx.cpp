#include "stdafx.h"

#pragma comment(lib, "Wininet.lib")

std::wstring a2w(const std::string &str, unsigned int codePage /*= CP_ACP*/)
{
	const int nSize = MultiByteToWideChar(codePage, 0, str.c_str(), str.size(), nullptr, 0);
	if (nSize <= 0) return L"";

	std::wstring wstr(nSize, L'\0');
	MultiByteToWideChar(codePage, 0, str.c_str(), str.size(), &wstr[0], wstr.size());
	if (wstr[0] == 0xFEFF)
	{
		wstr.erase();
	}

	return wstr;
}

std::string w2a(const std::wstring &wstr, unsigned int codePage /*= CP_ACP*/)
{
	const int nSize = WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(), nullptr, 0, nullptr, nullptr);
	if (nSize <= 0) return "";

	std::string str(nSize, '\0');
	WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(), &str[0], str.size(), nullptr, nullptr);

	return str;
}

std::string i2s(int num)
{
	return std::to_string( (long long)num );
}

void showErrorMsg(TICModule module, int code, const char* desc)
{
	CString str;
	str.Format(_T("模块: %d 错误码: %d 错误信息: %s"), module, code, a2w(desc).c_str());
	AfxMessageBox(str, MB_OK);
}

void stretchImage(CImage *pImage, CImage *ResultImage, int outWidth, int outHeight)
{
	if (!pImage->IsDIBSection())
	{
		return;
	}

	// 取得pImage的DC
	CDC *pImageDC = CDC::FromHandle(pImage->GetDC());

	CBitmap *bitmap = pImageDC->GetCurrentBitmap();
	BITMAP bmpInfo;
	bitmap->GetBitmap(&bmpInfo);

	// 建立新的CImage
	ResultImage->Create(outWidth, outHeight, bmpInfo.bmBitsPixel);
	CDC* ResultImageDC = CDC::FromHandle(ResultImage->GetDC());

	// 当Destination 比较小的時候,会根据Destination DC 上的 Stretch Blt mode 決定是否要保留被刪除點的資訊
	ResultImageDC->SetStretchBltMode(HALFTONE); // 使用最高品質的方式
	::SetBrushOrgEx(ResultImageDC->m_hDC, 0, 0, NULL); // 調整 Brush 的起點


	// 把 pImage 畫到 ResultImage 上面
	StretchBlt(*ResultImageDC, 0, 0, outWidth, outHeight, *pImageDC, 0, 0, pImage->GetWidth(), pImage->GetHeight(), SRCCOPY);
	// pImage->Draw(*ResultImageDC,0,0,StretchWidth,StretchHeight,0,0,pImage->GetWidth(),pImage->GetHeight());

	pImage->ReleaseDC();
	ResultImage->ReleaseDC();
}

static std::string createLocalPath(std::string strImgUrl)
{
	//获取系统的临时目录
	char tempPath[MAX_PATH] = { 0 };
	DWORD dwSize = ::GetTempPathA(MAX_PATH, tempPath);

	// 判断文件夹是否存在
	std::string folderPath = tempPath;
	folderPath += "tic_demo\\";
	if (_access(folderPath.c_str(), 0) == -1)
	{
		int flag = _mkdir(folderPath.c_str());
		if (0 != flag) {
			return "";
		}
	}
	std::hash<std::string> strHash;
	std::string fileName = std::to_string(strHash(strImgUrl));
	return std::string(folderPath) + fileName + strImgUrl.substr(strImgUrl.rfind('.'));
}

std::string savePic(std::string strImgUrl)
{
	std::string path = createLocalPath(strImgUrl);
	if (_access(path.c_str(), 0) == 0)
	{
		return path;
	}

	DWORD length = 0;
	BYTE buffer[1024] = { 0 };
	
	HINTERNET hInternet = NULL;
	hInternet = InternetOpen(_T("TIC_DEMO"), INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
	if (hInternet == NULL)
	{
		return "";
	}

	HINTERNET hUrl;
	hUrl = InternetOpenUrl(hInternet, a2w(strImgUrl).c_str(), NULL, 0, INTERNET_FLAG_RELOAD, 0);
	if (hUrl == NULL)
	{
		InternetCloseHandle(hInternet);
		return "";
	}

	BOOL    hwrite;
	DWORD   written;
	HANDLE  hFile;
	hFile = CreateFile(a2w(path).c_str(), GENERIC_WRITE, 0, 0, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, 0);
	if (hFile == INVALID_HANDLE_VALUE)
	{
		InternetCloseHandle(hUrl);
		InternetCloseHandle(hInternet);
		return "";
	}

	BOOL read;
	while (TRUE)
	{
		read = InternetReadFile(hUrl, buffer, sizeof(buffer), &length);
		if (length == 0) break;
		hwrite = WriteFile(hFile, buffer, sizeof(buffer), &written, NULL);
		if (hwrite == 0)
		{
			CloseHandle(hFile);
			InternetCloseHandle(hUrl);
			InternetCloseHandle(hInternet);
			return "";
		}
	}
	CloseHandle(hFile);
	InternetCloseHandle(hUrl);
	InternetCloseHandle(hInternet);
	return path;
}