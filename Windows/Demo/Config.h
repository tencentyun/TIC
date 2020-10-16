//
//  Copyright © 2019 Tencent. All rights reserved.
//

#pragma once

#include <string>
#include <vector>

struct UserInfo {
  std::string userid;
  std::string usersig;
};

class Config {
 public:
  static Config& GetInstance();

  bool ReadConfig();

  int SdkAppId();
  const std::vector<UserInfo>& UserInfoList();

 private:
  Config();
  ~Config();

 private:
  int sdkAppId_ = 0;
  std::vector<UserInfo> userInfoList_;
};
