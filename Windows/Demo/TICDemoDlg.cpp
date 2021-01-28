#include "stdafx.h"
#include "TICDemo.h"
#include "TICDemoDlg.h"
#include "afxdialogex.h"
#include "TIC/jsoncpp/json.h"
#include <random>

#ifdef _DEBUG
#define new DEBUG_NEW
#endif
extern CTICDemoApp theApp;

BEGIN_MESSAGE_MAP(CTICDemoDlg, CDialogEx)
	ON_WM_CTLCOLOR()
	ON_WM_SIZE()
	ON_WM_DESTROY()
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_NOTIFY(TCN_SELCHANGE, IDC_TAB, &CTICDemoDlg::OnTabSelChange)
	ON_BN_CLICKED(IDC_BTN_JOIN_ROOM, &CTICDemoDlg::OnBtnJoinRoom)
	ON_BN_CLICKED(IDC_BTN_QUIT_ROOM, &CTICDemoDlg::OnBtnQuitRoom)
	ON_WM_TIMER()
END_MESSAGE_MAP()


CTICDemoDlg::CTICDemoDlg(CWnd* pParent /*=nullptr*/)
	: CDialogEx(IDD_TICDEMO_DIALOG, pParent)
{
	hIcon_ = AfxGetApp()->LoadIcon(IDR_MAINFRAME);

	videoDlg_ = std::make_shared<CVideoDlg>();
	boardDlg_ = std::make_shared<CBoardDlg>();
}

CTICDemoDlg::~CTICDemoDlg()
{

}

void CTICDemoDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);

	DDX_Control(pDX, IDC_TAB, tabCtrl_);

	DDX_Control(pDX, IDC_EDIT_USER, editUser_);
	DDX_Control(pDX, IDC_EDIT_CLASSID, editClassId_);

	DDX_Control(pDX, IDC_BTN_JOIN_ROOM, btnJoinRoom_);
	DDX_Control(pDX, IDC_BTN_QUIT_ROOM, btnQuitRoom_);
}

BOOL CTICDemoDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	SetIcon(hIcon_, TRUE);  // 设置大图标
	SetIcon(hIcon_, FALSE); // 设置小图标

	//插入TAB页
	tabCtrl_.InsertItem(0, _T("白板"));
	tabCtrl_.InsertItem(1, _T("视频"));
	

	boardDlg_->Create(IDD_BOARD_DIALOG, &tabCtrl_);
	videoDlg_->Create(IDD_VIDEO_DIALOG, &tabCtrl_);

	//获取标签高度
	CRect itemRect;
	tabCtrl_.GetItemRect(0, &itemRect);

	//获取并计算标签页工作区大小
	CRect clientRect;
	tabCtrl_.GetClientRect(clientRect);
	clientRect.top += itemRect.Height() + 2;
	clientRect.bottom -= 2;
	clientRect.left += 2;
	clientRect.right -= 2;

	boardDlg_->MoveWindow(&clientRect);
	boardDlg_->ShowWindow(SW_SHOW);
	videoDlg_->MoveWindow(&clientRect);
	videoDlg_->ShowWindow(SW_HIDE);
	
	

	// TIC回调
	TICManager::GetInstance().AddEventListener(videoDlg_.get());
	TICManager::GetInstance().AddMessageListener(videoDlg_.get());
	TICManager::GetInstance().AddStatusListener(this);

	// 填写默认参数
	std::default_random_engine randomEngine(time(NULL));
	std::uniform_int_distribution<int> uid(10000, 99999);
	std::wstring userId = L"tiw_win_" + std::to_wstring(uid(randomEngine));
	theApp.setUserId(w2a(userId));
	if (__argc == 1) {
		editClassId_.SetWindowText(L"13582");
	}
	else {
		int classId = 0;
		std::sscanf(__argv[1], "%d", &classId);
		theApp.setClassId(classId);
		std::wstring classIdStr = std::to_wstring(classId);
		editClassId_.SetWindowText(classIdStr.c_str());
	}

	// 启动定时器，在定时器内检测签名获取状态，更新UI提示信息并触发登录操作
	UpdateUI(UserState::NotInit);
	editUser_.SetWindowText(L"拉取用户信息...");
	this->SetTimer(0, 500, nullptr);

	// 拉取签名信息
	std::wstring url = L"https://classroom-6b29e9.service.tcloudbase.com/tiw_usersig?userId=" + userId + L"&timestamp=" + std::to_wstring(time(NULL));
	HttpHeaders headers;
	headers.SetHeader(L"Referer", L"demo.qcloudtiw.com");
	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	httpClient_.asynGet(url, [this, weakSelf](int code, const HttpHeaders& rspHeaders, const std::string& rspBody) {
		if (code != 0) {
			showErrorMsg(TICMODULE_TIC, -1, "Authentication failed");
			return;
		}
		Json::Reader reader;
		Json::Value root;
		bool bRet = reader.parse(rspBody, root);
		if (!bRet || root["sdkAppId"].isNull() || root["userSig"].isNull()) {
			showErrorMsg(TICMODULE_TIC, -2, "JSON parse failed!");
			return;
		}

		theApp.setSdkAppId(root["sdkAppId"].asInt());
		theApp.setUserSig(root["userSig"].asString());
		UpdateUI(UserState::Init);
		}, &headers);

	//设置版本信息;
	CString version;
	version.Format(_T("版本信息：IMSDK: %s | TRTC: %s | TEduBoard: %s"),
		a2w(TIMGetSDKVersion()).c_str(),
		a2w(getLiteAvSDKVersion()).c_str(),
		a2w(GetTEduBoardVersion()).c_str());

	GetDlgItem(IDC_VERSION)->SetWindowText(version);

	return TRUE;
}


