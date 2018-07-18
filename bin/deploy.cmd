@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\deploy" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\deploy" %*
)
