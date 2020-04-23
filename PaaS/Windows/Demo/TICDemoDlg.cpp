#include "stdafx.h"
#include "TICDemo.h"
#include "TICDemoDlg.h"
#include "afxdialogex.h"
#include "Config.h"

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
	ON_BN_CLICKED(IDC_BTN_LOGIN, &CTICDemoDlg::OnBtnLogin)
	ON_BN_CLICKED(IDC_BTN_LOGOUT, &CTICDemoDlg::OnBtnLogout)
	ON_BN_CLICKED(IDC_BTN_CREATE_ROOM, &CTICDemoDlg::OnBtnCreateRoom)
	ON_BN_CLICKED(IDC_BTN_DESTROY_ROOM, &CTICDemoDlg::OnBtnDestroyRoom)
	ON_BN_CLICKED(IDC_BTN_JOIN_ROOM, &CTICDemoDlg::OnBtnJoinRoom)
	ON_BN_CLICKED(IDC_BTN_QUIT_ROOM, &CTICDemoDlg::OnBtnQuitRoom)
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

	DDX_Control(pDX, IDC_COMBOX_USER, cbUser_);

	DDX_Control(pDX, IDC_EDIT_CLASSID, editClassId_);

	DDX_Control(pDX, IDC_BTN_LOGIN, btnLogin_);
	DDX_Control(pDX, IDC_BTN_LOGOUT, btnLogout_);
	DDX_Control(pDX, IDC_BTN_CREATE_ROOM, btnCreateRoom_);
	DDX_Control(pDX, IDC_BTN_DESTROY_ROOM, btnDestroyRoom_);
	DDX_Control(pDX, IDC_BTN_JOIN_ROOM, btnJoinRoom_);
	DDX_Control(pDX, IDC_BTN_QUIT_ROOM, btnQuitRoom_);
}

BOOL CTICDemoDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	SetIcon(hIcon_, TRUE);  // 设置大图标
	SetIcon(hIcon_, FALSE); // 设置小图标

	//插入TAB页
	tabCtrl_.InsertItem(0, _T("视频"));
	tabCtrl_.InsertItem(1, _T("白板"));

	videoDlg_->Create(IDD_VIDEO_DIALOG, &tabCtrl_);
	boardDlg_->Create(IDD_BOARD_DIALOG, &tabCtrl_);

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
	videoDlg_->ShowWindow(SW_SHOW);
	boardDlg_->MoveWindow(&clientRect);
	boardDlg_->ShowWindow(SW_HIDE);

	//用户列表
	const std::vector<UserInfo>& userInfoList = Config::GetInstance().UserInfoList();
	for (size_t i=0; i<userInfoList.size(); ++i)
	{
		cbUser_.InsertString(i, a2w(userInfoList[i].userid).c_str());
	}
	cbUser_.SetCurSel(0);

	//TIC回调
	TICManager::GetInstance().AddEventListener(videoDlg_.get());
	TICManager::GetInstance().AddMessageListener(videoDlg_.get());
	TICManager::GetInstance().AddStatusListener(this);
	std::weak_ptr<CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().Init(Config::GetInstance().SdkAppId(), [this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::Init);
		}
		else {
			UpdateUI(UserState::NotInit);
			showErrorMsg(module, code, desc);
		}
	});

	// 填写默认参数
	editClassId_.SetWindowText(_T("13582"));

	//设置版本信息;
	CString version;
	version.Format(_T("IMSDK: %s\n\nTRTC: %s\n\nTEduBoard: %s"),
		a2w(TIMGetSDKVersion()).c_str(),
		a2w(TICManager::GetInstance().GetTRTCCloud()->getSDKVersion()).c_str(),
		a2w(GetTEduBoardVersion()).c_str());

	GetDlgItem(IDC_VERSION)->SetWindowText(version);

	return TRUE;
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
		videoDlg_->ShowWindow(SW_SHOW);
		boardDlg_->ShowWindow(SW_HIDE);
		break;
	case 1:
		videoDlg_->ShowWindow(SW_HIDE);
		boardDlg_->ShowWindow(SW_SHOW);
		break;
	case 2:
		videoDlg_->ShowWindow(SW_HIDE);
		boardDlg_->ShowWindow(SW_HIDE);
		break;
	default:
		break;
	}
}

void CTICDemoDlg::OnBtnLogin()
{
	btnLogin_.EnableWindow(FALSE);

	int nSelectIndex = cbUser_.GetCurSel();
	const std::vector<UserInfo>& userInfoList = Config::GetInstance().UserInfoList();

	theApp.setUserId(userInfoList[nSelectIndex].userid);
	theApp.setUserSig(userInfoList[nSelectIndex].usersig);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().Login(userInfoList[nSelectIndex].userid, userInfoList[nSelectIndex].usersig, [this, weakSelf](TICModule module, int code, const char *desc){
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}
		
		if (code == 0) {
			UpdateUI(UserState::Login);
		}
		else {
			UpdateUI(UserState::Init);
			showErrorMsg(module, code, desc);
		}
	});
}

