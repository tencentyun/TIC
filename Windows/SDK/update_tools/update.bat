@echo off

SET BOARD_SDK=%~dp0..\TEduBoard
SET IM_SDK=%~dp0..\TIM
SET TRTC_SDK=%~dp0..\TRTC

REM Check if is SDK compile mode, if so, copy SDK from build directory
SET BUILD_DIR=%~dp0..\..\..\..\build\win32
if exist %BUILD_DIR% (
echo SDK compile mode

REM Copy SDK
if exist %BUILD_DIR%\x86\sdk\Release (
XCOPY /Y /E %BUILD_DIR%\x86\sdk\Release %BOARD_SDK%\lib\x86\
)
if exist %BUILD_DIR%\x64\sdk\Release (
XCOPY /Y /E %BUILD_DIR%\x64\sdk\Release %BOARD_SDK%\lib\x64\
)

REM Copy header file
XCOPY /Y %~dp0..\..\..\..\sdk\win\sdk\TEduBoard.h %BOARD_SDK%\include\

REM Goto the end of script
echo SDK ready
goto :end
)


REM SDK download mode
echo SDK download mode
SET SDK_PATH=https://sdk.qcloudtiw.com/win32/
SET SDK_NAME=demo_sdk_20201109@1.zip
SET SDK_URL=%SDK_PATH%%SDK_NAME%
SET SDK_FILE=%~dp0..\temp\%SDK_NAME%

REM Download SDK
if exist %SDK_FILE% (
echo SDK already exists
) else (
%~dp0wget.exe --no-check-certificate -x -O %SDK_FILE% %SDK_URL%
if errorlevel 1 (
DEL /F /Q %SDK_FILE%
echo SDK download failed
) else (
REM Remove directories under SDK directory
RMDIR /S /Q %BOARD_SDK%
RMDIR /S /Q %IM_SDK%
RMDIR /S /Q %TRTC_SDK%

REM Unzip SDK
%~dp0unzip.exe %SDK_FILE% -d %~dp0..\
if errorlevel 1 (
echo SDK unzip failed
) else (
echo SDK ready
)
)
)

:end