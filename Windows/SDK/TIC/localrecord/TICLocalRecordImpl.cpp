
#include<windows.h>
#include<stdio.h>
#include "TICLocalRecordImpl.h"
#include "../jsoncpp/json.h"
#include <strstream>
#include <iomanip>
#include <algorithm>
#include <chrono>
#include <time.h>



const std::string URL = "http://127.0.0.1:37604/localrecord/v1/";

struct BaseCallback{
	BaseCallback(const TICCallback callback) { this->callback = callback; }
	virtual void parse(const std::string& response, TICLocalRecorderImpl::Result& result) const {};
	TICCallback callback;
};

class CmdCallback : public BaseCallback {
public:
	CmdCallback(const TICCallback callback) : BaseCallback(callback){ }
	virtual void parse(const std::string& response, TICLocalRecorderImpl::Result& result) const override {
		std::string rspBuf = response;
		Json::Value Val;
		Json::Reader reader;
		if (!reader.parse(rspBuf.c_str(), rspBuf.c_str() + rspBuf.size(), Val)) { //从ifs中读取数据到jsonRoot
			result.msg = std::string("parse json error :");
			result.code = -1;
			return;
		}

		if (Val.isMember("Response")) {
			auto Response = Val["Response"];

			if (Response.isMember("Error")) { //失败，错误返回
				auto error = Response["Error"];
				if (error.isMember("Code")) {
					result.code = error["Code"].asInt();
				}
				if (error.isMember("Message")) {
					result.msg = error["Message"].asString();
				}
			}
			else {
				result.code = 0;
				result.msg = response;
			}
		}
		else {
			result.msg = std::string("invalid response");
			result.code = -1;
		}
	}
};

class ServerCallback : public BaseCallback {
public:
	ServerCallback(const TICCallback callback) : BaseCallback(callback) { }

	virtual void parse(const std::string& response, TICLocalRecorderImpl::Result& result) const override {
		result.code = 0;
		result.msg = response;
	}
};

/**
*单位：毫秒
*/
uint64_t txf_getutctick() {
#if defined(_WIN32)
	return (uint64_t)std::chrono::system_clock::now().time_since_epoch().count() / 10000;  // Windows要求除10000（神奇）
#else
	return (uint64_t)std::chrono::system_clock::now().time_since_epoch().count() / 1000;
#endif
}

TICLocalRecorderImpl::TICLocalRecorderImpl() {
}



TICLocalRecorderImpl::~TICLocalRecorderImpl() {
}


bool TICLocalRecorderImpl::startService(const std::string& path) {
	BOOL ret = FALSE;
	std::string cmd = "";

	SHELLEXECUTEINFOA sei = { 0 };
	sei.cbSize = sizeof(SHELLEXECUTEINFOA);
	sei.fMask = SEE_MASK_NOCLOSEPROCESS;
	sei.hwnd = NULL;
	sei.lpVerb = "open";
	sei.lpFile = path.c_str();
	sei.lpParameters = cmd.c_str();
	sei.lpDirectory = NULL;
	sei.nShow = SW_HIDE;
	sei.hInstApp = NULL;
	sei.lpIDList = NULL;
	sei.lpClass = NULL;
	sei.hkeyClass = NULL;
	sei.dwHotKey = NULL;
	sei.hIcon = NULL;
	sei.hProcess = NULL;

	ret = ::ShellExecuteExA(&sei);

	return ret;
}

int TICLocalRecorderImpl::init(const TEduRecordAuthParam& authParam, TICCallback callback) {
	mAuth = authParam;

	Json::Value value;
	value["SdkAppId"] = authParam.appId;
	value["UserId"] = authParam.userId;
	value["UserSig"] = authParam.userSig;

	Json::FastWriter writer;
	std::string msg = writer.write(value);

	sendCmd("Init", msg, callback);

	StartTimer();

	return 0;
}


int TICLocalRecorderImpl::startLocalRecord(const TEduRecordParam& para, const char * szRecordPath, TICCallback callback) {

	if (szRecordPath != NULL && strlen(szRecordPath) > 0) {
		Json::Value value;
		value["AppProc"] = para.AppProc;
		value["Wnd"] = para.Wnd;
		value["x"] = para.x;
		value["y"] = para.y;
		value["Width"] = para.width;
		value["Height"] = para.Height;
		value["VideoFps"] = para.videoFps;
		value["VideoBps"] = para.videoBps;
		value["EnableAudio"] = para.enableAudio;
		value["DstPath"] = szRecordPath;
		value["ClassId"] = para.classId;

		Json::FastWriter writer;
		std::string msg = writer.write(value);

		sendCmd("StartRecord", msg, callback);

		return 0;
	}

	return -1;
}

int TICLocalRecorderImpl::stopLocalRecord(TICCallback callback) {
	sendCmd("StopRecord", std::string(), callback);

	return 0;
}

int TICLocalRecorderImpl::pauseLocalRecord(TICCallback callback) {
	sendCmd("PauseRecord", std::string(), callback);
	return 0;
}

int TICLocalRecorderImpl::resumeLocalRecord(TICCallback callback) {
	sendCmd("ResumeRecord", std::string(), callback);
	return 0;
}

int TICLocalRecorderImpl::exit(TICCallback callback) {
	StopTimer();

	sendCmd("Exit", std::string(), callback);

	return 0;
}

int TICLocalRecorderImpl::getState(TICCallback callback) {
	sendCmd("GetState", std::string(), callback);
	return 0;
}

