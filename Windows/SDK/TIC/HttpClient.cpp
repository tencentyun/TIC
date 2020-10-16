//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "HttpClient.h"

#include <VersionHelpers.h>
#include <assert.h>
#include <time.h>

#include <algorithm>
#pragma comment(lib, "winhttp.lib")

struct HttpRequestInfo {
  std::unique_ptr<HttpRequest> request = nullptr;

  DWORD dwStatusCode = 0;

  DWORD dwReqBodySentSize = 0;
  std::string reqBody;

  HttpHeaders rspHeaders;

  DWORD dwRspBodyTotalSize = 0;
  DWORD dwRspBodyReadSize = 0;
  std::string rspBody;

  HttpRequestInfo() : request(new HttpRequest()) {}
};

HttpHeaders::HttpHeaders() {}

HttpHeaders::~HttpHeaders() {}

bool HttpHeaders::HasHeader(const std::wstring& key) const {
  return this->count(key) > 0;
}

void HttpHeaders::SetHeader(const std::wstring& key,
                            const std::wstring& value) {
  this->emplace(key, value);
}

std::wstring HttpHeaders::GetHeader(const std::wstring& key) const {
  auto iter = this->find(key);
  return (iter == this->end()) ? L"" : iter->second;
}

uint64_t HttpHeaders::GetHeaderAsUInt64(const std::wstring& key) {
  return std::wcstoull(this->GetHeader(key).c_str(), NULL, 10);
}

void HttpHeaders::SetDate() {
  time_t rawTime;
  time(&rawTime);
  struct tm timeInfo;
  gmtime_s(&timeInfo, &rawTime);

  wchar_t szTemp[30] = {0};
  wcsftime(szTemp, sizeof(szTemp), L"%a, %d %b %Y %H:%M:%S GMT", &timeInfo);

  this->emplace(L"Date", szTemp);
}

void HttpHeaders::SetAuthorization(std::wstring authorization) {
  this->emplace(L"Authorization", authorization);
}

void HttpHeaders::SetContentType(
    std::wstring contentType /*= L"application/json"*/) {
  this->emplace(L"Content-Type", contentType);
}

void HttpHeaders::SetContentLength(uint64_t contentLength /*= 0*/) {
  this->emplace(L"Content-Length", std::to_wstring(contentLength));
}

void HttpHeaders::SetConnection(bool keepAlive /*= false*/) {
  this->emplace(L"Connection", keepAlive ? L"keep-alive" : L"close");
}

HttpRequest::HttpRequest() {}

HttpRequest::~HttpRequest() { _release(); }

DWORD HttpRequest::errorCode() const { return m_dwErrorCode; }

void HttpRequest::init(const std::wstring& userAgent, const std::wstring& url,
                       const std::wstring& method,
                       HttpAsynCallback asynCallback /*= nullptr*/) {
  _release();

  m_asynCallback = asynCallback;
  bool bAsynMode = m_asynCallback ? true : false;

  // url
  std::wstring hostName;
  std::wstring urlPath;
  hostName.resize(url.size());
  urlPath.resize(url.size());
  URL_COMPONENTS url_comp = {0};
  url_comp.dwStructSize = sizeof(url_comp);
  url_comp.lpszHostName = const_cast<wchar_t*>(hostName.data());
  url_comp.dwHostNameLength = hostName.size();
  url_comp.lpszUrlPath = const_cast<wchar_t*>(urlPath.data());
  url_comp.dwUrlPathLength = urlPath.size();
  if (FALSE == ::WinHttpCrackUrl(url.c_str(), url.size(), 0, &url_comp)) {
    m_dwErrorCode = GetLastError();
    return;
  }

  // hSession
  DWORD dwAccessType = ::IsWindows8Point1OrGreater()
                           ? WINHTTP_ACCESS_TYPE_AUTOMATIC_PROXY
                           : WINHTTP_ACCESS_TYPE_DEFAULT_PROXY;
  DWORD dwFlag = bAsynMode ? WINHTTP_FLAG_ASYNC : 0;
  m_hSession =
      ::WinHttpOpen(userAgent.c_str(), dwAccessType, WINHTTP_NO_PROXY_NAME,
                    WINHTTP_NO_PROXY_BYPASS, dwFlag);
  if (!m_hSession) {
    m_dwErrorCode = GetLastError();
    return;
  }

  // hConnect
  m_hConnect =
      ::WinHttpConnect(m_hSession, hostName.c_str(), url_comp.nPort, 0);
  if (!m_hConnect) {
    m_dwErrorCode = GetLastError();
    return;
  }

  // hRequest
  DWORD dwRequestFlags =
      (INTERNET_SCHEME_HTTP == url_comp.nScheme ? 0 : WINHTTP_FLAG_SECURE);
  m_hRequest = ::WinHttpOpenRequest(m_hConnect, method.c_str(), urlPath.c_str(),
                                    NULL, NULL, NULL, dwRequestFlags);
  if (!m_hRequest) {
    m_dwErrorCode = GetLastError();
    return;
  }

  // set asyn callback
  if (bAsynMode) {
    if (WINHTTP_INVALID_STATUS_CALLBACK ==
        ::WinHttpSetStatusCallback(m_hRequest, _onWinHttpStatusCallback,
                                   WINHTTP_CALLBACK_FLAG_ALL_COMPLETIONS |
                                       WINHTTP_CALLBACK_FLAG_REDIRECT |
                                       WINHTTP_CALLBACK_FLAG_HANDLES,
                                   NULL)) {
      m_dwErrorCode = GetLastError();
      return;
    }
  }
}

