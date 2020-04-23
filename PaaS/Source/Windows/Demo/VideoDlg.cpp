#include "stdafx.h"
#include "VideoDlg.h"
#include "resource.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

BEGIN_MESSAGE_MAP(CVideoDlg, CDialogEx)
	ON_WM_CTLCOLOR()
	ON_BN_CLICKED(IDC_BTN_OPEN_CAMERA, &CVideoDlg::OnBtnOpenCamera)
	ON_BN_CLICKED(IDC_BTN_CLOSE_CAMERA, &CVideoDlg::OnBtnCloseCamera)
	ON_BN_CLICKED(IDC_BTN_OPEN_MIC, &CVideoDlg::OnBtnOpenMic)
	ON_BN_CLICKED(IDC_BTN_CLOSE_MIC, &CVideoDlg::OnBtnCloseMic)
	ON_BN_CLICKED(IDC_BTN_OPEN_SCREEN, &CVideoDlg::OnBtnOpenScreen)
	ON_BN_CLICKED(IDC_BTN_CLOSE_SCREEN, &CVideoDlg::OnBtnCloseScreen)
	ON_BN_CLICKED(IDC_BTN_SEND_MSG, &CVideoDlg::OnBtnSendMsg)
END_MESSAGE_MAP()

CVideoDlg::CVideoDlg(CWnd* pParent)
	: CDialogEx(IDD_VIDEO_DIALOG, pParent)
{

}

void CVideoDlg::UpdateUI(UserState state)
{
	if (state != UserState::Unknown) {
		state_ = state;
	}
	if (state_ != UserState::InRoom)
	{
		//重置设备状态
		isCameraOpen_ = FALSE;
		isMicOpen_ = FALSE;
		isScreenOpen_ = FALSE;

		restAllRemoteViewWnd();

		cbCamera_.EnableWindow(FALSE);
		btnOpenCamera_.EnableWindow(FALSE);
		btnCloseCamera_.EnableWindow(FALSE);

		btnOpenMic_.EnableWindow(FALSE);
		btnCloseMic_.EnableWindow(FALSE);

		btnOpenScreen_.EnableWindow(FALSE);
		btnCloseScreen_.EnableWindow(FALSE);

		btnSendMsg_.EnableWindow(FALSE);

		editMsgList_.SetWindowText(_T(""));
	}
	else
	{
		updateCameraList();

		cbCamera_.EnableWindow(!isCameraOpen_);
		btnOpenCamera_.EnableWindow(!isCameraOpen_);
		btnCloseCamera_.EnableWindow(isCameraOpen_);

		btnOpenMic_.EnableWindow(!isMicOpen_);
		btnCloseMic_.EnableWindow(isMicOpen_);

		btnOpenScreen_.EnableWindow(!isScreenOpen_);
		btnCloseScreen_.EnableWindow(isScreenOpen_);

		btnSendMsg_.EnableWindow(TRUE);
	}
}

BOOL CVideoDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	//记录用于视频渲染的各个窗口句柄
	localView_ = GetDlgItem(IDC_LOCAL_RENDER)->m_hWnd;
	subStreamView_ = GetDlgItem(IDC_SUB_STREAM_RENDER)->m_hWnd;
	
	std::pair<HWND, std::string> pair;
	remoteViews_.clear();

	pair.first = GetDlgItem(IDC_REMOTE_RENDER1)->m_hWnd;
	pair.second = "";
	remoteViews_.push_back(pair);

	pair.first = GetDlgItem(IDC_REMOTE_RENDER2)->m_hWnd;
	pair.second = "";
	remoteViews_.push_back(pair);

	pair.first = GetDlgItem(IDC_REMOTE_RENDER3)->m_hWnd;
	pair.second = "";
	remoteViews_.push_back(pair);

	pair.first = GetDlgItem(IDC_REMOTE_RENDER4)->m_hWnd;
	pair.second = "";
	remoteViews_.push_back(pair);

	return TRUE;
}

void CVideoDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);

	DDX_Control(pDX, IDC_COMBOX_CAMERA, cbCamera_);

	DDX_Control(pDX, IDC_BTN_OPEN_CAMERA, btnOpenCamera_);
	DDX_Control(pDX, IDC_BTN_CLOSE_CAMERA, btnCloseCamera_);

	DDX_Control(pDX, IDC_BTN_OPEN_MIC, btnOpenMic_);
	DDX_Control(pDX, IDC_BTN_CLOSE_MIC, btnCloseMic_);

	DDX_Control(pDX, IDC_BTN_OPEN_SCREEN, btnOpenScreen_);
	DDX_Control(pDX, IDC_BTN_CLOSE_SCREEN, btnCloseScreen_);

	DDX_Control(pDX, IDC_EDIT_MSG_LIST, editMsgList_);
	DDX_Control(pDX, IDC_EDIT_SEND_MSG, editSendMsg_);
	DDX_Control(pDX, IDC_BTN_SEND_MSG, btnSendMsg_);
}

HBRUSH CVideoDlg::OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor)
{
	int nCtrlId = pWnd->GetDlgCtrlID();
	if (nCtrlId == IDC_LOCAL_RENDER ||
		nCtrlId == IDC_REMOTE_RENDER1 ||
		nCtrlId == IDC_REMOTE_RENDER2 ||
		nCtrlId == IDC_REMOTE_RENDER3 ||
		nCtrlId == IDC_REMOTE_RENDER4 ||
		nCtrlId == IDC_SUB_STREAM_RENDER)
	{
		
		pDC->SetTextColor(RGB(255, 255, 255));
		pDC->SetBkMode(TRANSPARENT);
		return (HBRUSH)GetStockObject(DKGRAY_BRUSH);
	}

	return __super::OnCtlColor(pDC, pWnd, nCtlColor);
}

void CVideoDlg::OnBtnOpenCamera()
{
	if (cameraList_.empty())
	{
		MessageBox(_T("无可用摄像头"), _T("错误"), MB_OK);
		return;
	}

	int nIndex = cbCamera_.GetCurSel();
	TICManager::GetInstance().GetTRTCCloud()->setCurrentCameraDevice(cameraList_[nIndex].first.c_str());

	TICManager::GetInstance().GetTRTCCloud()->startLocalPreview(localView_);

	isCameraOpen_ = TRUE;
	UpdateUI();
}

void CVideoDlg::OnBtnCloseCamera()
{
	TICManager::GetInstance().GetTRTCCloud()->stopLocalPreview();

	isCameraOpen_ = FALSE;
	UpdateUI();
}

void CVideoDlg::OnBtnOpenMic()
{
	ITRTCDeviceCollection* micList = TICManager::GetInstance().GetTRTCCloud()->getMicDevicesList();
	uint32_t micCount = micList->getCount();
	micList->release();
	if (micCount <= 0)
	{
		MessageBox(_T("无可用麦克风"), _T("错误"), MB_OK);
		return;
	}

	TICManager::GetInstance().GetTRTCCloud()->startLocalAudio();
	TICManager::GetInstance().GetTRTCCloud()->muteLocalAudio(false);

	isMicOpen_ = TRUE;
	UpdateUI();
}

void CVideoDlg::OnBtnCloseMic()
{
	TICManager::GetInstance().GetTRTCCloud()->muteLocalAudio(true);
	TICManager::GetInstance().GetTRTCCloud()->stopLocalAudio();

	isMicOpen_ = FALSE;
	UpdateUI();
}

void CVideoDlg::OnBtnOpenScreen()
{
	TRTCScreenCaptureSourceInfo src;
	src.type = TRTCScreenCaptureSourceTypeScreen;
	TICManager::GetInstance().GetTRTCCloud()->selectScreenCaptureTarget(src, RECT{ 0,0,0,0 }, true, false);
	TICManager::GetInstance().GetTRTCCloud()->startScreenCapture(subStreamView_);

	isScreenOpen_ = true;
	UpdateUI();
}

void CVideoDlg::OnBtnCloseScreen()
{
	TICManager::GetInstance().GetTRTCCloud()->stopScreenCapture();

	isScreenOpen_ = false;
	UpdateUI();
}

