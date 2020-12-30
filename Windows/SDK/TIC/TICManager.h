//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <TIMCloud.h>
#include <TRTC/ITRTCCloud.h>
#include <TEduBoard.h>

#include <stdint.h>
#include <functional>
#include <vector>
#include <string>
#include <Windows.h>

#include "./jsoncpp/json.h"

#ifdef TIC_EXPORTS //��Ҫ��TIC����ΪDLL,��DLL��Ŀ����������Ԥ������TIC_EXPORTS����
#define TIC_API __declspec(dllexport)
#else
#define TIC_API
#endif

/**
 * �ڲ�ģ��
 */
enum TICModule {
  TICMODULE_IMSDK = 0,        //IMSDKģ��
  TICMODULE_TRTC = 1,        //TRTCģ��
  TICMODULE_BOARD = 2,        //BOARDģ��
  TICMODULE_TIC = 3,        //TICģ��
};

/**
 * ���ó���
 **/
enum TICClassScene {
  TIC_CLASS_SCENE_VIDEO_CALL = 0,    //ʵʱͨ��ģʽ��֧��1000�����³���������ʱ
  TIC_CLASS_SCENE_LIVE = 1,        //ֱ��ģʽ��֧��1000�����ϳ�����������600ms������ʱ
};

/**
 * �����ɫ
 * @brief ��������ֱ��ģʽ(TIC_CLASS_SCENE_LIVE)����ɫTIC_ROLE_TYPE_ANCHOR��������Ȩ��
 **/
enum TICRoleType {
  TIC_ROLE_TYPE_ANCHOR = 20,        //����
  TIC_ROLE_TYPE_AUDIENCE = 21,    //����
};

/**
 * ����ģ��
 * @brief ����ⲿʹ����TRTC�����Խ���TIC�ڲ���TRTCģ�顣
 * @brief �������TRTC��TRTC��س�ʼ����������Ч
 **/
enum TICDisableModule {
  TIC_DISABLE_MODULE_NONE = 0,        //Ĭ��ȫ������
  TIC_DISABLE_MODULE_TRTC = (1 << 1), //����TRTC
};

/**
 * TICͨ�ûص�
 * @param module	�����ģ��
 * @param code		������
 * @param desc		��������
 */
typedef std::function<void(TICModule /*module*/, int /*code*/, const char * /*desc*/)> TICCallback;

/**
 * IM��Ϣ�ص�
 */
struct TICMessageListener {
  /**
   * �յ�C2C�ı���Ϣ
   * @param fromUserId		���ʹ���Ϣ���û�id
   * @param text				�յ���Ϣ������
   */
  virtual void onTICRecvTextMessage(const std::string &fromUserId, const std::string &text) {}

  /**
   * �յ�C2C�Զ�����Ϣ
   * @param fromUserId		���ʹ���Ϣ���û�id
   * @param data				�յ���Ϣ������
   */
  virtual void onTICRecvCustomMessage(const std::string &fromUserId, const std::string &data) {}

  /**
   * �յ�Ⱥ�ı���Ϣ
   * @param fromUserId		���ʹ���Ϣ���û�id
   * @param text				�յ���Ϣ������
   */
  virtual void onTICRecvGroupTextMessage(const std::string &fromUserId, const std::string &text) {}

  /**
   * �յ�Ⱥ�Զ�����Ϣ
   * @param fromUserId		���ʹ���Ϣ���û�id
   * @param data				�յ���Ϣ������
   */
  virtual void onTICRecvGroupCustomMessage(const std::string &fromUserId,
                                           const std::string &data) {}

  /**
   * ������Ϣ
   * @param jsonMsg			�յ���IM��Ϣ����
   * @note �����յ�����Ϣ�����ڴ˻ص�����֪ͨ������ǰ���Ѿ���װ���ı����Զ�����Ϣ;
   */
  virtual void onTICRecvMessage(const std::string &jsonMsg) {}
};

/**
 * IM״̬�ص�
 */
struct TICIMStatusListener {
  /**
   * ��������(�˺��������豸��¼)
   */
  virtual void onTICForceOffline() {}

  /**
   * Sig����
   */
  virtual void onTICUserSigExpired() {}
};

/**
 * �¼��ص�
 */
struct TICEventListener {
  /**
   * userId��Ӧ��Զ����·����(������ͷ)��״̬֪ͨ
   * @param userId			�û���ʶ
   * @param available			true:��Ƶ�ɲ��ţ�false:��Ƶ���ر�
   */
  virtual void onTICUserVideoAvailable(const std::string &userId, bool available) {}

  /**
   * userId��Ӧ��Զ�˸�·����(����Ļ����\��Ƭ��)��״̬֪ͨ
   * @param userId			�û���ʶ
   * @param available			true:��Ƶ�ɲ��ţ�false:��Ƶ���ر�
   */
  virtual void onTICUserSubStreamAvailable(const std::string &userId, bool available) {}

