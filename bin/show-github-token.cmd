@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\show-github-token" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\show-github-token" %*
)
