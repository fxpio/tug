@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\config" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\config" %*
)