  /**
   * userId��Ӧ��Զ����Ƶ��״̬֪ͨ
   * @param userId			�û���ʶ
   * @param available			true:��Ƶ�ɲ��ţ�false:��Ƶ���ر�
   */
  virtual void onTICUserAudioAvailable(const std::string &userId, bool available) {}

  /**
   * �û����뷿��
   * @param userIds			���뷿����û�id�б�
   */
  virtual void onTICMemberJoin(const std::vector<std::string> &userIds) {}

  /**
   * �û��˳�����
   * @param userIds			�˳�������û�id�б�
   */
  virtual void onTICMemberQuit(const std::vector<std::string> &userIds) {}

  /**
   * ���ñ�����
   */
  virtual void onTICClassroomDestroy() {}

  /**
   * �豸�¼�֪ͨ
   * @param deviceId			�豸ID
   * @param type				�豸����
   * @param state				�¼�����
   */
  virtual void onTICDevice(const std::string &deviceId,
                           TRTCDeviceType type,
                           TRTCDeviceState state) {}
};

/**
 * ���ò�������
 */
struct TICClassroomOption {
  uint32_t classId = 0;        //����ID��32λ���ͣ�ȡֵ��Χ[1, 4294967294]����ҵ���ά��

  bool openCamera = false;    //ָʾ�����ɹ����Ƿ��Զ�������ͷ
  std::string cameraId = "";        //ָʾҪ�򿪵�����ͷID����""��ʾ��Ĭ������ͷ

  bool openMic = false;    //ָʾ�����ɹ����Ƿ��Զ�����˷�
  std::string micId = "";        //ָʾҪ�򿪵���˷�ID����""��ʾ��Ĭ����˷�

  HWND rendHwnd = nullptr;    //ָʾ������Ⱦ���ػ���Ĵ���HWND

  TEduBoardInitParam boardInitParam;    //��ʼ���װ����
  TEduBoardCallback *boardCallback =
      nullptr; //�װ��¼��ص�����;���ڴ����ðװ��¼�����,���Ƽ��Լ�ʹ�ðװ�sdk��AddCallback()����;

  TICClassScene classScene = TIC_CLASS_SCENE_VIDEO_CALL; //���ó���;Ĭ��TIC_CLASS_SCENE_VIDEO_CALL
  TICRoleType roleType =
      TIC_ROLE_TYPE_ANCHOR; //���ý�ɫ;ֻ����classSceneΪTIC_CLASS_SCENE_LIVEʱ��Ч��Ĭ��TIC_ROLE_TYPE_ANCHOR

  bool compatSaas = false; //�Ƿ����SaaS; ����SaaS����ģʽ���ڲ�������һ������Ⱥ��;
};

/**
 * TICҵ������࣬��Ҫ���������Դ������������
 */
class TIC_API TICManager {
 public:
  /**
   * ��ȡTIC��������
   */
  static TICManager &GetInstance();

  /*********************************************************************************************
   *
   *										һ���������̽ӿ�
   *
   *********************************************************************************************/

  /**
   * ��ʼ��;
   * @param sdkAppId			����Ѷ�������sdkAppId
   * @param callback			�ص�
   * @return ������,0��ʾ�ɹ�
   */
  virtual void Init(int sdkAppId,
                    TICCallback callback,
                    uint32_t disableModule = TIC_DISABLE_MODULE_NONE) = 0;

  /**
   * �ͷ�;
   * @param callback			�ص�
   * @return ������,0��ʾ�ɹ�
   */
  virtual void Uninit(TICCallback callback) = 0;

  /**
   * ��¼
   * @param userId			�û�id
   * @param userSig			IM�û���ȨƱ��
   * @param callback			�ص�
   */
  virtual void Login(const std::string &userId,
                     const std::string &userSig,
                     TICCallback callback) = 0;

  /**
   * �ǳ�
   * @param callback			�ص�
   */
  virtual void Logout(TICCallback callback) = 0;

  /**
   * ��������
   * @param classId			����ID��32λ���ͣ�ȡֵ��Χ[1, 4294967294]����ҵ�����ɺ�ά��
   * @param callback			�ص�
   */
  virtual void CreateClassroom(uint32_t classId,
                               TICClassScene classScene,
                               TICCallback callback) = 0;

  /**
   * ���ٿ���
   * @param classId			����ID��32λ���ͣ�ȡֵ��Χ[1, 4294967294]����ҵ�����ɺ�ά��
   * @param callback			�ص�
   */
  virtual void DestroyClassroom(uint32_t classId, TICCallback callback) = 0;

