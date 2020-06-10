#pragma once

/*******************************************************************
* @purpose	NTP对时协议实现
* @details	封装NTP对时协议
********************************************************************/

#include <functional>

typedef std::function<void(int code, const char* desc, int64_t serverTime)> NTPCallback;

class NTP
{
public:
	static void getNTPServerTime(const std::string& ntpServer, int nRetry, NTPCallback cb);

private:
	static uint64_t _getCurrentNTPTime();
	static uint64_t _NTPTime2UTCTime(uint64_t ntpTime);
};