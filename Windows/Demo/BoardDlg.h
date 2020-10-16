//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <memory>
#include <string>
#include <vector>

#include "..\SDK\TIC\localrecord\TICLocalRecord.h"
#include "afxwin.h"

enum class BoardState {
  NotInit,
  Inited,
};

// 涂鸦操作标签页
class CDrawTabDlg : public CDialogEx {
  DECLARE_MESSAGE_MAP()

 public:
  explicit CDrawTabDlg(CWnd *pParent = nullptr);

  // 对话框数据
#ifdef AFX_DESIGN_TIME
  enum { IDD = IDD_BOARD_TAB_DRAW };
#endif

  void Init();

  void UpdateUndoState(bool canUndo);
  void UpdateRedoState(bool canRedo);

  void UpdateBackgroundColor();
  void UpdateBoardScale();

 private:
  BOOL OnInitDialog() override;
  void DoDataExchange(CDataExchange *pDX) override;

  // 消息映射函数
  afx_msg void OnBnClickedChkEnableDraw();

  afx_msg void OnBnClickedBtnUndo();
  afx_msg void OnBnClickedBtnRedo();

  afx_msg void OnBnClickedBtnClearDraw();
  afx_msg void OnBnClickedBtnClearBoard();
  afx_msg void OnBnClickedBtnBkImage();

  afx_msg void OnBnClickedBtnBrushColor();
  afx_msg void OnBnClickedBtnBackColor();
  afx_msg void OnBnClickedBtnTextColor();

  afx_msg void OnCbnSelchangeComboToolType();

  afx_msg void OnNMCustomdrawSliderBrushThin(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnNMCustomdrawSliderTextSize(NMHDR *pNMHDR, LRESULT *pResult);

  afx_msg void OnBnClickedBtnSetBackH5();

  afx_msg void OnBnClickedBtnAddImage();

  afx_msg void OnNMCustomdrawSliderScale(NMHDR *pNMHDR, LRESULT *pResult);

 private:
  CButton chkDrawEnable_;

  CButton btnUndo_;
  CButton btnRedo_;

  CMFCButton btnBrushColor_;
  CMFCButton btnBackColor_;
  CMFCButton btnTextColor_;

  CComboBox comboToolType_;

  CSliderCtrl sliderBrushThin_;
  CSliderCtrl sliderTextSize_;

  CEdit editBackH5_;
  CEdit editAddImage_;

  CSliderCtrl sliderScale_;
};

// 白板操作标签页
class CBoardTabDlg : public CDialogEx {
  DECLARE_MESSAGE_MAP()

 public:
  explicit CBoardTabDlg(CWnd *pParent = nullptr);

  // 对话框数据
#ifdef AFX_DESIGN_TIME
  enum { IDD = IDD_BOARD_TAB_BOARD };
#endif

  void UpdateBoardList();
  void UpdateBoardRatio();
  void UpdateBoardContentFitMode();

 private:
  BOOL OnInitDialog() override;
  void DoDataExchange(CDataExchange *pDX) override;

  // 消息映射函数
  afx_msg void OnBnClickedBtnPrevBoard();
  afx_msg void OnBnClickedBtnNextBoard();
  afx_msg void OnBnClickedBtnPrevStep();
  afx_msg void OnBnClickedBtnNextStep();

  afx_msg void OnBnClickedBtnAddBoard();
  afx_msg void OnBnClickedBtnDelBoard();
  afx_msg void OnLbnSelchangeListBoard();

  afx_msg void OnCbnSelchangeComboRatio();
  afx_msg void OnCbnSelchangeComboFitMode();

 private:
  CButton chkResetStep_;
  CListBox listBoard_;

  CComboBox comboRatio_;
  CComboBox comboFitMode_;

 public:
  afx_msg void OnBnClickedBtnSnapshot();
  afx_msg void OnBnClickedBtnSyncAndReload();
};

// 文件操作标签页
class CFileTabDlg : public CDialogEx {
  DECLARE_MESSAGE_MAP()

 public:
  explicit CFileTabDlg(CWnd *pParent = nullptr);

  // 对话框数据
#ifdef AFX_DESIGN_TIME
  enum { IDD = IDD_BOARD_TAB_FILE };
#endif

  void UpdateFileList();

 private:
  BOOL OnInitDialog() override;
  void DoDataExchange(CDataExchange *pDX) override;