  /**
   * �������
   * @param option			������ò���ѡ��μ�TICClassroomOption
   * @param callback			�ص�
   * @note ������������200�ˣ��������ô󷿼�ģʽ����ϸ������ο� https://cloud.tencent.com/document/product/680/35954#.E4.B8.87.E4.BA.BA.E5.A4.A7.E6.88.BF.E9.97.B4
   */
  virtual void JoinClassroom(const TICClassroomOption &option, TICCallback callback) = 0;

  /**
   * �˳�����
   * @param clearBoard		�Ƿ���հװ�
   * @param callback			�ص�
   */
  virtual void QuitClassroom(bool clearBoard, TICCallback callback) = 0;

  /**
   * �л���ɫ
   * @param role ��ɫ
   * @brief ֻ��classSceneΪTIC_CLASS_SCENE_LIVEʱ��Ч
   **/
  virtual void SwitchRole(TICRoleType role) = 0;

  /*********************************************************************************************
   *
   *										����IM��Ϣ�ӿ�
   *
   *********************************************************************************************/

  /**
   * ����C2C�ı���Ϣ
   * @param userId			��Ϣ������
   * @param text				�ı���Ϣ����
   * @param callback			�ص�
   */
  virtual void SendTextMessage(const std::string &userId,
                               const std::string &text,
                               TICCallback callback) = 0;

  /**
   * ����C2C�Զ�����Ϣ
   * @param userId			��Ϣ������
   * @param data				�Զ�����Ϣ����
   * @param callback			�ص�
   */
  virtual void SendCustomMessage(const std::string &userId,
                                 const std::string &data,
                                 TICCallback callback) = 0;

  /**
   * ����C2C��Ϣ
   * @param userId			��Ϣ������
   * @param jsonMsg			IM��Ϣ(Json�ַ���)
   * @param callback			�ص�
   */
  virtual void SendMessage(const std::string &userId,
                           const std::string &jsonMsg,
                           TICCallback callback) = 0;

  /**
   * ����Ⱥ�ı���Ϣ
   * @param text				�ı���Ϣ����
   * @param callback			�ص�
   */
  virtual void SendGroupTextMessage(const std::string &text, TICCallback callback) = 0;

  /**
   * ����Ⱥ�Զ�����Ϣ
   * @param data				�Զ�����Ϣ����
   * @param callback			�ص�
   */
  virtual void SendGroupCustomMessage(const std::string &data, TICCallback callback) = 0;

  /**
   * ����Ⱥ��Ϣ
   * @param jsonMsg			IM��Ϣ(Json�ַ���)
   * @param callback			�ص�
   */
  virtual void SendGroupMessage(const std::string &jsonMsg, TICCallback callback) = 0;


  /*********************************************************************************************
   *
   *										�����ڲ�ģ�����ӿ�
   *
   *********************************************************************************************/

  /**
   * ��ȡ�װ������
   * @return �װ������
   * @note ֻ�н�������ܻ�ȡ�����򷵻�ֵΪ��;
   */
  virtual TEduBoardController *GetBoardController() = 0;

  /**
   * ��ȡ����Ƶʵ��
   * @return TRTC����Ƶʵ��
   */
  virtual ITRTCCloud *GetTRTCCloud() = 0;

  /*********************************************************************************************
   *
   *										�ġ��ص���������ӿ�
   *
   *********************************************************************************************/

  /**
   * ���IM��Ϣ�����ص�
   * @param listener			�ص�
   * @note ������TICMessageListener�Ļص��е���AddMessageListener()\RemoveMessageListener(),��������;
   */
  virtual void AddMessageListener(TICMessageListener *listener) = 0;

  /**
   * �Ƴ�IM��Ϣ�����ص�
   * @param listener			�ص�
   * @note ������TICMessageListener�Ļص��е���AddMessageListener()\RemoveMessageListener(),��������;
   */
  virtual void RemoveMessageListener(TICMessageListener *listener) = 0;

  /**
   * ����¼������ص�
   * @param listener			�ص�
   * @note ������TICEventListener�Ļص��е���AddEventListener()\RemoveEventListener(),��������;
   */
  virtual void AddEventListener(TICEventListener *listener) = 0;

  /**
   * �Ƴ��¼������ص�
   * @param listener			�ص�
   * @note ������TICEventListener�Ļص��е���AddEventListener()\RemoveEventListener(),��������;
   */
  virtual void RemoveEventListener(TICEventListener *listener) = 0;

  /**
   * ���IM״̬�����ص�
   * @param listener			�ص�
   * @note ������TICIMStatusListener�Ļص��е���AddStatusListener()\RemoveStatusListener(),��������;
   */
  virtual void AddStatusListener(TICIMStatusListener *listener) = 0;

  /**
   * �Ƴ�IM״̬�����ص�
   * @param listener			�ص�
   * @note ������TICIMStatusListener�Ļص��е���AddStatusListener()\RemoveStatusListener(),��������;
   */
  virtual void RemoveStatusListener(TICIMStatusListener *listener) = 0;
};