void HttpRequest::setTimeouts(int nResolveTimeout, int nConnectTimeout,
                              int nSendTimeout, int nReceiveTimeout) {
  if (m_dwErrorCode != 0) return;

  if (FALSE == ::WinHttpSetTimeouts(m_hRequest, nResolveTimeout,
                                    nConnectTimeout, nSendTimeout,
                                    nReceiveTimeout)) {
    m_dwErrorCode = GetLastError();
  }
}

void HttpRequest::setRequestHeaders(const HttpHeaders& reqHeaders) {
  if (m_dwErrorCode != 0) return;

  for (const auto& var : reqHeaders) {
    std::wstring header = var.first;
    if (!var.second.empty()) {
      header += L": ";
      header += var.second;
    }
    if (FALSE == ::WinHttpAddRequestHeaders(
                     m_hRequest, header.c_str(), (ULONG)-1L,
                     WINHTTP_ADDREQ_FLAG_ADD | WINHTTP_ADDREQ_FLAG_REPLACE)) {
      m_dwErrorCode = GetLastError();
      break;
    }
  }
}

void HttpRequest::sendRequest(DWORD totalSize /*= 0*/) {
  if (m_dwErrorCode != 0) return;

  if (FALSE == ::WinHttpSendRequest(m_hRequest, WINHTTP_NO_ADDITIONAL_HEADERS,
                                    0, WINHTTP_NO_REQUEST_DATA, 0, totalSize,
                                    (DWORD_PTR)this)) {
    m_dwErrorCode = GetLastError();
  }
}

void HttpRequest::writeData(const void* buffer, DWORD dwBytesToWrite,
                            DWORD* pdwBytesWritten /*= nullptr*/) {
  if (m_dwErrorCode != 0) return;

  if (FALSE ==
      ::WinHttpWriteData(m_hRequest, buffer, dwBytesToWrite, pdwBytesWritten)) {
    m_dwErrorCode = GetLastError();
  }
}

void HttpRequest::receiveResponse() {
  if (m_dwErrorCode != 0) return;

  if (FALSE == ::WinHttpReceiveResponse(m_hRequest, NULL)) {
    m_dwErrorCode = GetLastError();
  }
}

