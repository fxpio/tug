@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\show-gitlab-oauth" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\show-gitlab-oauth" %*
)
