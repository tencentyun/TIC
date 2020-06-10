#ifndef _TIC_LOCAL_RECORD_IMPL_H_
#define _TIC_LOCAL_RECORD_IMPL_H_


#include <string>
#include <stdio.h>
#include <functional>
#include "TICLocalRecord.h"
#include "../HttpClient.h"

struct BaseCallback;

class TICLocalRecorderImpl : public TICLocalRecorder, public std::enable_shared_from_this<TICLocalRecorderImpl> {
public:
	TICLocalRecorderImpl();
	virtual ~TICLocalRecorderImpl();
	bool startService(const std::string& path)override;
	virtual int init(const TEduRecordAuthParam& authParam, TICCallback callback) override;
	virtual int startLocalRecord(const TEduRecordParam& para, const char * szRecordPath, TICCallback callback) override;
	virtual int stopLocalRecord(TICCallback callback) override;
	virtual int pauseLocalRecord(TICCallback callback) override;
	virtual int resumeLocalRecord(TICCallback callback) override;
	virtual int exit(TICCallback callback) override;
	virtual int getState(TICCallback callback)override;
	virtual int getRecordResult(const TEduRecordAuthParam& authParam, const RecordKey& key, TICCallback callback) override;

	struct Result {
		Result() {}
		Result(int code, const std::string& msg) {
			this->code = code;
			this->msg = msg;
		}
		int code = 0;
		std::string msg;
	};

protected:

	void sendCmd(const std::string& cmd, const std::string& content, const TICCallback callback);
	void sendRequest(const std::wstring& cmd, const std::string& reqBody, BaseCallback* mycallback);

	void StartTimer();
	void StopTimer();
	void onTimer();

protected:
	UINT_PTR syncTimer_ = 0;
	TEduRecordAuthParam mAuth;
	HttpClient http;

};

#endif // !_TIC_LOCAL_RECORD_IMPL_H_