void HttpRequest::receiveResponseHeaders(DWORD* dwStatusCode,
                                         HttpHeaders* rspHeaders) {
  if (m_dwErrorCode != 0) return;

  DWORD dwSize = sizeof(DWORD);
  if (FALSE == ::WinHttpQueryHeaders(
                   m_hRequest,
                   WINHTTP_QUERY_STATUS_CODE | WINHTTP_QUERY_FLAG_NUMBER, NULL,
                   dwStatusCode, &dwSize, NULL)) {
    m_dwErrorCode = GetLastError();
    return;
  }

  DWORD dwHeaderSize = 0;
  BOOL bRet =
      ::WinHttpQueryHeaders(m_hRequest, WINHTTP_QUERY_RAW_HEADERS_CRLF, NULL,
                            WINHTTP_NO_OUTPUT_BUFFER, &dwHeaderSize, NULL);
  if (!(FALSE == bRet && GetLastError() == ERROR_INSUFFICIENT_BUFFER &&
        dwHeaderSize > 0)) {
    m_dwErrorCode = GetLastError();
    return;
  }

  std::wstring responseHeader;
  responseHeader.resize(dwHeaderSize / sizeof(wchar_t));
  if (FALSE == WinHttpQueryHeaders(m_hRequest, WINHTTP_QUERY_RAW_HEADERS_CRLF,
                                   NULL, &responseHeader[0], &dwHeaderSize,
                                   NULL)) {
    m_dwErrorCode = GetLastError();
    return;
  }

  rspHeaders->clear();
  size_t pos = 0;
  const size_t len = responseHeader.length();
  const size_t delimLen = 2;
  while (pos < len) {
    int delim_pos = responseHeader.find(L"\r\n", pos);
    if (delim_pos < 0) delim_pos = len;
    std::wstring header = responseHeader.substr(pos, delim_pos - pos);
    const int colonPos = header.find(L": ");
    std::wstring value = L"";
    if (colonPos >= 0) {
      value = header.substr(colonPos + 2, header.length() - colonPos - 1);
      header.erase(colonPos);
    }
    if (!header.empty() && header[0] != L'\0') {
      rspHeaders->emplace(header, value);
    }
    pos = delim_pos + delimLen;
  }
}

int HttpRequest::queryDataAvailable() {
  if (m_dwErrorCode != 0) return -1;

  DWORD availableSize = 0;
  if (FALSE == ::WinHttpQueryDataAvailable(
                   m_hRequest, m_asynCallback ? NULL : &availableSize)) {
    m_dwErrorCode = GetLastError();
    return -1;
  }
  return static_cast<int>(availableSize);
}

void HttpRequest::readData(void* buffer, DWORD dwBytesToRead,
                           DWORD* pdwBytesRead /*= nullptr*/) {
  if (m_dwErrorCode != 0) return;

  if (FALSE ==
      ::WinHttpReadData(m_hRequest, buffer, dwBytesToRead, pdwBytesRead)) {
    m_dwErrorCode = GetLastError();
  }
}

void CALLBACK HttpRequest::_onWinHttpStatusCallback(
    HINTERNET hInternet, DWORD_PTR dwContext, DWORD dwInternetStatus,
    LPVOID lpvStatusInformation, DWORD dwStatusInformationLength) {
  HttpRequest* pThis = reinterpret_cast<HttpRequest*>(dwContext);
  if (!pThis) return;
  switch (dwInternetStatus) {
    case WINHTTP_CALLBACK_STATUS_REQUEST_ERROR: {
      pThis->m_dwErrorCode =
          reinterpret_cast<LPWINHTTP_ASYNC_RESULT>(lpvStatusInformation)
              ->dwError;
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::RequestError, nullptr);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_SENDREQUEST_COMPLETE: {
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::SendRequestComplete, nullptr);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_WRITE_COMPLETE: {
      HttpAsynParam param;
      param.dwBytesWritten = *((LPDWORD)lpvStatusInformation);
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::WriteComplete, &param);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_HEADERS_AVAILABLE: {
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::HeadersAvailable, nullptr);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_DATA_AVAILABLE: {
      HttpAsynParam param;
      param.dwBytesAvailable = *((LPDWORD)lpvStatusInformation);
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::DataAvailable, &param);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_READ_COMPLETE: {
      HttpAsynParam param;
      param.dwReadBufferSize = dwStatusInformationLength;
      param.pReadBuffer = reinterpret_cast<char*>(lpvStatusInformation);
      if (pThis->m_asynCallback)
        pThis->m_asynCallback(HttpAsynCBType::ReadComplete, &param);
      break;
    }
    case WINHTTP_CALLBACK_STATUS_REDIRECT:
      break;
    case WINHTTP_CALLBACK_STATUS_HANDLE_CLOSING:
      break;
    default:
      break;
  }
}

void HttpRequest::_release() {
  if (m_hRequest) {
    ::WinHttpCloseHandle(m_hRequest);
    m_hRequest = nullptr;
  }
  if (m_hConnect) {
    ::WinHttpCloseHandle(m_hConnect);
    m_hConnect = nullptr;
  }
  if (m_hSession) {
    ::WinHttpCloseHandle(m_hSession);
    m_hSession = nullptr;
  }
}

HttpClient::HttpClient() {}

HttpClient::~HttpClient() {}