void CTICDemoDlg::OnTimer(UINT_PTR nIDEvent)
{
	static int dot0 = 0;
	static int dot1 = 0;
	static bool login = false;
	if (nIDEvent == 0) {
		dot0++;
		if (dot0 > 3) dot0 = 1;
		std::wstring dotStr(dot0, L'.');
		if (this->state_ == UserState::NotInit) {
			std::wstring notify = L"获取用户信息" + dotStr;  // 提示正在获取用户信息
			editUser_.SetWindowText(notify.c_str());
		}
		else if (this->state_ == UserState::Init) {
			std::wstring notify = L"登录" + dotStr;  // 提示正在登录
			editUser_.SetWindowText(notify.c_str());
			if (!login) {
				login = true;
				std::weak_ptr<CTICDemoDlg> weakSelf = this->shared_from_this();
				TICManager::GetInstance().Init(theApp.getSdkAppId(), [this, weakSelf](TICModule module, int code, const char *desc) {
					std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
					if (!self)
					{
						return;
					}

					if (code == 0) {
						TICManager::GetInstance().Login(theApp.getUserId(), theApp.getUserSig(), [this, weakSelf](TICModule module, int code, const char *desc) {
							std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
							if (!self)
							{
								return;
							}

							if (code == 0) {
								UpdateUI(UserState::Login);
								if (theApp.getClassId() != 0) {  // 通过命令行参数传入了房间号，自动进房
									btnJoinRoom_.SendMessage(BM_CLICK, 0, 0);
								}
							}
							else {
								showErrorMsg(module, code, desc);
							}
							});
					}
					else {
						showErrorMsg(module, code, desc);
					}
					});
			}
		}
		if (this->state_ == UserState::Login) {
			std::wstring notify = a2w(theApp.getUserId());  // 显示用户名
			editUser_.SetWindowText(notify.c_str());
			this->KillTimer(0);  // 删除定时器
		}
	}
	else if (nIDEvent == 1) {
		dot1++;
		if (dot1 > 3) dot1 = 1;
		std::wstring dotStr(dot1, L'.');
		if (this->state_ == UserState::Login) {
			std::wstring notify = L"加入房间" + dotStr;  // 提示正在加入房间
			editClassId_.SetWindowText(notify.c_str());
		}
		else if (this->state_ == UserState::InRoom) {
			std::wstring notify = std::to_wstring(theApp.getClassId());  // 显示房间号
			editClassId_.SetWindowText(notify.c_str());
			this->KillTimer(1);  // 删除定时器
		}
	}
	__super::OnTimer(nIDEvent);
}

HBRUSH CTICDemoDlg::OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor)
{
	int nCtrlId = pWnd->GetDlgCtrlID();
	if (nCtrlId == IDC_NOTIFY)
	{
		pDC->SetTextColor(RGB(200, 0, 0));
		pDC->SetBkMode(TRANSPARENT);
		return (HBRUSH)GetStockObject(NULL_BRUSH);
	}

	return __super::OnCtlColor(pDC, pWnd, nCtlColor);
}

void CTICDemoDlg::OnSize(UINT nType, int cx, int cy)
{
	__super::OnSize(nType, cx, cy);

	if (tabCtrl_.m_hWnd) {
		//获取标签高度
		CRect itemRect;
		tabCtrl_.GetItemRect(0, &itemRect);

		//获取并计算标签页工作区大小
		CRect clientRect;
		tabCtrl_.GetClientRect(clientRect);
		clientRect.top += itemRect.Height() + 2;
		clientRect.bottom -= 2;
		clientRect.left += 2;
		clientRect.right -= 2;

		videoDlg_->MoveWindow(&clientRect);
		boardDlg_->MoveWindow(&clientRect);
	}
}

