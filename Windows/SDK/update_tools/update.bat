@echo off

setlocal EnableDelayedExpansion

SET BOARD_SDK=%~dp0..\TEduBoard
SET IM_SDK=%~dp0..\TIM
SET TRTC_SDK=%~dp0..\TRTC
SET PLATFORM=%1
SET CONFIGURATION=%2
SET OUT_DIR=%3
SET ROBOCOPY_ARGS=/S /NP /V

REM Normalize platform string
if /I "%PLATFORM%" == "WIN32" (
SET PLATFORM=x86
)
if /I "%PLATFORM%" == "WIN64" (
SET PLATFORM=x64
)

REM Check if is SDK compile mode, if so, copy SDK from build directory
SET BUILD_DIR=%~dp0..\..\..\..\build\win32
if exist %BUILD_DIR% (
echo SDK preparing... [compile mode]

REM Copy SDK
robocopy %BUILD_DIR%\%PLATFORM%\sdk\Release %BOARD_SDK%\lib\%PLATFORM% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo SDK binary file copy success
) else (
echo SDK binary file copy failed: !errorlevel!
exit /b !errorlevel!
)

REM Copy header file
more /P <%~dp0..\..\..\..\sdk\win\sdk\TEduBoard.h >%BOARD_SDK%\include\TEduBoard.h
REM robocopy %~dp0..\..\..\..\sdk\win\sdk %BOARD_SDK%\include TEduBoard.h %ROBOCOPY_ARGS%
if !errorlevel! == 0 (
echo SDK header file copy success
) else (
echo SDK header file copy failed: !errorlevel!
exit /b !errorlevel!
)

REM Goto copy sdk
echo SDK prepare ready
goto :copySdk
)


REM SDK download mode
echo SDK preparing... [download mode]
SET SDK_PATH=https://sdk.qcloudtiw.com/win32/
SET SDK_NAME=demo_sdk_20201109@1.zip
SET SDK_URL=%SDK_PATH%%SDK_NAME%
SET SDK_FILE=%~dp0..\temp\%SDK_NAME%

REM Download SDK
if exist %SDK_FILE% (
echo SDK already exists
) else (
%~dp0wget.exe --no-check-certificate -x -O %SDK_FILE% %SDK_URL%
if !errorlevel! == 0 (
REM Remove directories under SDK directory
RMDIR /S /Q %BOARD_SDK%
RMDIR /S /Q %IM_SDK%
RMDIR /S /Q %TRTC_SDK%

REM Unzip SDK
%~dp0unzip.exe %SDK_FILE% -d %~dp0..\
if !errorlevel! == 0 (
echo SDK prepare ready
) else (
echo SDK unzip failed: !errorlevel!
exit /b !errorlevel!
)
) else (
DEL /F /Q %SDK_FILE%
echo SDK download failed: !errorlevel!
exit /b !errorlevel!
)
)

:copySdk

echo SDK copying...
if "%PLATFORM%" == "x86" (
robocopy %BOARD_SDK%\lib\x86 %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo Board SDK copy success
) else (
echo Board SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
robocopy %IM_SDK%\lib\Win32\%CONFIGURATION% %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo IM SDK copy success
) else (
echo IM SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
robocopy %TRTC_SDK%\Win32\lib %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo TRTC SDK copy success
) else (
echo TRTC SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
) else (
robocopy %BOARD_SDK%\lib\x64 %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo Board SDK copy success
) else (
echo Board SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
robocopy %IM_SDK%\lib\Win64\%CONFIGURATION% %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo IM SDK copy success
) else (
echo IM SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
robocopy %TRTC_SDK%\Win64\lib %OUT_DIR% %ROBOCOPY_ARGS%
if !errorlevel! LSS 8 (
echo TRTC SDK copy success
) else (
echo TRTC SDK copy failed: !errorlevel!
exit /b !errorlevel!
)
)