void HttpClient::setUserAgent(const std::wstring& userAgent) {
  m_userAgent = userAgent;
}

void HttpClient::setTimeouts(int nResolveTimeout, int nConnectTimeout,
                             int nSendTimeout, int nReceiveTimeout) {
  m_nResolveTimeout = nResolveTimeout;
  m_nConnectTimeout = nConnectTimeout;
  m_nSendTimeout = nSendTimeout;
  m_nReceiveTimeout = nReceiveTimeout;
}

void HttpClient::enableRespEncodeConvert(bool bEnable) {
  m_bEnableEncodeConvert = bEnable;
}

int HttpClient::get(const std::wstring& url, std::string* rspBody,
                    const HttpHeaders* reqHeaders /*= nullptr*/,
                    HttpHeaders* rspHeaders /*= nullptr*/,
                    HttpProgressCallback progressCB /*= nullptr*/) {
  DWORD dwStatusCode = 0;
  HttpHeaders tempRspHeaders_;
  HttpHeaders& theRspHeaders = rspHeaders ? (*rspHeaders) : tempRspHeaders_;
  theRspHeaders.clear();

  HttpRequest request;
  request.init(m_userAgent, url, L"GET");
  request.setTimeouts(m_nResolveTimeout, m_nConnectTimeout, m_nSendTimeout,
                      m_nReceiveTimeout);
  if (reqHeaders) request.setRequestHeaders(*reqHeaders);
  request.sendRequest();
  request.receiveResponse();
  request.receiveResponseHeaders(&dwStatusCode, &theRspHeaders);

  DWORD dwRspBodySize =
      static_cast<DWORD>(theRspHeaders.GetHeaderAsUInt64(L"Content-Length"));
  rspBody->resize(dwRspBodySize);
  DWORD dwReceivedSize = 0;
  if (progressCB) progressCB(HttpAction::Response, 0, dwRspBodySize);
  while (true) {
    int nAvailable = request.queryDataAvailable();
    if (nAvailable <= 0) break;
    DWORD readSize = 0;
    if (dwRspBodySize == 0) {
      std::unique_ptr<char> ptr =
          std::unique_ptr<char>(new char[nAvailable + 1]);
      ::ZeroMemory(ptr.get(), nAvailable + 1);
      request.readData(ptr.get(), nAvailable, &readSize);
      rspBody->append(ptr.get(), readSize);
    } else {
      request.readData(&rspBody[dwReceivedSize], nAvailable, &readSize);
    }
    dwReceivedSize += readSize;
    if (progressCB)
      progressCB(HttpAction::Response, dwReceivedSize, dwRspBodySize);
  }

  if (m_bEnableEncodeConvert)
    convertRespEncode(theRspHeaders, *rspBody, rspBody);

  if (request.errorCode() != 0) return request.errorCode();
  if (dwStatusCode != 200) return dwStatusCode;
  return 0;
}

