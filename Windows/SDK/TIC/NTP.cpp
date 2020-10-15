//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "NTP.h"

#include <WS2tcpip.h>
#include <WinSock2.h>
#include <Windows.h>

#include <chrono>
#include <string>
#include <thread>

#pragma comment(lib, "ws2_32.lib")

const char* kDefaultNTPServer = "time1.cloud.tencent.com";  // 腾讯云NTP服务器
const char* kDefaultNTPPort = "123";  // NTP协议默认端口

const static uint64_t OFFSET_1900_TO_1970 =
    ((365LL * 70LL) + 17LL) * 24LL * 60LL *
    60LL;  // 70 years plus 17 leap days;

#pragma pack(push, 1)
struct NTPData {
  uint32_t Mode : 3;
  uint32_t VersionNumber : 3;
  uint32_t LeapIndicator : 2;
  uint32_t Stratum : 8;
  uint32_t Poll : 8;
  uint32_t Precision : 8;
  uint32_t RootDelay : 32;
  uint32_t RootDispersion : 32;
  uint32_t ReferenceIdentifier : 32;
  uint64_t ReferenceTimestamp;
  uint64_t OriginateTimestamp;
  uint64_t ReceiveTimestamp;
  uint64_t TransmitTimestamp;
};
#pragma pack(pop)

void NTP::getNTPServerTime(const std::string& ntpServer, int nRetry,
                           NTPCallback cb) {
  WSADATA wsaData;
  int nRet = WSAStartup(MAKEWORD(2, 2), &wsaData);
  if (nRet != NO_ERROR) {
    cb(nRet, "Start up socket context failed.", 0);
    return;
  }

  SOCKET sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
  if (sock == INVALID_SOCKET) {
    cb(nRet, "Create socket failed.", 0);
    WSACleanup();
    return;
  }

  int nRecvTimeOut = 4000;  // 接收NTP服务器返回超时时间
  setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char*)&nRecvTimeOut,
             sizeof(nRecvTimeOut));

  addrinfo hints = {0};
  hints.ai_family = AF_INET;
  hints.ai_socktype = SOCK_DGRAM;
  hints.ai_protocol = IPPROTO_UDP;
  addrinfo* addrRes = nullptr;
  PCSTR pServer = ntpServer.empty() ? kDefaultNTPServer : ntpServer.c_str();
  nRet = getaddrinfo(pServer, kDefaultNTPPort, &hints, &addrRes);
  if (nRet != 0) {
    cb(-1, "Get NTP server ip info failed.", 0);
    closesocket(sock);
    WSACleanup();
    return;
  }
  sockaddr_in addr = *reinterpret_cast<sockaddr_in*>(addrRes->ai_addr);
  freeaddrinfo(addrRes);

  std::thread th([=]() {
    int errCode = 0;
    std::string errMsg;
    int64_t serverTime = 0;

    for (int i = 0; i < nRetry; ++i) {
      NTPData data = {0};
      data.VersionNumber = 3;
      data.Mode = 3;
      int64_t nT1 =
          std::chrono::system_clock::now().time_since_epoch().count() *
          _XTIME_NSECS_PER_TICK / 1000000;

      int nRet = sendto(sock, (const char*)&data, sizeof(data), 0,
                        (SOCKADDR*)&addr, sizeof(addr));
      if (nRet == SOCKET_ERROR) {
        errCode = nRet;
        errMsg = "Send data to NTP server failed.";
        serverTime = 0;
        continue;
      }

      NTPData recvData = {0};
      sockaddr addrFrom = {0};
      int nAddrFromLen = sizeof(addrFrom);
      nRet = recvfrom(sock, reinterpret_cast<char*>(&recvData),
                      sizeof(recvData), 0, &addrFrom, &nAddrFromLen);
      if (nRet == SOCKET_ERROR) {
        serverTime = 0;
        errCode = WSAGetLastError();
        if (errCode == 10060) {  // 等待服务器返回超时
          errMsg = "Receive data from NTP server time out.";
          continue;
        } else {
          errMsg = "Receive data from NTP server failed.";
          break;
        }
      }

      int64_t nT2 = _NTPTime2UTCTime(ntohll(recvData.ReceiveTimestamp));
      int64_t nT3 = _NTPTime2UTCTime(ntohll(recvData.TransmitTimestamp));
      int64_t nT4 =
          std::chrono::system_clock::now().time_since_epoch().count() *
          _XTIME_NSECS_PER_TICK / 1000000;
      int64_t nNetworkDelay = ((nT4 - nT1) - (nT3 - nT2)) / 2;

      errCode = 0;
      errMsg = "";
      serverTime = nT3 + nNetworkDelay;
      break;
    }

    if (cb) cb(errCode, errMsg.c_str(), serverTime);

    closesocket(sock);
    WSACleanup();
  });
  th.detach();
}

uint64_t NTP::_getCurrentNTPTime() {
  uint64_t now = std::chrono::system_clock::now().time_since_epoch().count() *
                 _XTIME_NSECS_PER_TICK / 1000000;  // 毫秒
  uint64_t seconds = now / 1000 + OFFSET_1900_TO_1970;
  uint64_t fraction =
      static_cast<uint64_t>((now % 1000) / 1000.0 * 0x100000000L);
  return (seconds << 32) | (fraction & 0xFFFFFFFF);
}

uint64_t NTP::_NTPTime2UTCTime(uint64_t ntpTime) {
  uint64_t seconds = (ntpTime >> 32) - OFFSET_1900_TO_1970;
  uint64_t millsecond = static_cast<uint64_t>(
      static_cast<double>(ntpTime & 0xFFFFFFFF) / 0x100000000L * 1000);
  return seconds * 1000 + millsecond;
}
