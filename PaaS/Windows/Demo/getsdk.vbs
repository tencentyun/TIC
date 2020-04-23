strFileURL = "https://sdk.qcloudtiw.com/win32/demo_sdk.zip"

Function DownloadTo(url, dest)
	' Fetch the file
	Set objXMLHTTP = CreateObject("MSXML2.XMLHTTP")

	objXMLHTTP.open "GET", url, false
	objXMLHTTP.send()

	' Save the file
	If objXMLHTTP.Status = 200 Then
		Set objADOStream = CreateObject("ADODB.Stream")
		objADOStream.Open
		objADOStream.Type = 1

		objADOStream.Write objXMLHTTP.ResponseBody
		objADOStream.Position = 0

		objADOStream.SaveToFile dest
		objADOStream.Close
		Set objADOStream = Nothing
    Else
        'WScript.Echo "SDK download failed, quiting"
	    WScript.Quit
	End If

	Set objXMLHTTP = Nothing

	' Download complete
End Function

Function ExtractTo(file, dest)
	Set objShell = CreateObject("Shell.Application")
	Set objSource = objShell.NameSpace(file).Items()

	Set objTarget = objShell.NameSpace(dest)
	objTarget.CopyHere objSource, 256
End Function

'Make file path
Set fso = CreateObject("Scripting.FileSystemObject")
sParentPath = fso.GetAbsolutePathName("..")
strZipFile = sParentPath & "\" & "demo_sdk.zip"
outFolder = sParentPath & "\SDK"

If not fso.FileExists(strZipFile) Then
	'WScript.Echo "Downloading " & strFileURL
    DownloadTo strFileURL, strZipFile
End If


If fso.FolderExists(outFolder) Then
	fso.DeleteFolder(outFolder)
End If

fso.CreateFolder(outFolder)

'WScript.Echo "Extracting items to " & outFolder

ExtractTo strZipFile, outFolder


' Move files 
Set folder = fso.GetFolder(outFolder)

If folder.Files.Count = 0 AND folder.SubFolders.Count = 1 Then
	For Each subFolder In folder.SubFolders
        fso.MoveFolder subFolder & "/*.*", outFolder
        fso.DeleteFolder(subFolder)
	Next
end if


'WScript.Echo("download and unzip complete")