  // 消息映射函数
  afx_msg void OnBnClickedBtnAddFile();
  afx_msg void OnBnClickedBtnDelFile();
  afx_msg void OnNMDbClkListFile(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnBnClickedBtnAddH5();
  afx_msg void OnBnClickedBtnAddVideo();

 private:
  CListCtrl listFile_;
  CEdit editAddH5_;
  CEdit editAddVideo_;
};

// 文件操作标签页
class CRecordDlg : public CDialogEx,
                   public TEduRecordCallback,
                   public std::enable_shared_from_this<CRecordDlg> {
  DECLARE_MESSAGE_MAP()

 public:
  explicit CRecordDlg(CWnd *pParent = nullptr);

  // 对话框数据
#ifdef AFX_DESIGN_TIME
  enum { IDD = IDD_BOARD_TAB_RECORD };
#endif

 private:
  BOOL OnInitDialog() override;
  void DoDataExchange(CDataExchange *pDX) override;

  ///

  afx_msg void OnLvnItemchangedLocalRecord(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnNMDblclkLocalRecord(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnLvnItemchangedListLocalRecord(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnBnClickedBtnInit();
  afx_msg void OnBnClickedBtnExit();

  afx_msg void OnBnClickedBtnRefresshResult();
  afx_msg void OnNMDbClkListRecordFile(NMHDR *pNMHDR, LRESULT *pResult);

  void initRecord(int appid, const std::string &user, const std::string &sig);
  void startRecord();
  void stopRecord();
  void pauseRecord();
  void resumeRecord();
  void getRecord();
  void exitRecord();

  bool parseRecordInfos(const char *desc, bool &listIsFinished);
  void refreshRecordInfo();
  void getRecordState();

  // From TEduRecordCallback
  virtual void onGotStatus(const RecordState &state);

  struct RecordInfo {
    uint32_t RoomId = 0;
    uint64_t SplicTime = 0;
    uint64_t StartTime = 0;
    uint64_t VideoOutputDuration = 0;  // 单位是ms
    uint64_t VideoOutputSize = 0;

    std::string TaskId;
    std::string UserId;
    std::string VideoOutputId;
    std::string VideoOutputType;
    std::string VideoOutputUrl;
  };

 protected:
  CListCtrl mListRecord;
  TICLocalRecorder *mLocalRecorder;
  bool mIsAuth = false;
  std::vector<RecordInfo> mInfos;

 private:
  CEdit editAddH5_;
  CEdit editAddVideo_;

 public:
  afx_msg void OnBnClickedBtnStartRecord();
  afx_msg void OnBnClickedBtnStopRecord();
  afx_msg void OnBnClickedBtnPauseRecord();
  afx_msg void OnBnClickedBtnResumeRecord();
  CStatic mStaticAuth;
  CStatic mStaticRecord;
  CStatic mStaticUploadState;
};

class CBoardDlg : public CDialogEx,
                  public TEduBoardCallback,
                  public std::enable_shared_from_this<CBoardDlg> {
  DECLARE_MESSAGE_MAP()

 public:
  explicit CBoardDlg(CWnd *pParent = nullptr);

  // 对话框数据
#ifdef AFX_DESIGN_TIME
  enum { IDD = IDD_BOARD_DIALOG };
#endif

  void Init();
  void Uninit();
  void UpdateUI();

 private:
  BOOL OnInitDialog() override;
  void DoDataExchange(CDataExchange *pDX) override;

  void UpdateBoardPos();

  void UpdateThumbnailImages();

  // 消息映射函数
  afx_msg void OnSize(UINT nType, int cx, int cy);
  afx_msg HBRUSH OnCtlColor(CDC *pDC, CWnd *pWnd, UINT nCtlColor);
  afx_msg void OnTabSelChange(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg void OnLVNItemChangedListCtrl(NMHDR *pNMHDR, LRESULT *pResult);
  afx_msg LRESULT OnUpdateThumImage(WPARAM wParam, LPARAM lParam);

  // TEduBoardCallback
  // 通用事件回调
  void onTEBError(TEduBoardErrorCode code, const char *msg) override;
  void onTEBWarning(TEduBoardWarningCode code, const char *msg) override;
  // 基本流程回调
  void onTEBInit() override;
  void onTEBHistroyDataSyncCompleted() override;
  void onTEBSyncData(const char *data) override;
  void onTEBUndoStatusChanged(bool canUndo) override;
  void onTEBRedoStatusChanged(bool canRedo) override;
  void onTEBOffscreenPaint(const void *buffer, uint32_t width,
                           uint32_t height) {}
  // 涂鸦功能回调
  void onTEBImageStatusChanged(const char *boardId, const char *url,
                               TEduBoardImageStatus status) override {}
  void onTEBSetBackgroundImage(const char *url) override {}
  void onTEBBackgroundH5StatusChanged(const char *boardId, const char *url,
                                      TEduBoardBackgroundH5Status status) {}
  // 白板页操作回调
  void onTEBAddBoard(const TEduBoardStringList *boardList,
                     const char *fileId) override;
  void onTEBDeleteBoard(const TEduBoardStringList *boardList,
                        const char *fileId) override;
  void onTEBGotoBoard(const char *boardId, const char *fileId) override;
  void onTEBGotoStep(uint32_t currentStep, uint32_t totalStep) {}
  void onTEBSnapshot(const char *path) override;
  // 文件操作回调
  void onTEBFileTranscodeProgress(const char *path, const char *errorCode,
                                  const char *errorMsg,
                                  const TEduBoardTranscodeFileResult &result);
  void onTEBAddTranscodeFile(const char *fileId);
  void onTEBVideoStatusChanged(const char *fileId, TEduBoardVideoStatus status,
                               double progress, double duration) {}
  void onTEBH5FileStatusChanged(const char *fileId,
                                TEduBoardH5FileStatus status) {}
  void onTEBDeleteFile(const char *fileId) override;
  void onTEBSwitchFile(const char *fileId) override;
  void onTEBFileUploadProgress(const char *fileId, int currentBytes,
                               int totalBytes, int uploadSpeed,
                               double percent) override {}
  void onTEBFileUploadStatus(const char *fileId, TEduBoardUploadStatus status,
                             int errorCode, const char *errorMsg) override {}

 private:
  BoardState boardState_ = BoardState::NotInit;
  bool histroySync_;

  CStatic staticBoard_;

  CImageList imageList_;
  CListCtrl listThumb_;

  CTabCtrl tabBoardCtrl_;
  CDrawTabDlg drawTabDlg_;
  CBoardTabDlg boardTabDlg_;
  CFileTabDlg fileTabDlg_;
  std::shared_ptr<CRecordDlg> recordDlg_;
};
