#pragma once

#include "VideoDlg.h"
#include "BoardDlg.h"
#include <memory>
#include "TIC\HttpClient.h"

class CTICDemoDlg
	: public CDialogEx
	, public TICIMStatusListener
	, public std::enable_shared_from_this< CTICDemoDlg>
{
	DECLARE_MESSAGE_MAP()
public:
	CTICDemoDlg(CWnd* pParent = nullptr);
	~CTICDemoDlg();

	// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_TICDEMO_DIALOG };
#endif

private:
	virtual void DoDataExchange(CDataExchange* pDX);
	virtual BOOL OnInitDialog();

	// 消息映射函数
	afx_msg HBRUSH OnCtlColor(CDC* pDC, CWnd* pWnd, UINT nCtlColor);
	afx_msg void OnSize(UINT nType, int cx, int cy);
	afx_msg void OnDestroy();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();

	afx_msg void OnTabSelChange(NMHDR *pNMHDR, LRESULT *pResult);

	afx_msg void OnBtnJoinRoom();
	afx_msg void OnBtnQuitRoom();

	//TICIMStatusListener
	virtual void onTICForceOffline() override;
	virtual void onTICUserSigExpired() override;

	void UpdateUI(UserState state = UserState::Unknown);

private:
	HICON hIcon_;

	CEdit editUser_;
	CEdit editClassId_;

	CButton btnJoinRoom_;
	CButton btnQuitRoom_;

	CTabCtrl tabCtrl_;
	std::shared_ptr<CVideoDlg> videoDlg_ = nullptr;
	std::shared_ptr<CBoardDlg> boardDlg_ = nullptr;

	UserState state_ = UserState::NotInit;

	HttpClient httpClient_;
public:
	afx_msg void OnTimer(UINT_PTR nIDEvent);
};
