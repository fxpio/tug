@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\setup" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\setup" %*
)
