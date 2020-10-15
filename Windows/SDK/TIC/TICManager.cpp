//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "TICManager.h"

#include "TICManagerImpl.h"

TICManager& TICManager::GetInstance() {
  static TICManagerImpl instance;
  return instance;
}