int HttpClient::post(const std::wstring& url, const std::string& reqBody,
                     std::string* rspBody,
                     const HttpHeaders* reqHeaders /*= nullptr*/,
                     HttpHeaders* rspHeaders /*= nullptr*/,
                     HttpProgressCallback progressCB /*= nullptr*/) {
  DWORD dwStatusCode = 0;
  HttpHeaders tempRspHeaders_;
  HttpHeaders& theRspHeaders = rspHeaders ? (*rspHeaders) : tempRspHeaders_;
  theRspHeaders.clear();

  HttpRequest request;
  request.init(m_userAgent, url, L"POST");
  request.setTimeouts(m_nResolveTimeout, m_nConnectTimeout, m_nSendTimeout,
                      m_nReceiveTimeout);
  if (reqHeaders) request.setRequestHeaders(*reqHeaders);
  request.sendRequest(reqBody.size());

  DWORD dwSendTotalSize = reqBody.size();
  DWORD dwFragSize =
      dwSendTotalSize > m_skMaxFragSize ? m_skMaxFragSize : dwSendTotalSize;
  DWORD sentSize = 0;
  if (progressCB && dwSendTotalSize > 0)
    progressCB(HttpAction::Request, 0, dwSendTotalSize);
  while (sentSize < dwSendTotalSize) {
    DWORD nThisSend = dwSendTotalSize - sentSize;
    if (nThisSend > dwFragSize) nThisSend = dwFragSize;
    request.writeData(&reqBody[sentSize], nThisSend, &nThisSend);
    if (request.errorCode() != 0) break;
    sentSize += nThisSend;
    if (progressCB) progressCB(HttpAction::Request, sentSize, dwSendTotalSize);
  }

  request.receiveResponse();
  request.receiveResponseHeaders(&dwStatusCode, &theRspHeaders);

  DWORD dwRspBodySize =
      static_cast<DWORD>(theRspHeaders.GetHeaderAsUInt64(L"Content-Length"));
  rspBody->resize(dwRspBodySize);
  DWORD dwReceivedSize = 0;
  if (progressCB) progressCB(HttpAction::Response, 0, dwRspBodySize);
  while (true) {
    int nAvailable = request.queryDataAvailable();
    if (nAvailable <= 0) break;
    DWORD readSize = 0;
    if (dwRspBodySize == 0) {
      std::unique_ptr<char> ptr =
          std::unique_ptr<char>(new char[nAvailable + 1]);
      ::ZeroMemory(ptr.get(), nAvailable + 1);
      request.readData(ptr.get(), nAvailable, &readSize);
      rspBody->append(ptr.get(), readSize);
    } else {
      request.readData(&rspBody[dwReceivedSize], nAvailable, &readSize);
    }
    dwReceivedSize += readSize;
    if (progressCB)
      progressCB(HttpAction::Response, dwReceivedSize, dwRspBodySize);
  }

  if (m_bEnableEncodeConvert)
    convertRespEncode(theRspHeaders, *rspBody, rspBody);

  if (request.errorCode() != 0) return request.errorCode();
  if (dwStatusCode != 200) return dwStatusCode;
  return 0;
}

int HttpClient::download(const std::wstring& url, const std::string& file,
                         HttpProgressCallback progressCB /*= nullptr*/,
                         const HttpHeaders* reqHeaders /*= nullptr*/,
                         HttpHeaders* rspHeaders /*= nullptr*/) {
  DWORD dwStatusCode = 0;
  HttpHeaders tempRspHeaders_;
  HttpHeaders& theRspHeaders = rspHeaders ? (*rspHeaders) : tempRspHeaders_;
  theRspHeaders.clear();

  HttpRequest request;
  request.init(m_userAgent, url, L"GET");
  request.setTimeouts(m_nResolveTimeout, m_nConnectTimeout, m_nSendTimeout,
                      m_nReceiveTimeout);
  if (reqHeaders) request.setRequestHeaders(*reqHeaders);
  request.sendRequest();
  request.receiveResponse();
  request.receiveResponseHeaders(&dwStatusCode, &theRspHeaders);

  FILE* fp;
  fopen_s(&fp, file.c_str(), "wb");
  if (!fp) return -1;

  DWORD dwRspBodySize =
      static_cast<DWORD>(theRspHeaders.GetHeaderAsUInt64(L"Content-Length"));
  std::string rspFrag;
  DWORD dwReceivedSize = 0;
  if (progressCB) progressCB(HttpAction::Response, 0, dwRspBodySize);
  while (true) {
    int nAvailable = request.queryDataAvailable();
    if (nAvailable <= 0) break;
    DWORD readSize = 0;
    rspFrag.resize(nAvailable);
    request.readData(&rspFrag[0], nAvailable, &readSize);
    size_t nWrite = fwrite(rspFrag.data(), 1, rspFrag.size(), fp);
    if (nWrite != rspFrag.size()) {
      fclose(fp);
      return -1;
    }
    dwReceivedSize += readSize;
    if (progressCB)
      progressCB(HttpAction::Response, dwReceivedSize, dwRspBodySize);
  }
  fclose(fp);

  if (request.errorCode() != 0) return request.errorCode();
  if (dwStatusCode != 200) return dwStatusCode;
  return 0;
}

