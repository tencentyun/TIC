//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "Config.h"

#include <vector>

#include "stdafx.h"

#define ConfigFile "config.json"

Config& Config::GetInstance() {
  static Config inst;
  return inst;
}

bool Config::ReadConfig() {
  std::ifstream is(ConfigFile);
  if (!is) return false;

  Json::Reader reader;
  Json::Value root;
  bool bRet = reader.parse(is, root);
  is.close();
  if (!bRet) return false;

  if (root["sdkappid"].isNull()) return false;
  sdkAppId_ = root["sdkappid"].asInt();

  if (root["users"].isNull()) return false;
  for (Json::ArrayIndex i = 0; i < root["users"].size(); ++i) {
    const Json::Value& jsonUser = root["users"][i];
    if (jsonUser["userId"].isNull()) return false;
    if (jsonUser["userToken"].isNull()) return false;

    UserInfo userInfo;
    userInfo.userid = jsonUser["userId"].asString();
    userInfo.usersig = jsonUser["userToken"].asString();
    userInfoList_.push_back(userInfo);
  }

  return true;
}

int Config::SdkAppId() { return sdkAppId_; }

const std::vector<UserInfo>& Config::UserInfoList() { return userInfoList_; }

Config::Config() {}

Config::~Config() {}
