@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\show-github-oauth" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\show-github-oauth" %*
)
