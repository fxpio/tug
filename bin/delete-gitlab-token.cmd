@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\delete-gitlab-token" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\delete-gitlab-token" %*
)