void HttpClient::asynGet(const std::wstring& url, HttpRspCallback rspCB,
                         const HttpHeaders* reqHeaders /*= nullptr*/,
                         HttpProgressCallback progressCB /*= nullptr*/) {
  HttpRequestInfo* requestInfo = new HttpRequestInfo();
  if ((!requestInfo) || (!requestInfo->request)) {
    if (requestInfo) delete requestInfo;
    if (rspCB) rspCB(-1, HttpHeaders(), "");
    return;
  }

  requestInfo->request->init(
      m_userAgent, url, L"GET",
      [requestInfo, rspCB, progressCB, this](HttpAsynCBType type,
                                             const HttpAsynParam* param) {
        HttpRequest& request = *requestInfo->request;
        switch (type) {
          case HttpAsynCBType::RequestError: {
            if (rspCB)
              rspCB(request.errorCode(), requestInfo->rspHeaders,
                    requestInfo->rspBody);
            delete requestInfo;
            break;
          }
          case HttpAsynCBType::SendRequestComplete: {
            request.receiveResponse();
            break;
          }
          case HttpAsynCBType::HeadersAvailable: {
            if (m_bEnableEncodeConvert)
              request.receiveResponseHeaders(&requestInfo->dwStatusCode,
                                             &requestInfo->rspHeaders);
            if (request.errorCode() == 0) {
              requestInfo->dwRspBodyTotalSize = static_cast<DWORD>(
                  requestInfo->rspHeaders.GetHeaderAsUInt64(L"Content-Length"));
              requestInfo->rspBody.resize(requestInfo->dwRspBodyTotalSize);
              request.queryDataAvailable();
            }
            break;
          }
          case HttpAsynCBType::DataAvailable: {
            const DWORD& nAvailable = param->dwReadBufferSize;
            if (nAvailable == 0) {
              int code = request.errorCode();
              if (code == 0) code = requestInfo->dwStatusCode;
              if (code == 200) code = 0;
              convertRespEncode(requestInfo->rspHeaders, requestInfo->rspBody,
                                &requestInfo->rspBody);
              if (rspCB)
                rspCB(code, requestInfo->rspHeaders, requestInfo->rspBody);
              delete requestInfo;
            } else {
              std::string& rspBody = requestInfo->rspBody;
              const DWORD& dwRspBodyReadSize = requestInfo->dwRspBodyReadSize;
              if (rspBody.size() < dwRspBodyReadSize + nAvailable)
                rspBody.resize(dwRspBodyReadSize + nAvailable);
              if (dwRspBodyReadSize == 0 && progressCB)
                progressCB(HttpAction::Response, 0,
                           requestInfo->dwRspBodyTotalSize);
              request.readData(&rspBody[dwRspBodyReadSize], nAvailable);
            }
            break;
          }
          case HttpAsynCBType::ReadComplete: {
            char* buf = param->pReadBuffer;
            size_t nBufferSize = static_cast<size_t>(param->dwReadBufferSize);
            requestInfo->dwRspBodyReadSize += nBufferSize;
            if (progressCB)
              progressCB(HttpAction::Response, requestInfo->dwRspBodyReadSize,
                         requestInfo->dwRspBodyTotalSize);
            request.queryDataAvailable();
            break;
          }
          default:
            break;
        }
      });
  requestInfo->request->setTimeouts(m_nResolveTimeout, m_nConnectTimeout,
                                    m_nSendTimeout, m_nReceiveTimeout);
  if (reqHeaders) requestInfo->request->setRequestHeaders(*reqHeaders);
  requestInfo->request->sendRequest();
}

