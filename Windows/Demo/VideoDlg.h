#pragma once

#include <memory>

enum class UserState
{
	Unknown,	//未知状态
	NotInit,	//未初始化状态
	Init,		//初始化状态
	Login,		//登录状态
	InRoom,		//房间内状态
};

class CVideoDlg
	: public CDialogEx
	, public TICEventListener
	, public TICMessageListener
	, public std::enable_shared_from_this<CVideoDlg>
{
	DECLARE_MESSAGE_MAP()
public:
	CVideoDlg(CWnd* pParent = nullptr);

	// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_VIDEO_DIALOG };
#endif

	void UpdateUI(UserState state = UserState::Unknown);

private:
	virtual BOOL OnInitDialog() override;
	virtual void DoDataExchange(CDataExchange* pDX) override;

	// 消息映射函数
	afx_msg HBRUSH OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor);

	afx_msg void OnBtnOpenCamera();
	afx_msg void OnBtnCloseCamera();

	afx_msg void OnBtnOpenMic();
	afx_msg void OnBtnCloseMic();

	afx_msg void OnBtnOpenScreen();
	afx_msg void OnBtnCloseScreen();

	afx_msg void OnBtnSendMsg();
	void updateCameraList();

	HWND getRemoteViewWnd(const std::string& userId);
	void resetRemoteViewWnd(const std::string& userId);
	void restAllRemoteViewWnd();

	//TICEventListener
	virtual void onTICClassroomDestroy() override;

	virtual void onTICMemberJoin(const std::vector<std::string>& userIds) override;
	virtual void onTICMemberQuit(const std::vector<std::string>& userIds) override;

	virtual void onTICUserVideoAvailable(const std::string& userId, bool available) override;
	virtual void onTICUserSubStreamAvailable(const std::string& userId, bool available) override;
	virtual void onTICUserAudioAvailable(const std::string& userId, bool available) override;

	virtual void onTICDevice(const std::string& deviceId, TRTCDeviceType type, TRTCDeviceState state) override;

	//TICMessageListener
	virtual void onTICRecvTextMessage(const std::string& fromUserId, const std::string& text) override;
	virtual void onTICRecvCustomMessage(const std::string& fromUserId, const std::string& data) override;
	virtual void onTICRecvGroupTextMessage(const std::string& fromUserId, const std::string& text) override;
	virtual void onTICRecvGroupCustomMessage(const std::string& fromUserId, const std::string& data) override;
	virtual void onTICRecvMessage(const std::string& jsonMsg) override;

private:
	HWND	localView_ = NULL;
	HWND	subStreamView_ = NULL;
	std::vector< std::pair< HWND /*hwnd*/, std::string /*userId*/> > remoteViews_;

	CComboBox cbCamera_;

	CButton btnOpenCamera_;
	CButton btnCloseCamera_;

	CButton btnOpenMic_;
	CButton btnCloseMic_;

	CButton btnOpenScreen_;
	CButton btnCloseScreen_;

	CEdit editMsgList_;
	CEdit editSendMsg_;
	CButton btnSendMsg_;

	std::vector<std::pair<std::string /*id*/, std::string /*name*/>> cameraList_;

	BOOL isCameraOpen_ = FALSE;
	BOOL isMicOpen_ = FALSE;
	BOOL isScreenOpen_ = FALSE;

	UserState state_ = UserState::NotInit;
};