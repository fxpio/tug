@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\package-deploy" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\package-deploy" %*
)