void HttpClient::asynPost(const std::wstring& url, const std::string& reqBody,
                          HttpRspCallback rspCB,
                          const HttpHeaders* reqHeaders /*= nullptr*/,
                          HttpProgressCallback progressCB /*= nullptr*/) {
  HttpRequestInfo* requestInfo = new HttpRequestInfo();
  if ((!requestInfo) || (!requestInfo->request)) {
    if (requestInfo) delete requestInfo;
    if (rspCB) rspCB(-1, HttpHeaders(), "");
    return;
  }
  requestInfo->reqBody = reqBody;

  requestInfo->request->init(
      m_userAgent, url, L"POST",
      [requestInfo, rspCB, progressCB, this](HttpAsynCBType type,
                                             const HttpAsynParam* param) {
        HttpRequest& request = *requestInfo->request;
        switch (type) {
          case HttpAsynCBType::RequestError: {
            if (rspCB)
              rspCB(request.errorCode(), requestInfo->rspHeaders,
                    requestInfo->rspBody);
            delete requestInfo;
            break;
          }
          case HttpAsynCBType::SendRequestComplete: {
            std::string& reqBody = requestInfo->reqBody;
            if (reqBody.size() > 0) {
              DWORD dwSendSize = reqBody.size() > m_skMaxFragSize
                                     ? m_skMaxFragSize
                                     : reqBody.size();
              if (progressCB)
                progressCB(HttpAction::Request, 0, reqBody.size());
              request.writeData(&reqBody[0], dwSendSize);
            } else {
              request.receiveResponse();
            }
            break;
          }
          case HttpAsynCBType::WriteComplete: {
            std::string& reqBody = requestInfo->reqBody;
            DWORD& dwReqBodySentSize = requestInfo->dwReqBodySentSize;
            const DWORD& dwWritten = param->dwBytesWritten;
            dwReqBodySentSize += dwWritten;
            if (progressCB)
              progressCB(HttpAction::Request, dwReqBodySentSize,
                         reqBody.size());
            DWORD dwRemainSize = reqBody.size() - dwReqBodySentSize;
            if (dwRemainSize == 0) {
              request.receiveResponse();
            } else {
              DWORD dwSendSize = dwRemainSize > m_skMaxFragSize
                                     ? m_skMaxFragSize
                                     : dwRemainSize;
              request.writeData(&reqBody[dwReqBodySentSize], dwSendSize);
            }
            break;
          }
          case HttpAsynCBType::HeadersAvailable: {
            request.receiveResponseHeaders(&requestInfo->dwStatusCode,
                                           &requestInfo->rspHeaders);
            if (request.errorCode() == 0) {
              requestInfo->dwRspBodyTotalSize = static_cast<DWORD>(
                  requestInfo->rspHeaders.GetHeaderAsUInt64(L"Content-Length"));
              requestInfo->rspBody.resize(requestInfo->dwRspBodyTotalSize);
              request.queryDataAvailable();
            }
            break;
          }
          case HttpAsynCBType::DataAvailable: {
            const DWORD& nAvailable = param->dwReadBufferSize;
            if (nAvailable == 0) {
              int code = request.errorCode();
              if (code == 0) code = requestInfo->dwStatusCode;
              if (code == 200) code = 0;
              if (m_bEnableEncodeConvert)
                convertRespEncode(requestInfo->rspHeaders, requestInfo->rspBody,
                                  &requestInfo->rspBody);
              if (rspCB)
                rspCB(code, requestInfo->rspHeaders, requestInfo->rspBody);
              delete requestInfo;
            } else {
              std::string& rspBody = requestInfo->rspBody;
              const DWORD& dwRspBodyReadSize = requestInfo->dwRspBodyReadSize;
              if (rspBody.size() < dwRspBodyReadSize + nAvailable)
                rspBody.resize(dwRspBodyReadSize + nAvailable);
              if (dwRspBodyReadSize == 0 && progressCB)
                progressCB(HttpAction::Response, 0,
                           requestInfo->dwRspBodyTotalSize);
              request.readData(&rspBody[dwRspBodyReadSize], nAvailable);
            }
            break;
          }
          case HttpAsynCBType::ReadComplete: {
            char* buf = param->pReadBuffer;
            size_t nBufferSize = static_cast<size_t>(param->dwReadBufferSize);
            requestInfo->dwRspBodyReadSize += nBufferSize;
            if (progressCB)
              progressCB(HttpAction::Response, requestInfo->dwRspBodyReadSize,
                         requestInfo->dwRspBodyTotalSize);
            request.queryDataAvailable();
            break;
          }
          default:
            break;
        }
      });
  requestInfo->request->setTimeouts(m_nResolveTimeout, m_nConnectTimeout,
                                    m_nSendTimeout, m_nReceiveTimeout);
  if (reqHeaders) requestInfo->request->setRequestHeaders(*reqHeaders);
  requestInfo->request->sendRequest(requestInfo->reqBody.size());
}

