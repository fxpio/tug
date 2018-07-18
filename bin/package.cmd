@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\package" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\package" %*
)