void CTICDemoDlg::OnBtnLogout()
{
	btnLogout_.EnableWindow(FALSE);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().Logout([this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::Init);
		}
		else {
			UpdateUI(UserState::Login);
			showErrorMsg(module, code, desc);
		}
	});
}

void CTICDemoDlg::OnBtnCreateRoom()
{
	CString str;
	editClassId_.GetWindowText(str);
	if (str.IsEmpty())
	{
		AfxMessageBox(_T("请先填写房间号"), MB_OK);
		return;
	}
	int classId = atoi( w2a( str.GetBuffer() ).c_str() );
	if (classId == 0)
	{
		AfxMessageBox(_T("房间号有误"), MB_OK);
		return;
	}

	btnCreateRoom_.EnableWindow(FALSE);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().CreateClassroom(classId, TIC_CLASS_SCENE_VIDEO_CALL,[this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::Login);
			AfxMessageBox(_T("创建课堂成功，请\"加入课堂\""), MB_OK);
		}
		else {
			UpdateUI(UserState::Login);
			
			if (code == 10021) {
				AfxMessageBox(_T("该课堂已被他人创建，请\"加入课堂\""), MB_OK);
			}
			else if (code == 10025) {
				AfxMessageBox(_T("该课堂已创建，请\"加入课堂\""), MB_OK);
			}
			else
			{
				showErrorMsg(module, code, desc);
			}
		}
	});
}

void CTICDemoDlg::OnBtnDestroyRoom()
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

	btnDestroyRoom_.EnableWindow(FALSE);

	std::weak_ptr< CTICDemoDlg> weakSelf = this->shared_from_this();
	TICManager::GetInstance().DestroyClassroom(classId, [this, weakSelf](TICModule module, int code, const char *desc) {
		std::shared_ptr<CTICDemoDlg> self = weakSelf.lock();
		if (!self)
		{
			return;
		}

		if (code == 0) {
			UpdateUI(UserState::Login);
			AfxMessageBox(_T("销毁房间成功"), MB_OK);
		}
		else {
			UpdateUI(UserState::Login);
			showErrorMsg(module, code, desc);
		}
	});
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

	btnJoinRoom_.EnableWindow(FALSE);

	TICClassroomOption option;
	option.classId = classId;
	option.boardCallback = boardDlg_.get();

	theApp.setClassId(classId);

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
			UpdateUI(UserState::Login);

			if (code == 10015) {
				AfxMessageBox(_T("课堂不存在，请\"创建课堂\""), MB_OK);
			}
			else {
				showErrorMsg(module, code, desc);
			}
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
			UpdateUI(UserState::InRoom);
			showErrorMsg(module, code, desc);
		}
	});
}

void CTICDemoDlg::onTICForceOffline()
{
	UpdateUI(UserState::Init);

	AfxMessageBox(_T("账号在其他地方登陆"), MB_OK);
}

void CTICDemoDlg::onTICUserSigExpired()
{
	AfxMessageBox(_T("Sig过期"), MB_OK);
}

void CTICDemoDlg::UpdateUI(UserState state)
{
	if (state != UserState::Unknown) {
		state_ = state;
	}
	switch (state_)
	{
	case UserState::Init:
	{
		editClassId_.EnableWindow(TRUE);
		btnLogin_.EnableWindow(TRUE);
		btnLogout_.EnableWindow(FALSE);
		btnCreateRoom_.EnableWindow(FALSE);
		btnDestroyRoom_.EnableWindow(FALSE);
		btnJoinRoom_.EnableWindow(FALSE);
		btnQuitRoom_.EnableWindow(FALSE);
		cbUser_.EnableWindow(TRUE);
		break;
	}
	case UserState::Login:
	{
		editClassId_.EnableWindow(TRUE);
		btnLogin_.EnableWindow(FALSE);
		btnLogout_.EnableWindow(TRUE);
		btnCreateRoom_.EnableWindow(TRUE);
		btnDestroyRoom_.EnableWindow(TRUE);
		btnJoinRoom_.EnableWindow(TRUE);
		btnQuitRoom_.EnableWindow(FALSE);
		cbUser_.EnableWindow(FALSE);
		break;
	}
	case UserState::InRoom:
	{
		editClassId_.EnableWindow(FALSE);
		btnLogin_.EnableWindow(FALSE);
		btnLogout_.EnableWindow(FALSE);
		btnCreateRoom_.EnableWindow(FALSE);
		btnDestroyRoom_.EnableWindow(FALSE);
		btnJoinRoom_.EnableWindow(FALSE);
		btnQuitRoom_.EnableWindow(TRUE);
		cbUser_.EnableWindow(FALSE);
		break;
	}
	default: break;
	}

	videoDlg_->UpdateUI(state_);
	boardDlg_->UpdateUI();
}