int TICLocalRecorderImpl::getRecordResult(const TEduRecordAuthParam& auth, const RecordKey& key, TICCallback callback) {
	if (key.appid == 0) {
		printf("user info error");
		return -1;
	}


	char httpsUrl[1024] = { 0 };
	int rand = std::rand();
	const char* URL = "https://yun.tim.qq.com/v4/ilvb_edu/local_record?sdkappid=%d&identifier=%s&usersig=%s&random=%d&contenttype=json";
	sprintf(httpsUrl, URL, auth.appId, auth.userId.c_str(), auth.userSig.c_str(), rand);

	Json::Value value;
	value["Action"] = "QueryRecordInfo";
	//if (key.class_id != 0) {
		value["RoomId"] = key.class_id;
//	}
	if (!key.user_id.empty()) {
		value["UserId"] = key.user_id;
	}
	if (!key.task_id.empty()) {
		value["TaskId"] = key.task_id;
	}
		value["SpliceTimeDesc"] = true;

		value["Index"] = key.index;
	
		value["Size"] = key.size;

	Json::FastWriter writer;
	std::string msg = writer.write(value);

	ServerCallback* servercallback = new ServerCallback(callback);
	sendRequest(HttpClient::a2w(httpsUrl), msg, servercallback);

	return 0;
}

void TICLocalRecorderImpl::sendCmd(const std::string& cmd, const std::string& content, const TICCallback callback) {
	CmdCallback* cmdcallbck = new CmdCallback(callback);
	sendRequest(HttpClient::a2w(URL + cmd), content, cmdcallbck);
}



void TICLocalRecorderImpl::sendRequest(const std::wstring& url, const std::string& reqBody, BaseCallback* mycallback) {
	if (!url.empty()) {

		http.asynPost(url, reqBody, [=](int code, const HttpHeaders& rspHeaders, const std::string& rspBuf) {
			Result res(0, "succ");

			if (code != 0) {
				res.code = code;
				res.msg = std::string("http request error ") ;
				goto myEXIT;
			}

			if (mycallback) {
				mycallback->parse(std::string(rspBuf), res);
			}

		myEXIT:
			if (mycallback) {
				if (mycallback->callback) {
					mycallback->callback(TICMODULE_RECORD, res.code, res.msg.c_str());
				}
				delete mycallback;
			}
		});
	}
}

void TICLocalRecorderImpl::StartTimer()
{
	StopTimer();
	syncTimer_ = ::SetTimer(NULL, 0, 5000, [](HWND hwnd, UINT msg, UINT_PTR timerid, DWORD dwTime) {
		TICLocalRecorderImpl* pThis = static_cast<TICLocalRecorderImpl*>(TICLocalRecorder::GetInstance());
		if (pThis) pThis->onTimer();
	});
}

void TICLocalRecorderImpl::StopTimer()
{
	if (syncTimer_ != 0)
	{
		::KillTimer(0, syncTimer_);
		syncTimer_ = 0;
	}
}

void TICLocalRecorderImpl::onTimer() {
	//std::weak_ptr< TICLocalRecorderImpl> weakSelf = this->shared_from_this();
	getState([this](TICModule module, int code, const char *desc) {
		//std::shared_ptr<TICLocalRecorderImpl> self = weakSelf.lock();
		//if (!self)
		//	return;

		if (code == 0) {
			printf(" getState: %s",  desc);

			Json::Value Val;
			Json::Reader reader;
			if (!reader.parse(desc, strlen(desc) + desc, Val)) { //从ifs中读取数据到jsonRoot
				return;
			}

			RecordState state;

			if (Val.isMember("Response")) {
				auto Response = Val["Response"];

				//登录状态
				if (Response.isMember("Auth")) {
					auto auth = Response["Auth"];
					if (auth.isMember("UserId")) {
						state.auth.UserId = auth["UserId"].asString();
					}
					if (auth.isMember("State")) {
						state.auth.State = auth["State"].asString();
					}
				}

				//登录状态
				if (Response.isMember("Record")) {
					auto record = Response["Record"];
					if (record.isMember("Id")) {
						state.recording.RecordId = record["Id"].asString();
					}
					if (record.isMember("State")) {
						state.recording.State = record["State"].asString();
					}
					if (record.isMember("Duration")) {
						state.recording.Duration = record["Duration"].asInt();
					}
				}

				//上传状态
				if (Response.isMember("Upload")) {
					auto uploads = Response["Upload"];
					if (uploads.isArray()) {
						int size = uploads.size();
						for (int i = 0; i < size; ++i) {
							auto up = uploads[i];
							UploadState uploadState;

							if (up.isMember("Id")) {
								uploadState.RecordId = up["Id"].asString();
							}
							if (up.isMember("State")) {
								uploadState.State = up["State"].asString();
							}
							if (up.isMember("Total")) {
								uploadState.Total = up["Total"].asInt();
							}
							if (up.isMember("Duration")) {
								uploadState.Duration = up["Duration"].asInt();
							}
							if (up.isMember("IsCurrentRecoding")) {
								uploadState.IsCurrentRecoding = up["IsCurrentRecoding"].asBool();
							}
							state.upload.push_back(uploadState);
						}
					}
				}
			}
			
			//Callback
			auto callback = mCallback.lock();
			if (callback) {
				callback->onGotStatus(state);
			}

		}
	});
}