void CVideoDlg::OnBtnSendMsg()
{
	CString sendText;
	editSendMsg_.GetWindowText(sendText);
	if (sendText.IsEmpty())
	{
		AfxMessageBox(_T("请输入要发送的消息"), MB_OK);
		return;
	}

	std::weak_ptr<CVideoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().SendGroupTextMessage(
		w2a(sendText.GetBuffer(), CP_UTF8),	//为了和其他平台互通，发送前转成utf8编码
		[this, weakSelf, sendText](TICModule module, int code, const char *desc) {
		std::shared_ptr<CVideoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			CString msglist;
			editMsgList_.GetWindowText(msglist);
			CString text = _T("我: ") + sendText + _T("\r\n");
			editMsgList_.SetWindowText(msglist + text);
			editMsgList_.LineScroll(editMsgList_.GetLineCount());

			editSendMsg_.SetWindowText(_T(""));
		}
		else {
			showErrorMsg(module, code,desc);
		}
	});
}
void CVideoDlg::updateCameraList()
{
	cameraList_.clear();
	ITRTCDeviceCollection *camlist = TICManager::GetInstance().GetTRTCCloud()->getCameraDevicesList();
	for (uint32_t i = 0; i < camlist->getCount(); ++i)
	{
		std::pair<std::string /*id*/, std::string /*name*/> pair;
		pair.first = camlist->getDevicePID(i);
		pair.second = camlist->getDeviceName(i);
		cameraList_.emplace_back(pair);
	}
	camlist->release();

	ITRTCDeviceInfo *curCameraDeviceInfo = TICManager::GetInstance().GetTRTCCloud()->getCurrentCameraDevice();
	std::string szCurCameraId = curCameraDeviceInfo ? curCameraDeviceInfo->getDevicePID() : "";
	curCameraDeviceInfo->release();

	if (szCurCameraId.empty() && cameraList_.size() > 0)
	{
		szCurCameraId = cameraList_.front().first;
	}
	
	cbCamera_.ResetContent();
	for (size_t i = 0; i < cameraList_.size(); ++i)
	{
		cbCamera_.InsertString(i, a2w(cameraList_[i].second, CP_UTF8).c_str());
		if (cameraList_[i].first == szCurCameraId) cbCamera_.SetCurSel(i);
	}
}

HWND CVideoDlg::getRemoteViewWnd(const std::string& userId)
{
	for (auto iter = remoteViews_.begin(); iter != remoteViews_.end(); ++iter)
	{
		if (iter->second == userId) return iter->first;
	}

	for (auto iter = remoteViews_.begin(); iter != remoteViews_.end(); ++iter)
	{
		if (iter->second.empty())
		{
			iter->second = userId;
			return iter->first;
		}
	}
	return NULL;
}

void CVideoDlg::resetRemoteViewWnd(const std::string& userId)
{
	for (auto iter = remoteViews_.begin(); iter != remoteViews_.end(); ++iter)
	{
		if (iter->second == userId)
		{
			iter->second = "";
			break;
		}
	}
}

void CVideoDlg::restAllRemoteViewWnd()
{
	for (auto iter = remoteViews_.begin(); iter != remoteViews_.end(); ++iter)
	{
		iter->second = "";
	}
}

void CVideoDlg::onTICClassroomDestroy()
{
	
}

void CVideoDlg::onTICMemberJoin(const std::vector<std::string>& userIds)
{
	CString msglist;
	editMsgList_.GetWindowText(msglist);
	for (auto& var : userIds)
	{
		CString strText = CString(a2w(var).c_str()) + _T("进入房间\r\n");
		msglist += strText;
	}
	editMsgList_.SetWindowText(msglist);
	editMsgList_.LineScroll(editMsgList_.GetLineCount());
}

void CVideoDlg::onTICMemberQuit(const std::vector<std::string>& userIds)
{
	CString msglist;
	editMsgList_.GetWindowText(msglist);
	for (auto& var : userIds)
	{
		CString strText = CString(a2w(var).c_str()) + _T("退出房间\r\n");
		msglist += strText;
	}
	editMsgList_.SetWindowText(msglist);
	editMsgList_.LineScroll(editMsgList_.GetLineCount());
}

