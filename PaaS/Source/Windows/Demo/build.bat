@echo off

::环境变量设置
set VSPATH=D:\Program Files (x86)\Microsoft Visual Studio\2017
set ZIPPATH=D:\Program Files\7-Zip

::初始化VS
call "%VSPATH%\Professional\VC\Auxiliary\Build\vcvarsall.bat" x86

::清理目录和文件
if exist TICDemo.zip del /f /q TICDemo.zip
if exist bin rmdir bin /s /q
mkdir bin

::重新编译
devenv TICDemo.sln /rebuild release
ping -n 1 127.1 >nul

::拷贝文件
xcopy /y /e ..\SDK\TEduBoard\lib .\bin\
xcopy /y /e ..\SDK\TIC\localrecord\lib .\bin\
copy /y ..\SDK\TIM\lib\Release .\bin\
copy /y ..\SDK\TRTC\lib .\bin\
copy /y .\Release\TICDemo.exe .\bin\
copy /y config.json .\bin\
del /f /q .\bin\*.lib

::打包成zip
cd bin
"%ZIPPATH%\7z.exe" a TICDemo.zip
cd ..
ping -n 2 127.1 >nul

move /y .\bin\TICDemo.zip .

rmdir bin /s /q

pause