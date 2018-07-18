@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\delete-bucket" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\delete-bucket" %*
)
