@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\refresh-cache" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\refresh-cache" %*
)