void CTICDemoDlg::OnDestroy()
{
	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().Uninit([this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::NotInit);
		}
		else {
			UpdateUI(UserState::NotInit);
			showErrorMsg(module, code, desc);
		}
	});

	TICManager::GetInstance().RemoveEventListener(videoDlg_.get());
	TICManager::GetInstance().RemoveMessageListener(videoDlg_.get());
	TICManager::GetInstance().RemoveStatusListener(this);
}

void CTICDemoDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // 用于绘制的设备上下文

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// 使图标在工作区矩形中居中
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 绘制图标
		dc.DrawIcon(x, y, hIcon_);
	}
	else
	{
		CDialogEx::OnPaint();
	}
}

//当用户拖动最小化窗口时系统调用此函数取得光标显示。
HCURSOR CTICDemoDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(hIcon_);
}

void CTICDemoDlg::OnTabSelChange(NMHDR *pNMHDR, LRESULT *pResult)
{
	*pResult = 0;
	int nCurSel = tabCtrl_.GetCurSel();
	switch (nCurSel)
	{
	case 0:
		boardDlg_->ShowWindow(SW_SHOW);
		videoDlg_->ShowWindow(SW_HIDE);
		break;
	case 1:
		boardDlg_->ShowWindow(SW_HIDE);
		videoDlg_->ShowWindow(SW_SHOW);
		break;
	case 2:
		boardDlg_->ShowWindow(SW_HIDE);
		videoDlg_->ShowWindow(SW_HIDE);
		break;
	default:
		break;
	}
}

void CTICDemoDlg::OnBtnJoinRoom()
{
	CString str;
	editClassId_.GetWindowText(str);
	if (str.IsEmpty())
	{
		AfxMessageBox(_T("请先填写房间号"), MB_OK);
		return;
	}
	int classId = atoi(w2a(str.GetBuffer()).c_str());
	if (classId == 0)
	{
		AfxMessageBox(_T("房间号有误"), MB_OK);
		return;
	}
	theApp.setClassId(classId);

	btnJoinRoom_.EnableWindow(FALSE);

	// 启动定时器，在定时器内检测进房状态，更新UI提示信息
	editClassId_.SetWindowText(L"加入房间...");
	this->SetTimer(1, 500, nullptr);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().CreateClassroom(classId, TIC_CLASS_SCENE_VIDEO_CALL, [this, weakSelf, classId](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0 || code == 10021 || code == 10025) {
			TICClassroomOption option;
			option.classId = classId;
			option.boardCallback = boardDlg_.get();

			std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
			TICManager::GetInstance().JoinClassroom(option, [this, weakSelf](TICModule module, int code, const char *desc) {
				std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
				if (!self)
				{
					return;
				}

				if (code == 0) {
					UpdateUI(UserState::InRoom);
					boardDlg_->Init();
				}
				else {
					showErrorMsg(module, code, desc);
				}
				});
		}
		else {
			showErrorMsg(module, code, desc);
		}
		});
}

void CTICDemoDlg::OnBtnQuitRoom()
{
	btnQuitRoom_.EnableWindow(FALSE);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().QuitClassroom(false, [this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::Login);
			boardDlg_->Uninit();
		}
		else {
			showErrorMsg(module, code, desc);
		}
	});
}

void CTICDemoDlg::onTICForceOffline()
{
	UpdateUI(UserState::NotInit);

	AfxMessageBox(_T("账号在其他地方登陆"), MB_OK);
}

void CTICDemoDlg::onTICUserSigExpired()
{
	AfxMessageBox(_T("Sig过期"), MB_OK);
}

void CTICDemoDlg::UpdateUI(UserState state)
{
	switch (state)
	{
	case UserState::NotInit:
	{
		editClassId_.EnableWindow(FALSE);
		btnJoinRoom_.EnableWindow(FALSE);
		btnQuitRoom_.EnableWindow(FALSE);
		break;
	}
	case UserState::Init:
	{
		editClassId_.EnableWindow(TRUE);
		btnJoinRoom_.EnableWindow(FALSE);
		btnQuitRoom_.EnableWindow(FALSE);
		break;
	}
	case UserState::Login:
	{
		editClassId_.EnableWindow(TRUE);
		btnJoinRoom_.EnableWindow(TRUE);
		btnQuitRoom_.EnableWindow(FALSE);
		break;
	}
	case UserState::InRoom:
	{
		editClassId_.EnableWindow(FALSE);
		btnJoinRoom_.EnableWindow(FALSE);
		btnQuitRoom_.EnableWindow(TRUE);
		break;
	}
	default: break;
	}

	videoDlg_->UpdateUI(state);
	boardDlg_->UpdateUI();

	if (state != UserState::Unknown) {
		state_ = state;
	}
}