void CVideoDlg::onTICUserVideoAvailable(const std::string& userId, bool available)
{
	if (available)
	{
		printf("%s打开视频\n", userId.c_str());
		HWND hRendWnd = getRemoteViewWnd(userId);
		if (hRendWnd) TICManager::GetInstance().GetTRTCCloud()->startRemoteView(userId.c_str(), hRendWnd);
	}
	else
	{
		printf("%s关闭视频\n", userId.c_str());
		TICManager::GetInstance().GetTRTCCloud()->stopRemoteView(userId.c_str());
		resetRemoteViewWnd(userId);
	}
}

void CVideoDlg::onTICUserSubStreamAvailable(const std::string& userId, bool available)
{
	if (available)
	{
		printf("%s打开辅路视频\n", userId.c_str());
		TICManager::GetInstance().GetTRTCCloud()->startRemoteSubStreamView(userId.c_str(), subStreamView_);
	}
	else
	{
		printf("%s关闭辅路视频\n", userId.c_str());
		TICManager::GetInstance().GetTRTCCloud()->stopRemoteSubStreamView(userId.c_str());
	}
}

void CVideoDlg::onTICUserAudioAvailable(const std::string& userId, bool available)
{
	if (available)
	{
		printf("%s打开音频\n", userId.c_str());
	}
	else
	{
		printf("%s关闭音频\n", userId.c_str());
	}
}

void CVideoDlg::onTICDevice(const std::string& deviceId, TRTCDeviceType type, TRTCDeviceState state)
{
	printf("设备插拔: %s %d %d\n", w2a(a2w(deviceId, CP_UTF8)).c_str(), type, state);

	if (type == TRTCDeviceTypeCamera)
	{
		updateCameraList();
	}
}

void CVideoDlg::onTICSendOfflineRecordInfo(int code, const char* desc)
{
	if (code == 0)
	{
		printf("发送对时信息成功,可以进行课后离线录制.\n");
	}
	else
	{
		printf("发送对时信息失败,将无法进行课后离线录制. %d %s\n", code, desc);
	}
}

void CVideoDlg::onTICRecvTextMessage(const std::string& fromUserId, const std::string& text)
{
	//printf("收到C2C文本消息: %s : %s.\n", fromUserId.c_str(), w2a(a2w(text, CP_UTF8), CP_ACP).c_str());

	CString msglist;
	editMsgList_.GetWindowText(msglist);

	CString strText = CString(a2w(fromUserId).c_str()) + _T("(私聊): ") + CString(a2w(text, CP_UTF8).c_str()) + _T("\r\n"); //tic demo各平台统一用UTF8编码收发消息,后面不再说明
	editMsgList_.SetWindowText(msglist + strText);
	editMsgList_.LineScroll(editMsgList_.GetLineCount());
}

void CVideoDlg::onTICRecvCustomMessage(const std::string& fromUserId, const std::string& data)
{
	//printf("收到C2C自定义消息: %s : %s.\n", fromUserId.c_str(), w2a(a2w(data, CP_UTF8), CP_ACP).c_str());
}

void CVideoDlg::onTICRecvGroupTextMessage(const std::string& fromUserId, const std::string& text)
{
	//printf("收到群文本消息: %s: %s.\n", fromUserId.c_str(), w2a(a2w(text, CP_UTF8), CP_ACP).c_str());

	CString msglist;
	editMsgList_.GetWindowText(msglist);

	CString strText = CString(a2w(fromUserId).c_str()) + _T(": ") + CString(a2w(text, CP_UTF8).c_str()) + _T("\r\n");
	editMsgList_.SetWindowText(msglist + strText);
	editMsgList_.LineScroll(editMsgList_.GetLineCount());
}

void CVideoDlg::onTICRecvGroupCustomMessage(const std::string& fromUserId, const std::string& data)
{
	//printf("收到自定义群消息: %s: %s.\n", fromUserId.c_str(), w2a(a2w(data, CP_UTF8), CP_ACP).c_str());
}

void CVideoDlg::onTICRecvMessage(const std::string& jsonMsg)
{
	//printf("收到消息:\n%s\n", w2a(a2w(jsonMsg, CP_UTF8), CP_ACP).c_str());
}
