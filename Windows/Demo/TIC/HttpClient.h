//
//  Copyright © 2019 Tencent. All rights reserved.
//

#ifndef HttpClient_h_
#define HttpClient_h_

/*******************************************************************
* @purpose	http����
* @details	��װwinhttp����
********************************************************************/

#include <stdint.h>
#include <string>
#include <map>
#include <functional>
#include <memory>

#include <Windows.h>

#include <WinInet.h>

#undef BOOLAPI
#undef SECURITY_FLAG_IGNORE_CERT_DATE_INVALID
#undef SECURITY_FLAG_IGNORE_CERT_CN_INVALID

#define URL_COMPONENTS URL_COMPONENTS_ANOTHER
#define URL_COMPONENTSA URL_COMPONENTSA_ANOTHER
#define URL_COMPONENTSW URL_COMPONENTSW_ANOTHER

#define LPURL_COMPONENTS LPURL_COMPONENTS_ANOTHER
#define LPURL_COMPONENTSA LPURL_COMPONENTS_ANOTHER
#define LPURL_COMPONENTSW LPURL_COMPONENTS_ANOTHER

#define INTERNET_SCHEME INTERNET_SCHEME_ANOTHER
#define LPINTERNET_SCHEME LPINTERNET_SCHEME_ANOTHER

#define HTTP_VERSION_INFO HTTP_VERSION_INFO_ANOTHER
#define LPHTTP_VERSION_INFO LPHTTP_VERSION_INFO_ANOTHER

#include <winhttp.h>

#undef URL_COMPONENTS
#undef URL_COMPONENTSA
#undef URL_COMPONENTSW

#undef LPURL_COMPONENTS
#undef LPURL_COMPONENTSA
#undef LPURL_COMPONENTSW

#undef INTERNET_SCHEME
#undef LPINTERNET_SCHEME

#undef HTTP_VERSION_INFO
#undef LPHTTP_VERSION_INFO

enum class HttpAction {
  Request,
  Response
};

enum class HttpAsynCBType {
  RequestError,
  SendRequestComplete,
  WriteComplete,
  HeadersAvailable,
  DataAvailable,
  ReadComplete,
};

class HttpHeaders : public std::map<std::wstring, std::wstring> {
 public:
  HttpHeaders();
  ~HttpHeaders();

  bool HasHeader(const std::wstring &key) const;
  void SetHeader(const std::wstring &key, const std::wstring &value);
  std::wstring GetHeader(const std::wstring &key) const;
  uint64_t GetHeaderAsUInt64(const std::wstring &key);

  void SetDate();
  void SetAuthorization(std::wstring authorization);
  void SetContentType(std::wstring contentType = L"application/json");
  void SetContentLength(uint64_t contentLength = 0);
  void SetConnection(bool keepAlive = false);
};

struct HttpAsynParam {
  union { DWORD dwBytesWritten = 0; DWORD dwBytesAvailable; DWORD dwReadBufferSize; };
  char *pReadBuffer = nullptr;
};

typedef std::function<void(HttpAsynCBType type, const HttpAsynParam *param)> HttpAsynCallback;
class HttpRequest {
 public:
  HttpRequest();
  ~HttpRequest();

  DWORD errorCode() const;

  void init(const std::wstring &userAgent,
            const std::wstring &url,
            const std::wstring &method,
            HttpAsynCallback asynCallback = nullptr);

  void setTimeouts(int nResolveTimeout, int nConnectTimeout, int nSendTimeout, int nReceiveTimeout);
  void setRequestHeaders(const HttpHeaders &reqHeaders);

  void sendRequest(DWORD totalSize = 0);
  void writeData(const void *buffer, DWORD dwBytesToWrite, DWORD *pdwBytesWritten = nullptr);

  void receiveResponse();
  void receiveResponseHeaders(DWORD &dwStatusCode, HttpHeaders &rspHeaders);
  int queryDataAvailable();//ʧ�ܷ���-1��ͬ��ģʽ�ɹ����ؿɶ��ֽ������첽ģʽ�ɹ�ʼ�շ���0;
  void readData(void *buffer, DWORD dwBytesToRead, DWORD *pdwBytesRead = nullptr);

 private:
  static void CALLBACK
  _onWinHttpStatusCallback(HINTERNET
  hInternet,
  DWORD_PTR dwContext, DWORD
  dwInternetStatus,
  LPVOID lpvStatusInformation, DWORD
  dwStatusInformationLength);
  void _release();

 private:
  DWORD m_dwErrorCode = 0;

  HINTERNET m_hSession = nullptr;
  HINTERNET m_hConnect = nullptr;
  HINTERNET m_hRequest = nullptr;

  HttpAsynCallback m_asynCallback;
};

typedef std::function<void(int code, const HttpHeaders &rspHeaders, const std::string &rspBody)>
    HttpRspCallback;
typedef std::function<void(int code, const HttpHeaders &rspHeaders)> HttpDownloadComplete;
typedef std::function<void(HttpAction action, DWORD currentSize, DWORD totalSize)>
    HttpProgressCallback;
class HttpClient {
  static const DWORD m_skMaxFragSize = 1024;
 public:
  HttpClient();
  ~HttpClient();

  void setUserAgent(const std::wstring &userAgent);
  void setTimeouts(int nResolveTimeout, int nConnectTimeout, int nSendTimeout, int nReceiveTimeout);
  void enableRespEncodeConvert(bool bEnable);//�Ƿ񽫷�������(��text��json����)ת��Ϊ���ر���;

  int get(
      const std::wstring &url,
      std::string &rspBody,
      const HttpHeaders *reqHeaders = nullptr,
      HttpHeaders *rspHeaders = nullptr,
      HttpProgressCallback progressCB = nullptr);

  int post(
      const std::wstring &url,
      const std::string &reqBody,
      std::string &rspBody,
      const HttpHeaders *reqHeaders = nullptr,
      HttpHeaders *rspHeaders = nullptr,
      HttpProgressCallback progressCB = nullptr);

  int download(
      const std::wstring &url,
      const std::string &file,
      HttpProgressCallback progressCB = nullptr,
      const HttpHeaders *reqHeaders = nullptr,
      HttpHeaders *rspHeaders = nullptr);

  void asynGet(
      const std::wstring &url,
      HttpRspCallback rspCB,
      const HttpHeaders *reqHeaders = nullptr,
      HttpProgressCallback progressCB = nullptr);

  void asynPost(
      const std::wstring &url,
      const std::string &reqBody,
      HttpRspCallback rspCB,
      const HttpHeaders *reqHeaders = nullptr,
      HttpProgressCallback progressCB = nullptr);

  void asynDownload(
      const std::wstring &url,
      const std::string &file,
      HttpDownloadComplete completeCB,
      HttpProgressCallback progressCB = nullptr,
      const HttpHeaders *reqHeaders = nullptr);

  static void convertRespEncode(const HttpHeaders &headers,
                                const std::string &src,
                                std::string &dst);
  static std::wstring a2w(const std::string &str, unsigned int codePage = CP_ACP);
  static std::string w2a(const std::wstring &wstr, unsigned int codePage = CP_ACP);

 private:
  bool m_bEnableEncodeConvert = true;
  std::wstring m_userAgent;
  int m_nResolveTimeout = 10000;
  int m_nConnectTimeout = 10000;
  int m_nSendTimeout = 15000;
  int m_nReceiveTimeout = 15000;
};

#endif //HttpClient_h_
