//
//  Copyright © 2019 Tencent. All rights reserved.
//

#include "TICManagerImpl.h"

TICManager &TICManager::GetInstance() {
  static TICManagerImpl instance;
  return instance;
}
