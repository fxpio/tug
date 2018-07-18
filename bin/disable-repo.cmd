@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\disable-repo" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\disable-repo" %*
)
