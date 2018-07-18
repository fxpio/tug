@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\enable-repo" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\enable-repo" %*
)