void HttpClient::asynDownload(const std::wstring& url, const std::string& file,
                              HttpDownloadComplete completeCB,
                              HttpProgressCallback progressCB /*= nullptr*/,
                              const HttpHeaders* reqHeaders /*= nullptr*/) {
  HttpRequestInfo* requestInfo = new HttpRequestInfo();
  if ((!requestInfo) || (!requestInfo->request)) {
    if (requestInfo) delete requestInfo;
    if (completeCB) completeCB(-1, HttpHeaders());
    return;
  }

  FILE* fp;
  fopen_s(&fp, file.c_str(), "wb");
  if (!fp) {
    if (completeCB) completeCB(-1, HttpHeaders());
    return;
  }

  requestInfo->request->init(
      m_userAgent, url, L"GET",
      [requestInfo, fp, completeCB, progressCB](HttpAsynCBType type,
                                                const HttpAsynParam* param) {
        HttpRequest& request = *requestInfo->request;
        switch (type) {
          case HttpAsynCBType::RequestError: {
            if (completeCB)
              completeCB(request.errorCode(), requestInfo->rspHeaders);
            delete requestInfo;
            break;
          }
          case HttpAsynCBType::SendRequestComplete: {
            request.receiveResponse();
            break;
          }
          case HttpAsynCBType::HeadersAvailable: {
            request.receiveResponseHeaders(&requestInfo->dwStatusCode,
                                           &requestInfo->rspHeaders);
            if (request.errorCode() == 0) {
              requestInfo->dwRspBodyTotalSize = static_cast<DWORD>(
                  requestInfo->rspHeaders.GetHeaderAsUInt64(L"Content-Length"));
              request.queryDataAvailable();
            }
            break;
          }
          case HttpAsynCBType::DataAvailable: {
            const DWORD& nAvailable = param->dwReadBufferSize;
            if (nAvailable == 0) {
              int code = request.errorCode();
              if (code == 0) code = requestInfo->dwStatusCode;
              if (code == 200) code = 0;
              if (fp) fclose(fp);
              if (completeCB) completeCB(code, requestInfo->rspHeaders);
              delete requestInfo;
            } else {
              std::string& rspBody = requestInfo->rspBody;
              const DWORD& dwRspBodyReadSize = requestInfo->dwRspBodyReadSize;
              rspBody.resize(nAvailable);
              if (dwRspBodyReadSize == 0 && progressCB)
                progressCB(HttpAction::Response, 0,
                           requestInfo->dwRspBodyTotalSize);
              request.readData(&rspBody[0], nAvailable);
            }
            break;
          }
          case HttpAsynCBType::ReadComplete: {
            char* buf = param->pReadBuffer;
            size_t nBufferSize = static_cast<size_t>(param->dwReadBufferSize);
            requestInfo->dwRspBodyReadSize += nBufferSize;
            size_t nWrite = fwrite(buf, 1, nBufferSize, fp);
            if (nWrite != nBufferSize) break;
            if (progressCB)
              progressCB(HttpAction::Response, requestInfo->dwRspBodyReadSize,
                         requestInfo->dwRspBodyTotalSize);
            request.queryDataAvailable();
            break;
          }
          default:
            break;
        }
      });
  requestInfo->request->setTimeouts(m_nResolveTimeout, m_nConnectTimeout,
                                    m_nSendTimeout, m_nReceiveTimeout);
  if (reqHeaders) requestInfo->request->setRequestHeaders(*reqHeaders);
  requestInfo->request->sendRequest();
}

void HttpClient::convertRespEncode(const HttpHeaders& headers,
                                   const std::string& src, std::string* dst) {
  if (src.empty()) return;
  std::wstring contentType = headers.GetHeader(L"Content-Type");
  if (contentType.empty()) return;
  std::transform(contentType.begin(), contentType.end(), contentType.begin(),
                 ::tolower);
  if ((::wcsstr(contentType.c_str(), L"text") ||
       ::wcsstr(contentType.c_str(), L"json"))) {
    if (::wcsstr(contentType.c_str(), L"utf-8")) {
      *dst = w2a(a2w(src, CP_UTF8));
    } else if (::wcsstr(contentType.c_str(), L"gbk")) {
      *dst = w2a(a2w(src));
    }
  }
}

std::wstring HttpClient::a2w(const std::string& str,
                             unsigned int codePage /*= CP_ACP*/) {
  const int nSize =
      MultiByteToWideChar(codePage, 0, str.c_str(), str.size(), nullptr, 0);
  if (nSize <= 0) return L"";

  std::wstring wstr(nSize, L'\0');
  MultiByteToWideChar(codePage, 0, str.c_str(), str.size(), &wstr[0],
                      wstr.size());
  if (wstr[0] == 0xFEFF) {
    wstr.erase();
  }

  return wstr;
}

std::string HttpClient::w2a(const std::wstring& wstr,
                            unsigned int codePage /*= CP_ACP*/) {
  const int nSize = WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(),
                                        nullptr, 0, nullptr, nullptr);
  if (nSize <= 0) return "";

  std::string str(nSize, '\0');
  WideCharToMultiByte(codePage, 0, wstr.c_str(), wstr.size(), &str[0],
                      str.size(), nullptr, nullptr);

  return str;
}
